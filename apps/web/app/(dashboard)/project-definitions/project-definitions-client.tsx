"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, FolderPlus } from "lucide-react";
import Link from "next/link";
import { getUserProjectDefinitions } from "@/actions";
import { DashboardCardGridSkeleton } from "@/components/dashboard-skeletons";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

type ProjectDefinitionsResult = Awaited<
  ReturnType<typeof getUserProjectDefinitions>
>;

export default function ProjectsPage({
  initialResult,
}: {
  initialResult?: ProjectDefinitionsResult;
}) {
  const projectDefinitionsMutation = useQuery({
    queryKey: ["project-definitions"],
    queryFn: async () => {
      return await getUserProjectDefinitions();
    },
    initialData: initialResult,
  });

  const result = projectDefinitionsMutation.data;

  if (!result) {
    return (
      <main className="flex h-full flex-col flex-1 min-h-0 p-6">
        <div className="flex-none flex justify-between items-start pb-4 mb-4 border-b">
          <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 font-satoshi">
            Project Definitions
          </h1>
        </div>
        <DashboardCardGridSkeleton />
      </main>
    );
  }

  if (result.serverError || result.validationErrors || !result.data?.success) {
    return (
      <main className="flex h-full min-h-0 flex-1 p-6">
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <AlertCircle />
            </EmptyMedia>
            <EmptyTitle>Failed to load projects</EmptyTitle>
            <EmptyDescription>
              {result.serverError ?? "Failed to validate request"}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </main>
    );
  }

  const projects = result.data.projects;

  return (
    <main className="flex h-full flex-col flex-1 min-h-0 p-6">
      <div className="flex-none flex justify-between items-start pb-4 mb-4 border-b">
        <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 font-satoshi">
          Project Definitions
        </h1>

        {projects.length > 0 && (
          <Button asChild variant="default" size="lg">
            <Link href="/project-definitions/create">Create project</Link>
          </Button>
        )}
      </div>

      {projects.length > 0 ? (
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-wrap gap-4">
            {projects.map(({ environment, project }) => (
              <div key={project.id} className="w-xs">
                <ProjectCard
                  id={project.id}
                  href={`/project/${project.slug}`}
                  name={project.name}
                  description={
                    project.description
                      ? `${project.description} • ${environment.description}`
                      : environment.description
                  }
                  visibility={project.access}
                  environment_name={environment.name}
                  creation_date={project.created_at.toISOString()}
                  icon={environment.icon || "default"}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderPlus />
            </EmptyMedia>
            <EmptyTitle>You have no project definitions yet</EmptyTitle>
            <EmptyDescription>
              Create one to start a workspace and launch IDE sessions.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild variant="default" size="lg">
              <Link href="/project-definitions/create">Create project</Link>
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </main>
  );
}
