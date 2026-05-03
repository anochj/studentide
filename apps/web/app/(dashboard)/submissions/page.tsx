import { getUserSubmissions } from "@/actions/submissions";
import UserSubmissionsTable from "@/components/submissions/user-submissions-table";

export default async function SubmissionsPage() {
  const { data, serverError } = await getUserSubmissions();

  if (serverError || !data) {
    return (
      <section>
        <h1 className="scroll-m-20 border-b pb-2 font-satoshi font-semibold text-3xl tracking-tight first:mt-0">
          Submissions
        </h1>
        <p className="text-muted-foreground">
          Failed to load submissions. Please try again later.
        </p>
      </section>
    );
  }
  const { submissions } = data;

  return (
    <section className="space-y-6">
      <h1 className="scroll-m-20 border-b pb-2 font-satoshi font-semibold text-3xl tracking-tight first:mt-0">
        Submissions
      </h1>
      <UserSubmissionsTable
        submissions={submissions.map((submission) => ({
          submission_id: submission.id,
          submitted_at: submission.submitted_at,
          project: submission.project,
          environment: submission.environment,
        }))}
      />
    </section>
  );
}
