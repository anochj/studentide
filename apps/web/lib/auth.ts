import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins";
import { db } from "@/db";
import { stripe } from "@better-auth/stripe";
import Stripe from "stripe";
import { Plans } from "./constants/stripe-configs";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2026-04-22.dahlia",
});

export const auth = betterAuth({
	emailAndPassword: {
		enabled: true,
	},
  // TODO: add social providers
	plugins: [
		username(),
		stripe({
			stripeClient,
			stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
			createCustomerOnSignUp: true,
			subscription: {
				enabled: true,
				plans: Plans
			},
		}),
	],
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
});
