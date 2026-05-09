import { stripeClient } from "@better-auth/stripe/client";
import { usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  basePath: "/api/auth",
  plugins: [
    usernameClient(),
    stripeClient({
      subscription: true,
    }),
  ],
});
