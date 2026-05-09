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
  AwsRegion: z.string().min(1),
  AWS_S3_ENDPOINT: z.url().optional(),
  AwsS3AccessKeyId: z.string().min(1),
  AwsS3SecretAccessKey: z.string().min(1),
  AwsS3BucketName: z.string().min(1),
  AwsIdeStatusWebhookSecret: z.string().min(1),
  EfsFilesystemId: z.string().min(1),
  EFS_MOUNT_PATH: z.string().min(1).default("/mnt/efs"),
  EcsClusterName: z.string().min(1),
  EcsSubnets: z
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
          message: "EcsSubnets must contain at least one subnet ID",
        });
        return z.NEVER;
      }

      return subnets;
    }),
  EcsSecurityGroup: z.string().min(1),
  S3ArchiverTaskDefinitionArn: z.string().min(1),
});

let parsedEnv: z.infer<typeof envSchema>;
console.log("SKIP_ENV_VALIDATION:", process.env.SKIP_ENV_VALIDATION);

if (process.env.SKIP_ENV_VALIDATION === "true") {
  parsedEnv = process.env as unknown as z.infer<typeof envSchema>;
} else {
  parsedEnv = envSchema.parse(process.env);
}

console.log("Server Url", process.env.BETTER_AUTH_URL, process.env.NEXT_PUBLIC_BETTER_AUTH_URL);

export const env = {
  ...parsedEnv,
  NODE_ENV: parsedEnv.NODE_ENV,
  IS_DEVELOPMENT: parsedEnv.NODE_ENV === "development",
  IS_PRODUCTION: parsedEnv.NODE_ENV === "production",
};
