"use server";

import crypto from "node:crypto";
import * as ecs from "@aws-sdk/client-ecs";
import * as efs from "@aws-sdk/client-efs";
import { headers } from "next/headers";
import { auth } from "@/lib/auth"; // path to your Better Auth server instance

async function getServerSession() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	return session;
}

const ecsClient = new ecs.ECSClient();
const efsClient = new efs.EFSClient();
const IDE_RUNTIME_PLATFORM = {
	operatingSystemFamily: "LINUX" as const,
	cpuArchitecture: "ARM64" as const,
};

function getRequiredEnv(name: string) {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}
	return value;
}

export async function beginIdeSession(taskArn: string, projectId: string) {
	// accept task definition arn
	// pull definition description
	// create new access point
	// add as mount to the task definition
	// create new definition
	// run task
	const session = await getServerSession();
	if (!session) {
		throw new Error("Unauthorized");
	}
	const efsFileSystemId = getRequiredEnv("EFS_FILESYSTEM_ID");

	const efsCommand = new efs.CreateAccessPointCommand({
		// ClientToken: session.user.id,
		FileSystemId: efsFileSystemId,
		PosixUser: {
			Uid: 6767,
			Gid: 6767,
		},
		RootDirectory: {
			Path: `/${session.user.username}`, // Must start with a slash
			CreationInfo: {
				OwnerUid: 6767,
				OwnerGid: 6767,
				Permissions: "0755", // Standard directory permissions
			},
		},
	});
	const efsRes = await efsClient.send(efsCommand);
	if (!efsRes.AccessPointId) {
		throw new Error("Failed to create EFS access point");
	}

	const command = new ecs.DescribeTaskDefinitionCommand({
		taskDefinition: taskArn,
	});
	const response = await ecsClient.send(command);

	const taskDefinition = response.taskDefinition;
	if (!taskDefinition) {
		throw new Error("Task definition not found");
	}

	const ecsRes = await ecsClient.send(
		new ecs.RegisterTaskDefinitionCommand({
			family: `${taskDefinition.family}-${session.user.id}`,
			containerDefinitions: taskDefinition.containerDefinitions,
			networkMode: taskDefinition.networkMode,
			executionRoleArn: taskDefinition.executionRoleArn,
			taskRoleArn: taskDefinition.taskRoleArn,
			requiresCompatibilities: taskDefinition.requiresCompatibilities,
			runtimePlatform: IDE_RUNTIME_PLATFORM,
			cpu: taskDefinition.cpu,
			memory: taskDefinition.memory,
			volumes: [
				{
					name: "student-workspace-volume",
					efsVolumeConfiguration: {
						fileSystemId: efsFileSystemId,
						transitEncryption: "ENABLED",
						authorizationConfig: {
							accessPointId: efsRes.AccessPointId,
							iam: "ENABLED",
						},
						rootDirectory: "/",
					},
				},
			],
		}),
	);

	const taskDef = ecsRes.taskDefinition;
	if (!taskDef) {
		throw new Error("Failed to register task definition");
	}
	if (!taskDef.taskDefinitionArn) {
		throw new Error("Registered task definition did not include an ARN");
	}

	const sessionSecret = crypto.randomBytes(32).toString("hex");
	const ecsSubnets = getRequiredEnv("ECS_SUBNETS")
		.split(",")
		.map((subnet) => subnet.trim())
		.filter(Boolean);
	if (ecsSubnets.length === 0) {
		throw new Error("ECS_SUBNETS must contain at least one subnet ID");
	}

	const runCommand = new ecs.RunTaskCommand({
		cluster: getRequiredEnv("ECS_CLUSTER_NAME"),
		taskDefinition: taskDef.taskDefinitionArn,
		count: 1,
		launchType: "FARGATE",
		networkConfiguration: {
			awsvpcConfiguration: {
				subnets: ecsSubnets,
				securityGroups: [getRequiredEnv("ECS_SECURITY_GROUP")],
				assignPublicIp: "ENABLED",
			},
		},
		overrides: {
			containerOverrides: [
				{
					name: "watchdog",
					environment: [
						{
							name: "PROJECT_ID",
							value: projectId,
						},
						{
							name: "MAX_SESSION_SECONDS",
							value: `${1 * 60 * 60}`, // 1 hour
						},
						{
							name: "MAX_SIZE_MB",
							value: `${1000}`, // 1 GB
						},
					],
				},
				{
					name: "reverse-proxy",
					environment: [
						{
							name: "SESSION_SECRET",
							value: sessionSecret,
						},
						{
							name: "UPSTREAM_TARGET",
							value: "localhost:3000",
						},
					],
				},
				{
					name: "environment",
					environment: [
						{
							name: "PROJECT_ID",
							value: projectId,
						},
						{
							name: "IDENTIFIER",
							value: `${session.user.name}-${projectId}`.toLowerCase(),
						},
						// TODO: Add starter file url
					],
				},
			],
		},
	});
	const runRes = await ecsClient.send(runCommand);

	console.log("Run task response:", runRes);
}
