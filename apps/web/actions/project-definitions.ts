// FILE HANDLING LOGIC FOR PROJECT DEFINITIONS
"use server";

import { randomBytes, randomUUID } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { and, eq, desc, count, sql } from "drizzle-orm";
import slugify from "slugify";
import { z } from "zod";
import { db } from "@/db";
import { environments, projects, starterFolders, user } from "@/db/schema";
import { MAX_STARTER_FILE_SIZE } from "@/lib/constants/project-definitions";
import { projectSchema } from "@/lib/validations/project";
import {
	actionClient,
	authActionClient,
	getRequiredEnv,
	getS3Client,
	getServerSession,
} from "./utils";

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
				userId?: string;
		  }
		| {
				projectSlug: string;
				userId?: string;
		  },
) {
	const { userId } = input;

	const condition =
		"projectId" in input
			? eq(projects.id, input.projectId)
			: eq(projects.slug, input.projectSlug);

	const [res] = await db
		.select({
			project: projects,
			environment: environments,
			owner: {
				name: user.name,
				icon: user.image,
			},
		})
		.from(projects)
		.where(condition)
		.leftJoin(environments, eq(projects.environment_id, environments.id))
		.leftJoin(user, eq(projects.user_id, user.id));

	if (!res || !res.project) {
		throw new Error("Project not found");
	}

	if (!res.environment) {
		throw new Error("Project configuration error: Environment not found");
	}

	const { project, environment, owner } = res;

	if (project.user_id === userId) {
		return { ...project, environment, owner };
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

	return { ...project, environment, owner };
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
				starter_folder_id: parsedInput.starter_folder_id || null,
			});

			if (parsedInput.starter_folder_id) {
				await db
					.update(starterFolders)
					.set({ status: "active" })
					.where(
						and(
							eq(starterFolders.id, parsedInput.starter_folder_id),
							eq(starterFolders.user_id, ctx.session.user.id),
						),
					);
			}
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
				.leftJoin(environments, eq(projects.environment_id, environments.id))
				.where(eq(projects.user_id, ctx.session.user.id));

			const simplified = userProjects
				.filter((row) => row.projects !== null)
				.map(({ projects, environments }) => ({
					project: projects!,
					environment: environments!,
				}));

			return { success: true, projects: simplified };
		} catch (err) {
			console.error(err);
			throw new Error("Failed to fetch project definitions");
		}
	},
);

export const getProjectView = actionClient
	.inputSchema(slugSchema)
	.action(async ({ ctx, parsedInput }) => {
		const session = await getServerSession();

		try {
			const project = await getLaunchableProject({
				projectSlug: parsedInput.slug,
				userId: session?.user.id,
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

export const deleteProjectDefinition = authActionClient
	.inputSchema(idSchema)
	.action(async ({ ctx, parsedInput }) => {
		try {
			await db
				.delete(projects)
				.where(
					and(
						eq(projects.id, parsedInput.id),
						eq(projects.user_id, ctx.session.user.id),
					),
				);

			return { success: true };
		} catch (err) {
			console.log(err);
			throw new Error("Failed to delete project definition");
		}
	});

// TODO: Implement
/*
export const updateProjectDefinition = authActionClient
	.inputSchema(projectSchema.partial().extend({ id: z.string().min(1) }))
	.action(async ({ ctx, parsedInput }) => {
		try {
			const { id, ...updateData } = parsedInput;
			await db
				.update(projects)
				.set(updateData)
				.where(
					and(eq(projects.id, id), eq(projects.user_id, ctx.session.user.id)),
				);

			return { success: true };
		} catch (err) {
			console.log(err);
			throw new Error("Failed to update project definition");
		}
	});
*/

export const queryProjectMarketplace = actionClient
	.inputSchema(
		z.object({
			query: z.string().min(1),
			maxResults: z.number().int().positive().max(50).default(20),
		}),
	)
	.action(async ({ parsedInput }) => {
		const query = sql`websearch_to_tsquery('english', ${parsedInput.query})`;

		const queriedProjects = await db
			.select({
				project: projects,
				environment: environments,
			})
			.from(projects)
			.where(and(eq(projects.access, "public"), sql`search_vector @@ ${query}`))
			.orderBy(sql`ts_rank(search_vector, ${query}) DESC`)
			.limit(parsedInput.maxResults)
			.leftJoin(environments, eq(projects.environment_id, environments.id));

		return { success: true, results: queriedProjects };
	});

export const getProjectMarketplaceProjects = actionClient
	.inputSchema(
		z.object({
			page: z.number().int().positive().default(1),
			pageSize: z.number().int().positive().max(50).default(20),
		}),
	)
	.action(async ({ parsedInput }) => {
		const { page, pageSize } = parsedInput;

		const offsetAmount = (page - 1) * pageSize;

		const paginatedProjects = await db
			.select({
				project: projects,
				environment: environments,
			})
			.from(projects)
			.where(eq(projects.access, "public"))
			.orderBy(desc(projects.created_at))
			.limit(pageSize)
			.offset(offsetAmount)
			.leftJoin(environments, eq(projects.environment_id, environments.id));

		const [totalCountResult] = await db
			.select({ value: count() })
			.from(projects)
			.where(eq(projects.access, "public"));

		const totalProjects = totalCountResult.value;
		const totalPages = Math.ceil(totalProjects / pageSize);

		return {
			success: true,
			results: paginatedProjects,
			pagination: {
				currentPage: page,
				pageSize: pageSize,
				totalProjects: totalProjects,
				totalPages: totalPages,
				hasNextPage: page < totalPages,
				hasPreviousPage: page > 1,
			},
		};
	});
