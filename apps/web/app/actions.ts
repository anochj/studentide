"use server";

import { auth } from "@/lib/auth"; // path to your Better Auth server instance
import { headers } from "next/headers";
import * as ecs from "@aws-sdk/client-ecs";
import * as efs from "@aws-sdk/client-efs";

async function getServerSession() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	return session;
}

// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ecs/command/DescribeTasksCommand/
const ecsClient = new ecs.ECSClient();
const efsClient = new efs.EFSClient();

async function beginIdeSession(taskArn: string) {
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

	const efsCommand = new efs.CreateAccessPointCommand({
		ClientToken: session.user.id,
		FileSystemId: process.env.EFS_FILESYSTEM_ID!,
		PosixUser: {
			Uid: 1000,
			Gid: 1000,
		},
		RootDirectory: {
            Path: `/${session.user.username}`, // Must start with a slash
            CreationInfo: {
                OwnerUid: 1000,
                OwnerGid: 1000,
                Permissions: "0755" // Standard directory permissions
            }
        },
	});
	const efsRes = await efsClient.send(efsCommand);

	

	const command = new ecs.DescribeTaskDefinitionCommand({
		taskDefinition: taskArn,
	});
	const response = await ecsClient.send(command);

	const taskDefinition = response.taskDefinition;
	if (!taskDefinition) {
		throw new Error("Task definition not found");
	}

	const data = await ecsClient.send(
		new ecs.RegisterTaskDefinitionCommand({
			family: taskDefinition.family,
            containerDefinitions: taskDefinition.containerDefinitions,
            networkMode: taskDefinition.networkMode,
            executionRoleArn: taskDefinition.executionRoleArn,
            taskRoleArn: taskDefinition.taskRoleArn,
            requiresCompatibilities: taskDefinition.requiresCompatibilities,
            cpu: taskDefinition.cpu,
            memory: taskDefinition.memory,
			volumes: [
                {
                    name: "student-workspace-volume",
                    efsVolumeConfiguration: {
                        fileSystemId: process.env.EFS_FILESYSTEM_ID!,
                        transitEncryption: "ENABLED",
                        authorizationConfig: {
                            accessPointId: efsRes.AccessPointId, 
                            iam: "ENABLED"
                        },
                        rootDirectory: "/",
                    },
                }
            ]
		}),
	);

	console.log(
		"Success! Task Definition ARN:",
		data.taskDefinition?.taskDefinitionArn,
	);
}
