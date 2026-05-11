"use server";

import { randomUUID } from "node:crypto";
import * as ecs from "@aws-sdk/client-ecs";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { and, desc, eq } from "drizzle-orm";
import z from "zod";
import { db } from "@/db";
import {
  environments,
  ideSessions,
  projects,
  submissions,
  user,
} from "@/db/schema";
import { env } from "@/lib/env";
import { authActionClient, getS3BucketName, getS3Client } from "./utils";

const submissionInputSchema = z.object({
  ideSessionId: z.string().uuid(),
});

const ecsClient = new ecs.ECSClient();
const S3_ARCHIVER_CONTAINER_NAME = "s3-archiver";
const STUDENT_WORKSPACE_VOLUME_NAME = "student-workspace-volume";

function jsonToEnvironmentOverride(json: Record<string, string>) {
  return Object.entries(json).map(([name, value]) => ({
    name,
    value,
  }));
}

async function createSubmissionUploadUrl(submissionPath: string) {
  const command = new PutObjectCommand({
    Bucket: getS3BucketName(),
    Key: submissionPath,
    ContentType: "application/zip",
  });

  return getSignedUrl(getS3Client(), command, {
    expiresIn: 3600,
  });
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

function getTaskDefinitionAccessPointId(taskDefinition: ecs.TaskDefinition) {
  const workspaceVolume = taskDefinition.volumes?.find(
    (volume) => volume.name === STUDENT_WORKSPACE_VOLUME_NAME,
  );
  const accessPointId =
    workspaceVolume?.efsVolumeConfiguration?.authorizationConfig?.accessPointId;

  if (!accessPointId) {
    throw new Error(
      "IDE session task definition is missing an EFS access point",
    );
  }

  return accessPointId;
}

async function registerS3ArchiverTaskDefinition(input: {
  baseTaskDefinition: ecs.TaskDefinition;
  accessPointId: string;
}) {
  if (!input.baseTaskDefinition.family) {
    throw new Error("S3 archiver task definition is missing a family");
  }

  const response = await ecsClient.send(
    new ecs.RegisterTaskDefinitionCommand({
      family: input.baseTaskDefinition.family,
      containerDefinitions: input.baseTaskDefinition.containerDefinitions,
      networkMode: input.baseTaskDefinition.networkMode,
      executionRoleArn: input.baseTaskDefinition.executionRoleArn,
      taskRoleArn: input.baseTaskDefinition.taskRoleArn,
      requiresCompatibilities: input.baseTaskDefinition.requiresCompatibilities,
      runtimePlatform: input.baseTaskDefinition.runtimePlatform,
      cpu: input.baseTaskDefinition.cpu,
      memory: input.baseTaskDefinition.memory,
      volumes: [
        {
          name: STUDENT_WORKSPACE_VOLUME_NAME,
          efsVolumeConfiguration: {
            fileSystemId: env.EfsFilesystemId,
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

  const taskDefinitionArn = response.taskDefinition?.taskDefinitionArn;
  if (!taskDefinitionArn) {
    throw new Error("Failed to register S3 archiver task definition");
  }

  return taskDefinitionArn;
}

async function deregisterTaskDefinition(taskDefinitionArn: string) {
  await ecsClient.send(
    new ecs.DeregisterTaskDefinitionCommand({
      taskDefinition: taskDefinitionArn,
    }),
  );
}

async function runS3ArchiverTask(input: {
  taskDefinitionArn: string;
  projectId: string;
  signedUrl: string;
}) {
  const cluster = env.EcsClusterName;
  const runRes = await ecsClient.send(
    new ecs.RunTaskCommand({
      cluster,
      taskDefinition: input.taskDefinitionArn,
      count: 1,
      launchType: "FARGATE",
      networkConfiguration: {
        awsvpcConfiguration: {
          subnets: env.EcsSubnets,
          securityGroups: [env.EcsSecurityGroup],
          assignPublicIp: "ENABLED",
        },
      },
      overrides: {
        containerOverrides: [
          {
            name: S3_ARCHIVER_CONTAINER_NAME,
            environment: jsonToEnvironmentOverride({
              PROJECT_ID: input.projectId,
              S3_SIGNED_URL: input.signedUrl,
            }),
          },
        ],
      },
    }),
  );

  if (runRes.failures?.length) {
    throw new Error("Failed to run S3 archiver task");
  }

  const taskArn = runRes.tasks?.[0]?.taskArn;
  if (!taskArn) {
    throw new Error("Failed to run S3 archiver task");
  }

  await ecs.waitUntilTasksStopped(
    {
      client: ecsClient,
      minDelay: 5,
      maxDelay: 15,
      maxWaitTime: 900,
    },
    {
      cluster,
      tasks: [taskArn],
    },
  );

  const describeRes = await ecsClient.send(
    new ecs.DescribeTasksCommand({
      cluster,
      tasks: [taskArn],
    }),
  );
  const task = describeRes.tasks?.[0];
  if (!task) {
    throw new Error("S3 archiver task was not found after completion");
  }

  const archiverContainer = task.containers?.find(
    (container) => container.name === S3_ARCHIVER_CONTAINER_NAME,
  );
  if (!archiverContainer) {
    throw new Error("S3 archiver container was not found after completion");
  }

  if (archiverContainer.exitCode !== 0) {
    throw new Error(
      `S3 archiver task failed with exit code ${archiverContainer.exitCode ?? "unknown"}`,
    );
  }
}

async function archiveProjectToSubmission(input: {
  ideSessionTaskDefinitionArn: string;
  projectId: string;
  signedUrl: string;
}) {
  const ideSessionTaskDefinition = await describeTaskDefinition(
    input.ideSessionTaskDefinitionArn,
  );
  const accessPointId = getTaskDefinitionAccessPointId(
    ideSessionTaskDefinition,
  );
  const baseArchiverTaskDefinition = await describeTaskDefinition(
    env.S3ArchiverTaskDefinitionArn,
  );
  const archiverTaskDefinitionArn = await registerS3ArchiverTaskDefinition({
    baseTaskDefinition: baseArchiverTaskDefinition,
    accessPointId,
  });

  try {
    await runS3ArchiverTask({
      taskDefinitionArn: archiverTaskDefinitionArn,
      projectId: input.projectId,
      signedUrl: input.signedUrl,
    });
  } finally {
    await deregisterTaskDefinition(archiverTaskDefinitionArn).catch((err) => {
      console.error("Failed to deregister S3 archiver task definition:", err);
    });
  }
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

    if (ideSession.status === "provisioning") {
      throw new Error("IDE session cannot be submitted while provisioning");
    }

    if (!ideSession.project_id) {
      throw new Error("IDE session is missing a project");
    }

    if (!ideSession.task_definition_arn) {
      throw new Error("IDE session is missing a task definition");
    }

    const submissionPath = `${ctx.session.user.id}/${ideSession.project_id}/${ideSession.id}/${randomUUID()}.zip`;
    const signedUrl = await createSubmissionUploadUrl(submissionPath);

    // TODO: Let this run in the background
    archiveProjectToSubmission({
      ideSessionTaskDefinitionArn: ideSession.task_definition_arn,
      projectId: ideSession.project_id,
      signedUrl,
    });

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
    z
      .object({
        id: z.string(),
      })
      .or(z.object({ slug: z.string().min(1) })),
  )
  .action(async ({ ctx, parsedInput }) => {
    const projectCondition =
      "id" in parsedInput
        ? eq(projects.id, parsedInput.id)
        : eq(projects.slug, parsedInput.slug);

    const [project] = await db
      .select()
      .from(projects)
      .where(projectCondition)
      .limit(1);

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.user_id !== ctx.session.user.id) {
      throw new Error("Unauthorized");
    }

    const results = await db
      .select({
        submission: submissions,
        user: {
          name: user.name,
          image: user.image,
        },
      })
      .from(submissions)
      .leftJoin(user, eq(user.id, submissions.user_id))
      .where(eq(submissions.project_id, project.id));

    return {
      success: true,
      submissions: results.map(({ submission, user }) => ({
        ...submission,
        user: user ?? {
          name: "Unknown user",
          image: null,
        },
      })),
      project,
    };
  });

export const getUserSubmissions = authActionClient.action(async ({ ctx }) => {
  const userSubmissions = await db
    .select({
      submission: submissions,
      project: {
        id: projects.id,
        name: projects.name,
        slug: projects.slug,
      },
      environment: {
        name: environments.name,
        icon: environments.icon,
      },
    })
    .from(submissions)
    .leftJoin(projects, eq(projects.id, submissions.project_id))
    .leftJoin(environments, eq(environments.id, projects.environment_id))
    .where(eq(submissions.user_id, ctx.session.user.id))
    .orderBy(desc(submissions.submitted_at));

  return {
    success: true,
    submissions: userSubmissions.map(
      ({ submission, project, environment }) => ({
        ...submission,
        project,
        environment,
      }),
    ),
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

    const bucket = getS3BucketName();
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
