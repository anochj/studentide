"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { ideSessions } from "@/db/schema";
import * as ecs from "@aws-sdk/client-ecs";
import * as efs from "@aws-sdk/client-efs";
import { authActionClient, getRequiredEnv, getUserSubscription } from "./utils";
import { getLaunchableProject } from "./project-definitions";

const projectIdSchema = z.object({
	projectId: z.string().min(1),
});

async function getActiveIDESessionsForUser(userId: string) {
	return db
		.select()
		.from(ideSessions)
		.where(
			and(eq(ideSessions.user_id, userId), eq(ideSessions.status, "active")),
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
	username: string;
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

async function createProvisioningSessionRecord(
	command: ProvisionIdeSessionCommand,
	project: Awaited<ReturnType<typeof getLaunchableProject>>,
) {
	const [record] = await db
		.insert(ideSessions)
		.values({
			user_id: command.user.id,
			// TODO: Add collision detection
			identifier: `${command.user.username}-${project.slug}`.toLowerCase(),
			project_id: command.projectId,
			task_definition_arn: "",
			status: "provisioning",
		})
		.returning({
			id: ideSessions.id,
		});

	return record;
}

async function createClientEFSAccessPoint(user: User) {
	const efsFileSystemId = getRequiredEnv("EFS_FILESYSTEM_ID");

}

async function provisionAwsIDESession({
	user,
	projectId,
}: ProvisionIdeSessionCommand) {
	const project = await getLaunchableProject({
		projectId,
		userId: user.id,
	});
	const ideSessionId = await createProvisioningSessionRecord(
		{ user, projectId },
		project,
	);
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

		await provisionAwsIDESession(parsedInput.projectId);

		return { success: true };
	});
