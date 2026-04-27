"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export function SignUp() {
  const { refetch } = authClient.useSession();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setMessage(null);

    const trimmedUsername = username.trim();
    const { error } = await authClient.signUp.email({
      name: trimmedUsername,
      email,
      password,
    });

    if (error) {
      setMessage(error.message || "Could not create account.");
      setIsPending(false);
      return;
    }

    await refetch();
    setPassword("");
    setMessage("Account created.");
    setIsPending(false);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-sm flex-col gap-3 rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
    >
      <div className="space-y-1">
        <h2 className="font-medium text-lg">Sign up</h2>
        <p className="text-muted-foreground text-sm">Create an account.</p>
      </div>
      <label className="grid gap-1.5 text-sm" htmlFor="sign-up-username">
        Username
        <Input
          autoComplete="username"
          id="sign-up-username"
          onChange={(event) => setUsername(event.target.value)}
          required
          value={username}
        />
      </label>
      <label className="grid gap-1.5 text-sm" htmlFor="sign-up-email">
        Email
        <Input
          autoComplete="email"
          id="sign-up-email"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
      </label>
      <label className="grid gap-1.5 text-sm" htmlFor="sign-up-password">
        Password
        <Input
          autoComplete="new-password"
          id="sign-up-password"
          minLength={8}
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
        {isPending ? "Creating..." : "Sign up"}
      </Button>
    </form>
  );
}
