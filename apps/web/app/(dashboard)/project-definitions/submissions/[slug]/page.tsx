import Link from "next/link";
import { getProjectSubmissions } from "@/actions/submissions";
import SubmissionsTable from "@/components/submissions/submissions-table";

export default async function ProjectsPage({
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
    return <h1>Project not found</h1>;
  }
  const { submissions, project } = submissionsRes.data;

  return (
    <section>
      <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 font-satoshi">
        Submissions for{" "}
        <Link
          href={`/project-definitions/${project.slug}`}
          className="underline"
        >
          {project.name}
        </Link>
      </h1>
      <SubmissionsTable
        submissions={submissions.map((sub) => ({
          submission_id: sub.id,
          user: {
            name: sub.user.name,
            profile: sub.user.image,
          },
          submitted_at: sub.submitted_at,
        }))}
      />
    </section>
  );
}
