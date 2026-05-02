"use server";

import { randomBytes, randomUUID } from "node:crypto";
import * as ecs from "@aws-sdk/client-ecs";
import * as efs from "@aws-sdk/client-efs";
import { and, eq, or } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { environments, ideSessions } from "@/db/schema";
import { getLaunchableProject } from "./project-definitions";
import { authActionClient, getRequiredEnv, getUserSubscription } from "./utils";

const projectIdSchema = z.object({
	projectId: z.string().min(1),
});

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

export const getActiveIDESessions = authActionClient.action(async ({ ctx }) => {
	try {
		const activeIDESessions = await getActiveIDESessionsForUser(
			ctx.session.user.id,
		);

		return { success: true, sessions: activeIDESessions };
	} catch (err) {
		console.log("Error fetching active IDE sessions:", err);
		throw new Error("Failed to fetch active IDE sessions");
	}
});

type User = {
	id: string;
	name: string;
	username?: string | null;
};

type ProvisionIdeSessionCommand = {
	user: User;
	projectId: string;
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

function toWorkspaceSegment(value: string) {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9-]/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}

function getUsername(user: User) {
	return toWorkspaceSegment(user.username || user.name || user.id) || user.id;
}

function buildIdeSessionIdentity({
	user,
	projectId,
	projectSlug,
}: ProvisionIdeSessionCommand & { projectSlug: string }): IdeSessionIdentity {
	const username = getUsername(user);
	const projectSegment = toWorkspaceSegment(projectSlug) || projectId;

	return {
		id: randomUUID(),
		userId: user.id,
		username,
		projectId,
		identifier: `${username}-${projectSegment}`,
	};
}

async function getProjectTaskDefinitionArn(environmentId: number) {
	const [environment] = await db
		.select({
			taskDefinitionArn: environments.task_definition_arn,
		})
		.from(environments)
		.where(eq(environments.id, environmentId));

	if (!environment) {
		throw new Error("Environment not found");
	}

	return environment.taskDefinitionArn;
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

async function createClientEFSAccessPoint(input: {
	identity: IdeSessionIdentity;
	fileSystemId: string;
}) {
	try {
		const efsRes = await efsClient.send(
			new efs.CreateAccessPointCommand({
				ClientToken: input.identity.id,
				FileSystemId: input.fileSystemId,
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

async function runSessionTask(input: {
	identity: IdeSessionIdentity;
	config: IdeProvisioningConfig;
	taskDefinitionArn: string;
	sessionSecret: string;
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
	});
	const baseTaskDefinitionArn = await getProjectTaskDefinitionArn(
		project.environment_id,
	);
	const accessPoint = await createClientEFSAccessPoint({
		identity,
		fileSystemId: config.efsFileSystemId,
	});
	if (!accessPoint) {
		throw new Error("Failed to create EFS access point");
	}

	const baseTaskDefinition = await describeTaskDefinition(
		baseTaskDefinitionArn,
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

	const runRes = await runSessionTask({
		identity,
		config,
		taskDefinitionArn: sessionTaskDefinition.taskDefinitionArn,
		sessionSecret: randomBytes(32).toString("hex"),
	});
	const task = runRes.tasks?.[0];
	if (!task || !task.taskArn) {
		throw new Error("Failed to run session task");
	}

	await markSessionActive(identity.id, task.taskArn);
}

export const launchIDESession = authActionClient
	.inputSchema(projectIdSchema)
	.action(async ({ ctx, parsedInput }) => {
		const activePlan = await getUserSubscription();
		if (!activePlan?.limits) {
			throw new Error("Failed to fetch active subscription");
		}

		let activeIDESessions: Awaited<
			ReturnType<typeof getActiveIDESessionsForUser>
		>;
		try {
			activeIDESessions = await getActiveIDESessionsForUser(
				ctx.session.user.id,
			);
		} catch (err) {
			console.log("Error fetching active IDE sessions:", err);
			throw new Error("Failed to fetch active IDE sessions");
		}

		if (activeIDESessions.length >= activePlan.limits.maxActiveIDESessions) {
			throw new Error(
				"You have reached the maximum number of active IDE sessions for your plan.",
			);
		}

		await provisionAwsIDESession({
			projectId: parsedInput.projectId,
			user: {
				id: ctx.session.user.id,
				name: ctx.session.user.name,
				username: ctx.session.user.username,
			},
		});

		return { success: true };
	});
