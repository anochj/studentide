import { FileWarning } from "lucide-react";
import { getProjectView } from "@/actions";
import ProjectDefinitionView from "@/components/project-definition-view";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const result = await getProjectView({ slug });
  if (result.serverError || result.validationErrors || !result.data?.success) {
    return (
      <main className="mx-auto flex min-h-[24rem] w-full max-w-6xl p-6 lg:p-8">
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileWarning />
            </EmptyMedia>
            <EmptyTitle>Project not found</EmptyTitle>
            <EmptyDescription>
              {result.serverError ?? "Failed to validate request"}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </main>
    );
  }

  return (
    <ProjectDefinitionView
      project={{
        ...result.data.project,
        starter_folder_included: !!result.data.project.starter_folder_id,
      }}
      creator={{
        name: result.data.project.owner?.name || "",
        icon: result.data.project.owner?.icon || "",
      }}
      environment={result.data.project.environment}
    />
  );
}
