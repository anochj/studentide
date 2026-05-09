import { stripe } from "@better-auth/stripe";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { username } from "better-auth/plugins";
import Stripe from "stripe";
import { db } from "@/db";
import { Plans } from "./constants/stripe-configs";
import { env } from "./env";
import { usernameSchema } from "./validations/signup";
import { user } from "@/db/schema";
import crypto from "node:crypto";
import { eq } from "drizzle-orm";

const stripeClient = new Stripe(env.STRIPE_SECRET_KEY, {
	apiVersion: "2026-04-22.dahlia",
});

export const auth = betterAuth({
	baseURL: env.BETTER_AUTH_URL,
	secret: env.BETTER_AUTH_SECRET,
	trustedOrigins: ["https://studentide.com"],
	user: {
		additionalFields: {
			username: { type: "string", required: true },
			name: { type: "string", required: false },
		},
	},
	hooks: {
		before: createAuthMiddleware(async (ctx) => {
			if (ctx.path === "/sign-up/email") {
				if (!ctx.body?.username) {
					throw new APIError("BAD_REQUEST", {
						message: "Username is required",
					});
				}

				const existingUser = await db
					.select()
					.from(user)
					.where(eq(user.username, ctx.body.username));

				let usernameToUse = ctx.body.username;
				if (existingUser.length > 0) {
					usernameToUse = `${ctx.body.username}${crypto.randomBytes(2).toString("hex")}`;
				}

				const defaultImage = `https://api.dicebear.com/9.x/bottts/svg??name=${encodeURIComponent(
					ctx.body.username,
				)}`;

				return {
					context: {
						...ctx,
						body: {
							...ctx.body,
							username: usernameToUse,
							image: ctx.body.image || defaultImage,
						},
					},
				};
			}
		}),
	},
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
			mapProfileToUser: (profile) => ({
				name: profile.name || profile.login,
				username: profile.name,
				image: profile.avatar_url,
			}),
		},
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			mapProfileToUser: (profile) => ({
				name: `${profile.given_name} ${profile.family_name}`,
				username: `${profile.given_name}${profile.family_name}`,
				image: profile.picture,
			}),
		},
	},
	plugins: [
		username({
			minUsernameLength: 1,
			usernameValidator: (username) =>
				usernameSchema.safeParse(username).success,
		}),
		stripe({
			stripeClient,
			stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
			createCustomerOnSignUp: true,
			subscription: {
				enabled: true,
				plans: Plans,
			},
		}),
	],
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
});
