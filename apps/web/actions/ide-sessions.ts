"use server";

import { randomBytes, randomUUID } from "node:crypto";
import * as ecs from "@aws-sdk/client-ecs";
import * as efs from "@aws-sdk/client-efs";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { and, eq, or } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import {
	environments,
	ideSessions,
	projects,
	starterFolders,
	submissions,
} from "@/db/schema";
import {
	getWorkspaceUsername,
	type IdeSessionUser,
	toWorkspaceSegment,
} from "./ide-session-utils";
import { getLaunchableProject } from "./project-definitions";
import {
	authActionClient,
	getRequiredEnv,
	getS3Client,
	getUserSubscription,
} from "./utils";

async function getActiveIDESessionsForUser(userId: string) {
	return db
		.select()
		.from(ideSessions)
		.where(
			and(
				eq(ideSessions.user_id, userId),
				or(
					eq(ideSessions.status, "active"),
					eq(ideSessions.status, "provisioning"),
				),
			),
		);
}

export const getUserIDESessions = authActionClient.action(async ({ ctx }) => {
	try {
		const query = await db
			.select({
				session: ideSessions,
				project: {
					id: projects.id,
					name: projects.name,
					slug: projects.slug,
					availability_opens: projects.availability_opens,
					availability_closes: projects.availability_closes,
				},
				environment: {
					id: environments.id,
					name: environments.name,
					icon: environments.icon,
				},
				submission: {
					id: submissions.id,
				},
			})
			.from(ideSessions)
			.where(and(eq(ideSessions.user_id, ctx.session.user.id)))
			.leftJoin(projects, eq(projects.id, ideSessions.project_id))
			.leftJoin(submissions, eq(submissions.project_id, projects.id))
			.leftJoin(environments, eq(environments.id, projects.environment_id));

		return {
			success: true,
			sessions: query.map(
				({ session, project, environment, submission }) => ({
					...session,
					project: project!,
					environment: environment!,
					submission: submission || undefined,
				}),
			),
		};
	} catch (err) {
		console.log("Error fetching active IDE sessions:", err);
		throw new Error("Failed to fetch active IDE sessions");
	}
});

type ProvisionIdeSessionCommand = {
	user: IdeSessionUser;
	projectId: string;
	identifierSuffix?: string;
	starterFileOverride?: StarterFileReference;
};

type RestartIdeSessionCommand = {
	user: IdeSessionUser;
	projectId?: string;
	ideSessionId: string;
};

const ecsClient = new ecs.ECSClient();
const efsClient = new efs.EFSClient();
const IDE_RUNTIME_PLATFORM = {
	operatingSystemFamily: "LINUX" as const,
	cpuArchitecture: "ARM64" as const,
};

type IdeSessionIdentity = {
	id: string;
	userId: string;
	username: string;
	projectId: string;
	identifier: string;
};

type StarterFileReference = {
	bucket: string;
	key: string;
};

type IdeProvisioningConfig = {
	efsFileSystemId: string;
	ecsClusterName: string;
	ecsSecurityGroup: string;
	ecsSubnets: string[];
};

function getEcsSubnets() {
	const ecsSubnets = getRequiredEnv("ECS_SUBNETS")
		.split(",")
		.map((subnet) => subnet.trim())
		.filter(Boolean);

	if (ecsSubnets.length === 0) {
		throw new Error("ECS_SUBNETS must contain at least one subnet ID");
	}

	return ecsSubnets;
}

function getIdeProvisioningConfig(): IdeProvisioningConfig {
	return {
		efsFileSystemId: getRequiredEnv("EFS_FILESYSTEM_ID"),
		ecsClusterName: getRequiredEnv("ECS_CLUSTER_NAME"),
		ecsSecurityGroup: getRequiredEnv("ECS_SECURITY_GROUP"),
		ecsSubnets: getEcsSubnets(),
	};
}

