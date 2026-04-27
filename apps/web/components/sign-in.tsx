"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export function SignIn() {
  const { refetch } = authClient.useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setMessage(null);

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      setMessage(error.message || "Could not sign in.");
      setIsPending(false);
      return;
    }

    await refetch();
    setPassword("");
    setMessage("Signed in.");
    setIsPending(false);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-sm flex-col gap-3 rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
    >
      <div className="space-y-1">
        <h2 className="font-medium text-lg">Sign in</h2>
        <p className="text-muted-foreground text-sm">
          Use your email and password.
        </p>
      </div>
      <label className="grid gap-1.5 text-sm" htmlFor="sign-in-email">
        Email
        <Input
          autoComplete="email"
          id="sign-in-email"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
      </label>
      <label className="grid gap-1.5 text-sm" htmlFor="sign-in-password">
        Password
        <Input
          autoComplete="current-password"
          id="sign-in-password"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </label>
      {message ? (
        <p className="text-muted-foreground text-sm">{message}</p>
      ) : null}
      <Button disabled={isPending} type="submit">
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
