import { usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { stripeClient } from "@better-auth/stripe/client"

export const authClient = createAuthClient({
	baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
	plugins: [
		usernameClient(),
		stripeClient({
			subscription: true,
		}),
	],
});