function buildIdeSessionIdentity({
	user,
	projectId,
	projectSlug,
	identifierSuffix,
}: ProvisionIdeSessionCommand & { projectSlug: string }): IdeSessionIdentity {
	const username = getWorkspaceUsername(user);
	const projectSegment = [
		toWorkspaceSegment(projectSlug) || projectId,
		identifierSuffix ? toWorkspaceSegment(identifierSuffix) : null,
	]
		.filter(Boolean)
		.join("-");

	return {
		id: randomUUID(),
		userId: user.id,
		username,
		projectId,
		identifier: `${username}-${projectSegment}`,
	};
}

function parseTaskSize(value: string | undefined, resourceName: string) {
	const parsed = Number.parseInt(value ?? "", 10);
	if (Number.isNaN(parsed)) {
		throw new Error(`Task definition is missing ${resourceName}`);
	}

	return parsed;
}

async function createProvisioningSessionRecord(input: {
	identity: IdeSessionIdentity;
	taskDefinition: ecs.TaskDefinition;
	taskDefinitionArn: string;
}) {
	const [record] = await db
		.insert(ideSessions)
		.values({
			id: input.identity.id,
			user_id: input.identity.userId,
			identifier: input.identity.identifier,
			project_id: input.identity.projectId,
			memory: parseTaskSize(input.taskDefinition.memory, "memory"),
			cpu: parseTaskSize(input.taskDefinition.cpu, "cpu"),
			task_definition_arn: input.taskDefinitionArn,
			status: "provisioning",
		})
		.returning({
			id: ideSessions.id,
		});

	return record;
}

async function markSessionActive(sessionId: string, taskArn: string) {
	await db
		.update(ideSessions)
		.set({ status: "active", task_arn: taskArn })
		.where(eq(ideSessions.id, sessionId));
}

async function markSessionProvisioning(sessionId: string) {
	await db
		.update(ideSessions)
		.set({
			status: "provisioning",
			task_arn: null,
			started_at: new Date(),
			ended_at: null,
		})
		.where(eq(ideSessions.id, sessionId));
}

async function createClientEFSAccessPoint(input: {
	identity: IdeSessionIdentity;
	fileSystemId: string;
}) {
	try {
		const efsRes = await efsClient.send(
			new efs.CreateAccessPointCommand({
				ClientToken: input.identity.id,
				FileSystemId: input.fileSystemId,
				Tags: [
					{
						Key: "Name",
						Value: input.identity.identifier.toLowerCase(),
					},
					{
						Key: "IdeSessionId",
						Value: input.identity.id,
					},
				],
				PosixUser: {
					Uid: 6767,
					Gid: 6767,
				},
				RootDirectory: {
					Path: `/${input.identity.username}`,
					CreationInfo: {
						OwnerUid: 6767,
						OwnerGid: 6767,
						Permissions: "0755",
					},
				},
			}),
		);

		if (!efsRes.AccessPointId) {
			throw new Error("Failed to create EFS access point");
		}

		return {
			id: efsRes.AccessPointId,
		};
	} catch (err) {
		console.error("Error creating EFS access point:", err);
	}
}

async function describeTaskDefinition(taskDefinitionArn: string) {
	const response = await ecsClient.send(
		new ecs.DescribeTaskDefinitionCommand({
			taskDefinition: taskDefinitionArn,
		}),
	);

	if (!response.taskDefinition) {
		throw new Error("Task definition not found");
	}

	return response.taskDefinition;
}

async function registerSessionTaskDefinition(input: {
	identity: IdeSessionIdentity;
	baseTaskDefinition: ecs.TaskDefinition;
	fileSystemId: string;
	accessPointId: string;
}) {
	const ecsRes = await ecsClient.send(
		new ecs.RegisterTaskDefinitionCommand({
			family: `${input.baseTaskDefinition.family}-${input.identity.userId}`,
			containerDefinitions: input.baseTaskDefinition.containerDefinitions,
			networkMode: input.baseTaskDefinition.networkMode,
			executionRoleArn: input.baseTaskDefinition.executionRoleArn,
			taskRoleArn: input.baseTaskDefinition.taskRoleArn,
			requiresCompatibilities: input.baseTaskDefinition.requiresCompatibilities,
			runtimePlatform: IDE_RUNTIME_PLATFORM,
			cpu: input.baseTaskDefinition.cpu,
			memory: input.baseTaskDefinition.memory,
			volumes: [
				{
					name: "student-workspace-volume",
					efsVolumeConfiguration: {
						fileSystemId: input.fileSystemId,
						transitEncryption: "ENABLED",
						authorizationConfig: {
							accessPointId: input.accessPointId,
							iam: "ENABLED",
						},
						rootDirectory: "/",
					},
				},
			],
		}),
	);

	const taskDefinition = ecsRes.taskDefinition;
	if (!taskDefinition) {
		throw new Error("Failed to register task definition");
	}
	const taskDefinitionArn = taskDefinition.taskDefinitionArn;
	if (!taskDefinitionArn) {
		throw new Error("Registered task definition did not include an ARN");
	}

	return {
		taskDefinition,
		taskDefinitionArn,
	};
}

