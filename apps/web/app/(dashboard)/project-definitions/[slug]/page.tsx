import { getProjectView } from "@/actions";
import ProjectDefinitionView from "@/components/project-definition-view";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const result = await getProjectView({ slug });
  if (result.serverError || result.validationErrors || !result.data?.success) {
    return (
      <div>Error: {result.serverError ?? "Failed to validate request"}</div>
    );
  }

  return <ProjectDefinitionView project={result.data.project} />;
}
