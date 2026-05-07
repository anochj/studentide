import { stripeClient } from "@better-auth/stripe/client";
import { usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { env } from "@/lib/env.client";

export const authClient = createAuthClient({
  baseURL: env.BETTER_AUTH_URL,
  plugins: [
    usernameClient(),
    stripeClient({
      subscription: true,
    }),
  ],
});
