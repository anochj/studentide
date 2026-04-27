"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SignOut() {
  const { data: session, isPending, refetch } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (isPending || !session) {
    return null;
  }

  async function onSignOut() {
    setIsSigningOut(true);
    await authClient.signOut();
    await refetch();
    setIsSigningOut(false);
  }

  return (
    <div className="flex w-full max-w-sm items-center justify-between gap-3 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <p className="truncate text-sm">Signed in as {session.user.email}</p>
      <Button
        disabled={isSigningOut}
        onClick={onSignOut}
        type="button"
        variant="outline"
      >
        {isSigningOut ? "Signing out..." : "Sign out"}
      </Button>
    </div>
  );
}
