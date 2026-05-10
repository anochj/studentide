import { z } from "zod";

const clientEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  NEXT_PUBLIC_BETTER_AUTH_URL: z.url().optional(),
});

const parsedEnv = clientEnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});

console.log("Client Url", process.env.BETTER_AUTH_URL, process.env.NEXT_PUBLIC_BETTER_AUTH_URL);

const betterAuthUrl =
  parsedEnv.NEXT_PUBLIC_BETTER_AUTH_URL ??
  (parsedEnv.NODE_ENV === "development" ? "http://localhost:6767" : undefined);

if (!betterAuthUrl) {
  throw new Error(
    "Missing required environment variable: NEXT_PUBLIC_BETTER_AUTH_URL",
  );
}

export const env = {
  BETTER_AUTH_URL: betterAuthUrl,
  NODE_ENV: parsedEnv.NODE_ENV,
  IS_DEVELOPMENT: parsedEnv.NODE_ENV === "development",
  IS_PRODUCTION: parsedEnv.NODE_ENV === "production",
};
