import { FileWarning } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getProjectSubmissions } from "@/actions/submissions";
import {
  DashboardPageHeaderSkeleton,
  DashboardTableSkeleton,
} from "@/components/dashboard-skeletons";
import SubmissionsTable from "@/components/submissions/submissions-table";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  return createPageMetadata({
    title: "Project Submissions",
    description: "Review submissions for a studentide project definition.",
    path: `/project-definitions/submissions/${slug}`,
    noIndex: true,
  });
}

async function ProjectSubmissionsContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let submissionsRes = await getProjectSubmissions({ slug });

  if (submissionsRes.serverError) {
    submissionsRes = await getProjectSubmissions({ id: slug });
  }

  if (submissionsRes.serverError || !submissionsRes.data) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileWarning />
          </EmptyMedia>
          <EmptyTitle>Project not found</EmptyTitle>
          <EmptyDescription>
            The requested project could not be loaded.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const { submissions, project } = submissionsRes.data;

  return (
    <>
      <div className="flex-none flex justify-between items-start pb-4 mb-4 border-b">
        <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 font-satoshi">
          Submissions for{" "}
          <Link href={`/project/${project.slug}`} className="underline">
            {project.name}
          </Link>
        </h1>
      </div>
      <SubmissionsTable
        submissions={submissions.map((sub) => ({
          submission_id: sub.id,
          user: {
            name: sub.user.name ?? "Unknown student",
            profile: sub.user.image,
          },
          submitted_at: sub.submitted_at,
        }))}
      />
    </>
  );
}

export default function ProjectsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <main className="flex h-full flex-col flex-1 min-h-0 p-6">
      <Suspense
        fallback={
          <>
            <DashboardPageHeaderSkeleton />
            <DashboardTableSkeleton columns={3} />
          </>
        }
      >
        <ProjectSubmissionsContent params={params} />
      </Suspense>
    </main>
  );
}