function jsonToEnvironmentOverride(json: Record<string, string>) {
	return Object.entries(json).map(([name, value]) => ({
		name,
		value,
	}));
}

function getIdeSessionUrl(identifier: string) {
	return `https://${identifier}-ide.studentide.com`;
}

async function getSignedStarterFileUrl(source: StarterFileReference) {
	const command = new GetObjectCommand({
		Bucket: source.bucket,
		Key: source.key,
	});

	return getSignedUrl(getS3Client(), command, {
		expiresIn: 3600,
	});
}

async function getProjectStarterFile(project: {
	starter_folder_id: string | null;
}): Promise<StarterFileReference | undefined> {
	if (!project.starter_folder_id) {
		return undefined;
	}

	const [starterFolder] = await db
		.select({
			path: starterFolders.path,
		})
		.from(starterFolders)
		.where(
			and(
				eq(starterFolders.id, project.starter_folder_id),
				eq(starterFolders.status, "active"),
			),
		)
		.limit(1);

	if (!starterFolder) {
		throw new Error("Project starter folder not found");
	}

	return {
		bucket: getRequiredEnv("AWS_S3_STARTER_FOLDER_BUCKET_NAME"),
		key: starterFolder.path,
	};
}

async function runSessionTask(input: {
	identity: IdeSessionIdentity;
	config: IdeProvisioningConfig;
	taskDefinitionArn: string;
	sessionSecret: string;
	starterFileUrl?: string;
}) {
	const runRes = await ecsClient.send(
		new ecs.RunTaskCommand({
			cluster: input.config.ecsClusterName,
			taskDefinition: input.taskDefinitionArn,
			count: 1,
			launchType: "FARGATE",
			networkConfiguration: {
				awsvpcConfiguration: {
					subnets: input.config.ecsSubnets,
					securityGroups: [input.config.ecsSecurityGroup],
					assignPublicIp: "ENABLED",
				},
			},
			overrides: {
				containerOverrides: [
					{
						name: "watchdog",
						environment: jsonToEnvironmentOverride({
							PROJECT_ID: input.identity.projectId,
							MAX_SESSION_SECONDS: `${1 * 60 * 60}`,
							MAX_SIZE_MB: `${1000}`,
						}),
					},
					{
						name: "reverse-proxy",
						environment: jsonToEnvironmentOverride({
							SESSION_SECRET: input.sessionSecret,
							UPSTREAM_TARGET: "localhost:3000",
						}),
					},
					{
						name: "environment",
						environment: jsonToEnvironmentOverride({
							PROJECT_ID: input.identity.projectId,
							IDENTIFIER: input.identity.identifier,
							...(input.starterFileUrl
								? { starterFile: input.starterFileUrl }
								: {}),
						}),
					},
				],
			},
		}),
	);

	if (runRes.failures?.length) {
		throw new Error("Failed to run ECS task");
	}

	return runRes;
}

