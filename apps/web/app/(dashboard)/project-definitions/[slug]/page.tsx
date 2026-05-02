import Markdown from "react-markdown";
import { getProjectView } from "@/actions";
import { Button } from "@/components/ui/button";

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

  const { project } = result.data;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <Button>Launch IDE Session</Button>
      </div>

      <div className="prose dark:prose-invert max-w-none bg-accent p-4 rounded-lg">
        <Markdown>{project.overview}</Markdown>
      </div>
    </div>
  );
}
