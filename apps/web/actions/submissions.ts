import { randomUUID } from "node:crypto";
import { lstat, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { and, eq } from "drizzle-orm";
import JSZip from "jszip";
import z from "zod";
import { db } from "@/db";
import { ideSessions, projects, submissions } from "@/db/schema";
import { getEfsProjectPath } from "./ide-session-utils";
import { authActionClient, getRequiredEnv, getS3Client } from "./utils";

const submissionInputSchema = z.object({
	ideSessionId: z.string().uuid(),
});

async function assertProjectDirectory(projectPath: string) {
	const projectStats = await lstat(projectPath).catch(() => null);
	if (!projectStats?.isDirectory()) {
		throw new Error("Project directory not found on EFS");
	}
}

// TODO: Maybe abstract this logic to be shared with the starter folder dropzone
async function addDirectoryToZip(zip: JSZip, sourceDir: string, zipDir = "") {
	const entries = await readdir(sourceDir, { withFileTypes: true });

	await Promise.all(
		entries.map(async (entry) => {
			const sourcePath = path.join(sourceDir, entry.name);
			const relativePath = path.posix.join(zipDir, entry.name);

			if (entry.isDirectory()) {
				zip.folder(relativePath);
				await addDirectoryToZip(zip, sourcePath, relativePath);
				return;
			}

			if (!entry.isFile()) {
				return;
			}

			zip.file(relativePath, await readFile(sourcePath));
		}),
	);
}

async function zipProjectDirectory(projectPath: string) {
	await assertProjectDirectory(projectPath);

	const zip = new JSZip();
	await addDirectoryToZip(zip, projectPath);

	return zip.generateAsync({
		type: "nodebuffer",
		compression: "DEFLATE",
		compressionOptions: {
			level: 9,
		},
	});
}

export const submitIdeSession = authActionClient
	.inputSchema(submissionInputSchema)
	.action(async ({ ctx, parsedInput }) => {
		const { ideSessionId } = parsedInput;

		const [ideSession] = await db
			.select()
			.from(ideSessions)
			.where(
				and(
					eq(ideSessions.id, ideSessionId),
					eq(ideSessions.user_id, ctx.session.user.id),
				),
			)
			.limit(1);

		if (!ideSession) {
			throw new Error("IDE session not found");
		}

		if (!ideSession.project_id) {
			throw new Error("IDE session is missing a project");
		}

		const user = {
			id: ctx.session.user.id,
			name: ctx.session.user.name,
			username: ctx.session.user.username,
		};
		const projectPath = getEfsProjectPath({
			user,
			projectId: ideSession.project_id,
		});
		const submissionPath = `${ctx.session.user.id}/${ideSession.project_id}/${ideSession.id}/${randomUUID()}.zip`;
		const bucket = getRequiredEnv("AWS_S3_SUBMISSIONS_BUCKET_NAME");
		const archive = await zipProjectDirectory(projectPath);

		await getS3Client().send(
			new PutObjectCommand({
				Bucket: bucket,
				Key: submissionPath,
				Body: archive,
				ContentType: "application/zip",
			}),
		);

		const [submission] = await db
			.insert(submissions)
			.values({
				project_id: ideSession.project_id,
				user_id: ctx.session.user.id,
				ide_session_id: ideSession.id,
				content_path: submissionPath,
			})
			.returning({
				id: submissions.id,
				contentPath: submissions.content_path,
			});

		return {
			success: true,
			submission,
		};
	});

export const getProjectSubmissions = authActionClient
	.inputSchema(
		z.object({
			projectId: z.string(),
		}),
	)
	.action(async ({ ctx, parsedInput }) => {
		const { projectId } = parsedInput;

		const [project] = await db
			.select()
			.from(projects)
			.where(eq(projects.id, projectId))
			.limit(1);

		if (!project) {
			throw new Error("Project not found");
		} else if (project.user_id !== ctx.session.user.id) {
			throw new Error("Unauthorized");
		}

		const projectSubmissions = await db
			.select()
			.from(submissions)
			.where(and(eq(submissions.project_id, projectId)));

		return {
			success: true,
			submissions: projectSubmissions,
		};
	});

export const getUserSubmissions = authActionClient.action(async ({ ctx }) => {
	const userSubmissions = await db
		.select()
		.from(submissions)
		.where(eq(submissions.user_id, ctx.session.user.id));

	return {
		success: true,
		submissions: userSubmissions,
	};
});

export const getSignedUrlForSubmissionContent = authActionClient
	.inputSchema(
		z.object({
			submissionId: z.string().min(1),
		}),
	)
	.action(async ({ ctx, parsedInput }) => {
		const { submissionId } = parsedInput;
		const [submission] = await db
			.select()
			.from(submissions)
			.where(and(eq(submissions.id, submissionId)))
			.leftJoin(projects, eq(projects.id, submissions.project_id))
			.limit(1);

		if (!submission) {
			throw new Error("Submission not found");
		} else if (
			submission.projects?.user_id !== ctx.session.user.id &&
			submission.submissions.user_id !== ctx.session.user.id
		) {
			throw new Error("Unauthorized");
		}

		const bucket = getRequiredEnv("AWS_S3_SUBMISSIONS_BUCKET_NAME");
		const command = new GetObjectCommand({
			Bucket: bucket,
			Key: submission.submissions.content_path,
		});

		const signedUrl = await getSignedUrl(getS3Client(), command, {
			expiresIn: 3600,
		});

		return {
			success: true,
			signedUrl,
		};
	});