async function provisionAwsIDESession({
	user,
	projectId,
	identifierSuffix,
	starterFileOverride,
}: ProvisionIdeSessionCommand) {
	const config = getIdeProvisioningConfig();
	const project = await getLaunchableProject({
		projectId,
		userId: user.id,
	});

	const identity = buildIdeSessionIdentity({
		user,
		projectId,
		projectSlug: project.slug,
		identifierSuffix,
	});

	const accessPoint = await createClientEFSAccessPoint({
		identity,
		fileSystemId: config.efsFileSystemId,
	});
	if (!accessPoint) {
		throw new Error("Failed to create EFS access point");
	}

	const baseTaskDefinition = await describeTaskDefinition(
		project.environment.task_definition_arn,
	);
	const sessionTaskDefinition = await registerSessionTaskDefinition({
		identity,
		baseTaskDefinition,
		fileSystemId: config.efsFileSystemId,
		accessPointId: accessPoint.id,
	});

	await createProvisioningSessionRecord({
		identity,
		taskDefinition: sessionTaskDefinition.taskDefinition,
		taskDefinitionArn: sessionTaskDefinition.taskDefinitionArn,
	});

	const starterFile =
		starterFileOverride ?? (await getProjectStarterFile(project));
	const starterFileUrl = starterFile
		? await getSignedStarterFileUrl(starterFile)
		: undefined;

	const runRes = await runSessionTask({
		identity,
		config,
		taskDefinitionArn: sessionTaskDefinition.taskDefinitionArn,
		sessionSecret: randomBytes(32).toString("hex"),
		starterFileUrl,
	});
	const task = runRes.tasks?.[0];
	if (!task || !task.taskArn) {
		throw new Error("Failed to run session task");
	}

	await markSessionActive(identity.id, task.taskArn);

	return {
		id: identity.id,
		identifier: identity.identifier,
		url: getIdeSessionUrl(identity.identifier),
	};
}

async function getRestartSessionRecord({
	user,
	projectId,
	ideSessionId,
}: RestartIdeSessionCommand) {
	const [session] = await db
		.select()
		.from(ideSessions)
		.where(
			and(eq(ideSessions.id, ideSessionId), eq(ideSessions.user_id, user.id)),
		);

	if (!session) {
		throw new Error("IDE session not found");
	}

	if (projectId && session.project_id !== projectId) {
		throw new Error("IDE session not found for project");
	}

	if (!session.project_id) {
		throw new Error("IDE session is missing a project");
	}

	if (session.status === "active" || session.status === "provisioning") {
		throw new Error("IDE session is already running");
	}

	return {
		...session,
		project_id: session.project_id,
	};
}

async function restartAwsIDESession(input: RestartIdeSessionCommand) {
	const config = getIdeProvisioningConfig();
	const session = await getRestartSessionRecord(input);
	const identity: IdeSessionIdentity = {
		id: session.id,
		userId: input.user.id,
		username: getWorkspaceUsername(input.user),
		projectId: session.project_id,
		identifier: session.identifier,
	};

	await markSessionProvisioning(session.id);

	const runRes = await runSessionTask({
		identity,
		config,
		taskDefinitionArn: session.task_definition_arn,
		sessionSecret: randomBytes(32).toString("hex"),
	});
	const task = runRes.tasks?.[0];
	if (!task || !task.taskArn) {
		throw new Error("Failed to run session task");
	}

	await markSessionActive(session.id, task.taskArn);

	return {
		id: session.id,
		identifier: session.identifier,
		url: getIdeSessionUrl(session.identifier),
	};
}

const launchIDESessionSchema = z
	.object({
		projectId: z.string().min(1).optional(),
		ideSessionId: z.string().uuid().optional(),
	})
	.refine((input) => input.projectId || input.ideSessionId, {
		message: "A project ID or IDE session ID is required",
	});

const launchSubmissionIDESessionSchema = z.object({
	submissionId: z.string().uuid(),
});

async function assertUserCanLaunchIDESession(userId: string) {
	const activePlan = await getUserSubscription();
	if (!activePlan?.limits) {
		throw new Error("Failed to fetch active subscription");
	}

	let activeIDESessions: Awaited<
		ReturnType<typeof getActiveIDESessionsForUser>
	>;
	try {
		activeIDESessions = await getActiveIDESessionsForUser(userId);
	} catch (err) {
		console.log("Error fetching active IDE sessions:", err);
		throw new Error("Failed to fetch active IDE sessions");
	}

	if (activeIDESessions.length >= activePlan.limits.maxActiveIDESessions) {
		throw new Error(
			"You have reached the maximum number of active IDE sessions for your plan.",
		);
	}
}

