import { z } from "zod";

const clientEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  NEXT_PUBLIC_BETTER_AUTH_URL: z.url().optional(),
});

let parsedEnv: z.infer<typeof clientEnvSchema>;

if (process.env.SKIP_ENV_VALIDATION === "true") {
  parsedEnv = clientEnvSchema.safeParse(process.env) as unknown as z.infer<typeof clientEnvSchema>;
} else {
  parsedEnv = clientEnvSchema.parse(process.env);
}
console.log("SKIP_ENV_VALIDATION:", process.env.SKIP_ENV_VALIDATION);

const betterAuthUrl =
  parsedEnv.NEXT_PUBLIC_BETTER_AUTH_URL ??
  (parsedEnv.NODE_ENV === "development" ? "http://localhost:3000" : undefined);

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
