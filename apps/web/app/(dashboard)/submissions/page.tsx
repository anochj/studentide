import { AlertCircle } from "lucide-react";
import { getUserSubmissions } from "@/actions/submissions";
import UserSubmissionsTable from "@/components/submissions/user-submissions-table";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default async function SubmissionsPage() {
  const { data, serverError } = await getUserSubmissions();

  if (serverError || !data) {
    return (
      <main className="flex h-full min-h-0 flex-1 p-6">
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <AlertCircle />
            </EmptyMedia>
            <EmptyTitle>Failed to load submissions</EmptyTitle>
            <EmptyDescription>
              {serverError ?? "Please try again later."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </main>
    );
  }
  const { submissions } = data;

  return (
    <main className="flex h-full flex-col flex-1 min-h-0 p-6">
      <div className="flex-none flex justify-between items-start pb-4 mb-4 border-b">
        <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 font-satoshi">
          Your Submissions
        </h1>
      </div>
      <UserSubmissionsTable
        submissions={submissions.map((submission) => ({
          submission_id: submission.id,
          submitted_at: submission.submitted_at,
          project: submission.project,
          environment: submission.environment,
        }))}
      />
    </main>
  );
}