async function getTeacherSubmissionForLaunch(input: {
	submissionId: string;
	teacherId: string;
}) {
	const [result] = await db
		.select({
			submission: submissions,
			project: projects,
		})
		.from(submissions)
		.innerJoin(projects, eq(projects.id, submissions.project_id))
		.where(eq(submissions.id, input.submissionId))
		.limit(1);

	if (!result) {
		throw new Error("Submission not found");
	}

	if (result.project.user_id !== input.teacherId) {
		throw new Error("Unauthorized");
	}

	if (!result.submission.project_id) {
		throw new Error("Submission is missing a project");
	}

	return {
		submission: {
			...result.submission,
			project_id: result.submission.project_id,
		},
		project: result.project,
	};
}

export const launchIDESession = authActionClient
	.inputSchema(launchIDESessionSchema)
	.action(async ({ ctx, parsedInput }) => {
		await assertUserCanLaunchIDESession(ctx.session.user.id);

		const user = {
			id: ctx.session.user.id,
			name: ctx.session.user.name,
			username: ctx.session.user.username,
		};

		let session: Awaited<ReturnType<typeof provisionAwsIDESession>>;
		if (parsedInput.ideSessionId) {
			session = await restartAwsIDESession({
				ideSessionId: parsedInput.ideSessionId,
				projectId: parsedInput.projectId,
				user,
			});
		} else {
			if (!parsedInput.projectId) {
				throw new Error("A project ID is required to launch a new IDE session");
			}

			session = await provisionAwsIDESession({
				projectId: parsedInput.projectId,
				user,
			});
		}

		return { success: true, session };
	});

export const launchSubmissionIDESession = authActionClient
	.inputSchema(launchSubmissionIDESessionSchema)
	.action(async ({ ctx, parsedInput }) => {
		await assertUserCanLaunchIDESession(ctx.session.user.id);

		const { submission } = await getTeacherSubmissionForLaunch({
			submissionId: parsedInput.submissionId,
			teacherId: ctx.session.user.id,
		});

		const session = await provisionAwsIDESession({
			projectId: submission.project_id,
			user: {
				id: ctx.session.user.id,
				name: ctx.session.user.name,
				username: ctx.session.user.username,
			},
			identifierSuffix: `submission-${submission.id.slice(0, 8)}`,
			starterFileOverride: {
				bucket: getRequiredEnv("AWS_S3_SUBMISSIONS_BUCKET_NAME"),
				key: submission.content_path,
			},
		});

		return { success: true, session };
	});

async function killIdeSessionTask(taskArn: string) {
	await ecsClient.send(
		new ecs.StopTaskCommand({
			cluster: getRequiredEnv("ECS_CLUSTER_NAME"),
			task: taskArn,
			reason: "Stopped by user - from server",
		}),
	);
}

async function markSessionTerminated(sessionId: string) {
	await db
		.update(ideSessions)
		.set({ status: "terminated", ended_at: new Date() })
		.where(eq(ideSessions.id, sessionId));
}

export const stopIDESession = authActionClient
	.inputSchema(z.object({ ideSessionId: z.string().uuid() }))
	.action(async ({ ctx, parsedInput }) => {
		const sessionId = parsedInput.ideSessionId;

		const [session] = await db
			.select()
			.from(ideSessions)
			.where(
				and(
					eq(ideSessions.id, sessionId),
					eq(ideSessions.user_id, ctx.session.user.id),
				),
			);

		if (!session) {
			throw new Error("IDE session not found");
		}

		if (session.status !== "active") {
			throw new Error("IDE session is not active");
		}

		if (!session.task_arn) {
			throw new Error("IDE session is missing task ARN");
		}

		try {
			await killIdeSessionTask(session.task_arn);
			await markSessionTerminated(session.id);
		} catch (err) {
			console.error("Error stopping IDE session:", err);
			throw new Error("Failed to stop IDE session");
		}

		return { success: true };
	});
