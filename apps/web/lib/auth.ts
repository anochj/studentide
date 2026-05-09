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

        const defaultImage = `https://api.dicebear.com/9.x/bottts/svg??name=${encodeURIComponent(
          ctx.body.username,
        )}`;

        return {
          context: {
            ...ctx,
            body: {
              ...ctx.body,
              image: ctx.body.image || defaultImage,
            },
          },
        };
      }

      if (ctx.path === "/update-user") {
        if (!ctx.body?.username) return;

        const defaultImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          ctx.body.username,
        )}`;

        return {
          context: {
            ...ctx,
            body: {
              ...ctx.body,
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
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
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
