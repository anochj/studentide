import { AlertCircle, MonitorPlay } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getUserIDESessions } from "@/actions/ide-sessions";
import { DashboardCardGridSkeleton } from "@/components/dashboard-skeletons";
import IDESessionCard from "@/components/ide-session-card";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "IDE Sessions",
  description: "Resume and manage prepared studentide IDE sessions.",
  path: "/ide-sessions",
  noIndex: true,
});

async function IdeSessionsContent() {
  const response = await getUserIDESessions();

  if (response.serverError || !response.data) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertCircle />
          </EmptyMedia>
          <EmptyTitle>Failed to load IDE sessions</EmptyTitle>
          <EmptyDescription>
            {response.serverError ?? "No IDE sessions found."}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const { sessions } = response.data;

  return sessions.length > 0 ? (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-wrap gap-4">
        {sessions.map((session) => (
          <IDESessionCard
            key={session.id}
            id={session.id}
            icon={session.environment.icon || ""}
            name={session.project.name}
            project_slug={session.project.slug}
            ide_identifier={session.identifier}
            started_at={new Date(session.started_at)}
            status={session.status}
            sessionSecret={session.session_secret}
            submitted={!!session.submission}
            ended_at={session.ended_at ? new Date(session.ended_at) : null}
            due_date={
              session.project.availability_closes
                ? new Date(session.project.availability_closes)
                : undefined
            }
          />
        ))}
      </div>
    </div>
  ) : (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MonitorPlay />
        </EmptyMedia>
        <EmptyTitle>You have no IDE sessions yet</EmptyTitle>
        <EmptyDescription>
          Start a project from the marketplace or create your own project
          definition.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild variant="default" size="lg">
          <Link href="/project-marketplace">Browse Marketplace</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}

export default function IdeSessionsPage() {
  return (
    <main className="flex h-full flex-col flex-1 min-h-0 p-6">
      <div className="flex-none flex justify-between items-start pb-4 mb-4 border-b">
        <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 font-satoshi">
          IDE Sessions
        </h1>
      </div>

      <Suspense fallback={<DashboardCardGridSkeleton />}>
        <IdeSessionsContent />
      </Suspense>
    </main>
  );
}
