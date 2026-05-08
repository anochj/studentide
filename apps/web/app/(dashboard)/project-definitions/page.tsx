import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import ProjectDefinitionsClient from "./project-definitions-client";

export const metadata: Metadata = createPageMetadata({
  title: "Project Definitions",
  description: "Manage your studentide coding project definitions.",
  path: "/project-definitions",
  noIndex: true,
});

export default function ProjectDefinitionsPage() {
  return <ProjectDefinitionsClient />;
}
