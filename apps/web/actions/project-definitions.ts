// FILE HANDLING LOGIC FOR PROJECT DEFINITIONS
"use server";

import { db } from "@/db";
import { getServerSession } from "./utils";
import { projectSchema, type Project } from "@/lib/validations/project";
import { projects, starterFolders } from "@/db/schema";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { and, eq } from "drizzle-orm";
import slugify from "slugify";
import { randomBytes } from "crypto";

const s3Client = new S3Client({
	region: process.env.AWS_REGION!,
	endpoint: process.env.AWS_S3_ENDPOINT! || "http://localhost:9000",
	forcePathStyle: process.env.NODE_ENV === "development",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	},
});

export async function getStarterFolderUploadSignedUrl(
	fileName: string,
	fileSize: number,
) {
	const session = await getServerSession();
	if (!session) {
		return { success: false, error: "Unauthorized" };
	}
	// TODO: Add size validation

	try {
		const s3Path = `${session.user.id}/${crypto.randomUUID()}/${fileName}`;
		const command = new PutObjectCommand({
			Bucket: process.env.AWS_S3_STARTER_FOLDER_BUCKET_NAME!,
			Key: s3Path,
			ContentLength: fileSize,
		});
		const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

		const [newObj] = await db
			.insert(starterFolders)
			.values({
				user_id: session.user.id,
				name: fileName,
				size: fileSize,
				path: s3Path,
			})
			.returning({ id: starterFolders.id });

		return { success: true, url, id: newObj.id };
	} catch (err) {
		console.log(err);
		return { success: false, error: "Failed to generate signed URL" };
	}
}

export async function deregisterStarterFolder(id: string) {
	const session = await getServerSession();
	if (!session) {
		return { success: false, error: "Unauthorized" };
	}

	try {
		await db
			.update(starterFolders)
			.set({ status: "deleted", deleted_at: new Date() })
			.where(
				and(
					eq(starterFolders.id, id),
					eq(starterFolders.user_id, session.user.id),
				),
			);

		return { success: true };
	} catch {
		return { success: false, error: "Failed to delete starter folder" };
	}
}

function generateProjectSlug(projectName: string): string {
	const baseSlug = slugify(projectName, {
		lower: true,
		strict: true,
		trim: true,
	});

	const hash = randomBytes(3).toString("hex");
	return baseSlug ? `${baseSlug}-${hash}` : `project-${hash}`;
}

export async function createProjectDefinition(data: Project) {
	const { success, data: validatedData, error } = projectSchema.safeParse(data);
	if (!success) {
		return { success: false, error: error };
	}

	const session = await getServerSession();
	if (!session) {
		return { success: false, error: "Unauthorized" };
	}

	console.log(data);
	try {
		const slug = generateProjectSlug(validatedData.name);
		await db.insert(projects).values({
			user_id: session.user.id,
			slug: slug,
			...validatedData,
		});

		// marks the object reference as used
		await db
			.update(starterFolders)
			.set({ status: "active" })
			.where(
				and(
					eq(starterFolders.id, validatedData.starter_folder_id),
					eq(starterFolders.user_id, session.user.id),
				),
			);

		return { success: true };
	} catch (err) {
		console.log(err);
		return { success: false, error: "Failed to create project definition" };
	}
}

export async function getUserProjectDefinitions() {
	const session = await getServerSession();
	if (!session) return { success: false, error: "Unauthorized" };

	try {
		const userProjects = await db
			.select()
			.from(projects)
			.where(eq(projects.user_id, session.user.id));

		return { success: true, projects: userProjects };
	} catch (err) {
        console.log(err);
		return { success: false, error: "Failed to fetch project definitions" };
	}
}

export async function getProjectView(slug: string) {
	const session = await getServerSession();
	if (!session) return { success: false, error: "Unauthorized" };

	try {
		const [project] = await db
			.select()
			.from(projects)
			.where(
				and(
					eq(projects.slug, slug),
				),
			);

		if (!project) {
			return { success: false, error: "Project not found" };
		}

        if (project.access === "private" && project.user_id !== session.user.id) {
            return { success: false, error: "Unauthorized" };
        }

        if (project.availability === "custom") {
            const now = new Date();
            if (
                (project.availability_opens && now < project.availability_opens) ||
                (project.availability_closes && now > project.availability_closes)
            ) {
                return { success: false, error: "Project is not currently available" };
            }
        }

		return { success: true, project };
	} catch (err) {
		console.log(err);
		return { success: false, error: "Failed to fetch project view" };
	}
}