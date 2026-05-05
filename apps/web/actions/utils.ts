import { headers } from "next/headers";
import { createSafeActionClient } from "next-safe-action";
import { auth } from "@/lib/auth";
import { PLAN_LIMITS } from "@/lib/constants/stripe-configs";
import { S3Client } from "@aws-sdk/client-s3";

export function getRequiredEnv(name: string) {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}

	return value;
}

export function getS3BucketName() {
	const value =
		process.env.AWS_S3_BUCKET_NAME ??
		process.env.AWS_S3_STARTER_FOLDER_BUCKET_NAME ??
		process.env.AWS_S3_SUBMISSIONS_BUCKET_NAME;

	if (!value) {
		throw new Error("Missing required environment variable: AWS_S3_BUCKET_NAME");
	}

	return value;
}

export function getS3Client() {
	return new S3Client({
		region: getRequiredEnv("AWS_REGION"),
		endpoint: process.env.AWS_S3_ENDPOINT ?? "http://localhost:9000",
		forcePathStyle: process.env.NODE_ENV === "development",
		credentials: {
			accessKeyId: getRequiredEnv("AWS_S3_ACCESS_KEY_ID"),
			secretAccessKey: getRequiredEnv("AWS_S3_SECRET_ACCESS_KEY"),
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
