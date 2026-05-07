import { loadEnvConfig } from "@next/env";
import { z } from "zod";

loadEnvConfig(process.cwd());

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().min(1),
  BETTER_AUTH_URL: z.url().default("http://localhost:3000"),
  BETTER_AUTH_SECRET: z.string().min(1),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  AWS_REGION: z.string().min(1),
  AWS_S3_ENDPOINT: z.url().optional(),
  AWS_S3_ACCESS_KEY_ID: z.string().min(1),
  AWS_S3_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_S3_BUCKET_NAME: z.string().min(1),
  AWS_IDE_STATUS_WEBHOOK_SECRET: z.string().min(1),
  EFS_FILESYSTEM_ID: z.string().min(1),
  EFS_MOUNT_PATH: z.string().min(1).default("/mnt/efs"),
  ECS_CLUSTER_NAME: z.string().min(1),
  ECS_SUBNETS: z
    .string()
    .min(1)
    .transform((value, ctx) => {
      const subnets = value
        .split(",")
        .map((subnet) => subnet.trim())
        .filter(Boolean);

      if (subnets.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "ECS_SUBNETS must contain at least one subnet ID",
        });
        return z.NEVER;
      }

      return subnets;
    }),
  ECS_SECURITY_GROUP: z.string().min(1),
  S3_ARCHIVER_TASK_DEFINITION_ARN: z.string().min(1),
});

const parsedEnv = envSchema.parse(process.env);

export const env = {
  ...parsedEnv,
  NODE_ENV: parsedEnv.NODE_ENV,
  IS_DEVELOPMENT: parsedEnv.NODE_ENV === "development",
  IS_PRODUCTION: parsedEnv.NODE_ENV === "production",
};
