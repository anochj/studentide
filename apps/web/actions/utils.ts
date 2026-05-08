import { S3Client } from "@aws-sdk/client-s3";
import { headers } from "next/headers";
import { createSafeActionClient } from "next-safe-action";
import { auth } from "@/lib/auth";
import { PLAN_LIMITS } from "@/lib/constants/stripe-configs";
import { env } from "@/lib/env";

export function getS3BucketName() {
  return env.AwsS3BucketName;
}

export function getS3Client() {
  const useCustomEndpoint = Boolean(env.AWS_S3_ENDPOINT);

  return new S3Client({
    region: env.AwsRegion,
    ...(useCustomEndpoint
      ? { endpoint: env.AWS_S3_ENDPOINT, forcePathStyle: true }
      : {}),
    credentials: {
      accessKeyId: env.AwsS3AccessKeyId,
      secretAccessKey: env.AwsS3SecretAccessKey,
    },
  });
}

export const actionClient = createSafeActionClient({
  defaultValidationErrorsShape: "flattened",
  handleServerError(error) {
    return error.message;
  },
});

export async function getServerSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  return next({
    ctx: {
      session,
    },
  });
});

export async function getUserSubscription() {
  const session = await getServerSession();
  if (!session) return null;

  const subscriptions = await auth.api.listActiveSubscriptions({
    query: {
      referenceId: session.user.id,
    },

    headers: await headers(),
  });

  const activeSubscription = subscriptions.find(
    (sub) => sub.status === "active" || sub.status === "trialing",
  );

  if (!activeSubscription) {
    return {
      subscription: null,
      plan: "free",
      limits: PLAN_LIMITS.free,
    };
  }

  return {
    subscription: activeSubscription,
    plan: activeSubscription.plan,
    limits: PLAN_LIMITS[activeSubscription.plan] ?? null,
  };
}
