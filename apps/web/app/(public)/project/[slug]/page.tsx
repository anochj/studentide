import { FileWarning } from "lucide-react";
import type { Metadata } from "next";
import { getProjectView } from "@/actions";
import ProjectDefinitionView from "@/components/project-definition-view";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getProjectSeoData } from "@/lib/project-seo";
import { absoluteUrl, createPageMetadata, jsonLdScript } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const row = await getProjectSeoData(slug);

  if (!row?.project) {
    return createPageMetadata({
      title: "Project not found",
      description: "The requested studentide project could not be loaded.",
      path: `/project/${slug}`,
      noIndex: true,
    });
  }

  const { project, environment } = row;
  const now = new Date();
  const isAvailable =
    project.availability === "open" ||
    ((!project.availability_opens || now >= project.availability_opens) &&
      (!project.availability_closes || now <= project.availability_closes));
  const isPublic = project.access === "public" && isAvailable;
  const description =
    project.description ??
    `Open ${project.name} as a prepared ${environment?.name ?? "coding"} workspace in studentide.`;

  return createPageMetadata({
    title: project.name,
    description,
    path: `/project/${project.slug}`,
    image: `/project/${project.slug}/opengraph-image`,
    noIndex: !isPublic,
    type: "article",
  });
}

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

  const project = result.data.project;
  const isPublic = project.access === "public";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    url: absoluteUrl(`/project/${project.slug}`),
    description: project.description ?? project.overview ?? undefined,
    creator: project.owner?.name
      ? {
          "@type": "Person",
          name: project.owner.name,
        }
      : undefined,
    educationalUse: "Coding project",
    learningResourceType: "Project",
    programmingLanguage: project.environment?.name,
  };

  return (
    <>
      {isPublic && (
        <script type="application/ld+json">
          {jsonLdScript(jsonLd).__html}
        </script>
      )}
      <ProjectDefinitionView
        project={{
          ...project,
          starter_folder_included: !!project.starter_folder_id,
        }}
        creator={{
          name: project.owner?.name || "",
          icon: project.owner?.icon || "",
        }}
        environment={project.environment}
      />
    </>
  );
}
