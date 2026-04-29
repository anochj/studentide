import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProjectsPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-5 p-6 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">You have no projects yet</h1>
        <p className="max-w-sm text-muted-foreground text-sm">
          Try making one to start a workspace and launch IDE sessions.
        </p>
      </div>
      <Button asChild>
        <Link href="/projects/create">Create project</Link>
      </Button>
    </main>
  );
}
