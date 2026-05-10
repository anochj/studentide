import type { Metadata } from "next";
import { Suspense } from "react";
import { getUserProjectDefinitions } from "@/actions";
import { DashboardPageSkeleton } from "@/components/dashboard-skeletons";
import { createPageMetadata } from "@/lib/seo";
import ProjectDefinitionsClient from "./project-definitions-client";

export const metadata: Metadata = createPageMetadata({
  title: "Project Definitions",
  description: "Manage your studentide coding project definitions.",
  path: "/project-definitions",
  noIndex: true,
});

async function ProjectDefinitionsContent() {
  const initialResult = await getUserProjectDefinitions();

  return <ProjectDefinitionsClient initialResult={initialResult} />;
}

export default function ProjectDefinitionsPage() {
  return (
    <Suspense fallback={<DashboardPageSkeleton action />}>
      <ProjectDefinitionsContent />
    </Suspense>
  );
}
