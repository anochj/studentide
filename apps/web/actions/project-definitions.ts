// FILE HANDLING LOGIC FOR PROJECT DEFINITIONS
"use server";

import { randomBytes, randomUUID } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { and, eq } from "drizzle-orm";
import slugify from "slugify";
import { z } from "zod";
import { db } from "@/db";
import { projects, starterFolders } from "@/db/schema";
import { MAX_STARTER_FILE_SIZE } from "@/lib/constants/project-definitions";
import { projectSchema } from "@/lib/validations/project";
import { authActionClient, getRequiredEnv, getS3Client } from "./utils";

const starterFolderUploadSchema = z.object({
	fileName: z.string().min(1),
	fileSize: z
		.number()
		.int()
		.nonnegative()
		.max(
			MAX_STARTER_FILE_SIZE,
			`File size exceeds the maximum limit of ${MAX_STARTER_FILE_SIZE / (1024 * 1024)} MB`,
		),
});

const idSchema = z.object({
	id: z.string().min(1),
});

const slugSchema = z.object({
	slug: z.string().min(1),
});

const projectViewErrors = new Set([
	"Project not found",
	"Unauthorized",
	"Project is not currently available",
]);

export async function getLaunchableProject(
	input:
		| {
				projectId: string;
				userId: string;
		  }
		| {
				projectSlug: string;
				userId: string;
		  },
) {
	const { userId } = input;
	const [project] = await db
		.select()
		.from(projects)
		.where(
			"projectId" in input
				? eq(projects.id, input.projectId)
				: eq(projects.slug, input.projectSlug),
		);

	if (!project) {
		throw new Error("Project not found");
	}

	if (project.user_id === userId) {
		return project;
	}

	if (project.access === "private") {
		throw new Error("Unauthorized");
	}

	if (project.availability === "custom") {
		const now = new Date();
		if (
			(project.availability_opens && now < project.availability_opens) ||
			(project.availability_closes && now > project.availability_closes)
		) {
			throw new Error("Project is not currently available");
		}
	}

	return project;
}

export const getStarterFolderUploadSignedUrl = authActionClient
	.inputSchema(starterFolderUploadSchema)
	.action(async ({ ctx, parsedInput }) => {
		try {
			const { fileName, fileSize } = parsedInput;
			const s3Path = `${ctx.session.user.id}/${randomUUID()}/${fileName}`;
			const command = new PutObjectCommand({
				Bucket: getRequiredEnv("AWS_S3_STARTER_FOLDER_BUCKET_NAME"),
				Key: s3Path,
				ContentLength: fileSize,
			});
			const url = await getSignedUrl(getS3Client(), command, {
				expiresIn: 3600,
			});

			const [newObj] = await db
				.insert(starterFolders)
				.values({
					user_id: ctx.session.user.id,
					name: fileName,
					size: fileSize,
					path: s3Path,
				})
				.returning({ id: starterFolders.id });

			return { success: true, url, id: newObj.id };
		} catch (err) {
			console.log(err);
			throw new Error("Failed to generate signed URL");
		}
	});

export const deregisterStarterFolder = authActionClient
	.inputSchema(idSchema)
	.action(async ({ ctx, parsedInput }) => {
		try {
			await db
				.update(starterFolders)
				.set({ status: "deleted", deleted_at: new Date() })
				.where(
					and(
						eq(starterFolders.id, parsedInput.id),
						eq(starterFolders.user_id, ctx.session.user.id),
					),
				);

			return { success: true };
		} catch {
			throw new Error("Failed to delete starter folder");
		}
	});

function generateProjectSlug(projectName: string): string {
	const baseSlug = slugify(projectName, {
		lower: true,
		strict: true,
		trim: true,
	});

	const hash = randomBytes(3).toString("hex");
	return baseSlug ? `${baseSlug}-${hash}` : `project-${hash}`;
}

export const createProjectDefinition = authActionClient
	.inputSchema(projectSchema)
	.action(async ({ ctx, parsedInput }) => {
		try {
			const slug = generateProjectSlug(parsedInput.name);
			await db.insert(projects).values({
				user_id: ctx.session.user.id,
				slug,
				...parsedInput,
			});

			await db
				.update(starterFolders)
				.set({ status: "active" })
				.where(
					and(
						eq(starterFolders.id, parsedInput.starter_folder_id),
						eq(starterFolders.user_id, ctx.session.user.id),
					),
				);

			return { success: true };
		} catch (err) {
			console.log(err);
			throw new Error("Failed to create project definition");
		}
	});

export const getUserProjectDefinitions = authActionClient.action(
	async ({ ctx }) => {
		try {
			const userProjects = await db
				.select()
				.from(projects)
				.where(eq(projects.user_id, ctx.session.user.id));

			return { success: true, projects: userProjects };
		} catch (err) {
			console.log(err);
			throw new Error("Failed to fetch project definitions");
		}
	},
);

// TODO: Change this to not be protected by default, cause public access
export const getProjectView = authActionClient
	.inputSchema(slugSchema)
	.action(async ({ ctx, parsedInput }) => {
		try {
			const project = await getLaunchableProject({
				projectSlug: parsedInput.slug,
				userId: ctx.session.user.id,
			});

			return { success: true, project };
		} catch (err) {
			if (err instanceof Error && projectViewErrors.has(err.message)) {
				throw err;
			}

			console.log(err);
			throw new Error("Failed to fetch project view");
		}
	});
