"use client";

import { useMutation } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import { Download, ImageIcon } from "lucide-react";
import Image from "next/image";
import { getSignedUrlForSubmissionContent } from "@/actions/submissions";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type UserSubmission = {
  submission_id: string;
  submitted_at: Date;
  project: {
    name: string;
    slug: string;
  } | null;
  environment: {
    name: string;
    icon: string | null;
  } | null;
};

type UserSubmissionsTableProps = {
  submissions: UserSubmission[];
};

export default function UserSubmissionsTable({
  submissions,
}: UserSubmissionsTableProps) {
  const downloadMutation = useMutation({
    mutationFn: async (submission: UserSubmission) => {
      const res = await getSignedUrlForSubmissionContent({
        submissionId: submission.submission_id,
      });
      if (res.serverError) throw new Error(res.serverError);
      if (!res.data) throw new Error("No data returned");

      return {
        signedUrl: res.data.signedUrl,
        fileName: `${submission.project?.slug ?? "submission"}-${submission.submission_id}.zip`,
      };
    },
    onSuccess: ({ signedUrl, fileName }) => {
      const link = document.createElement("a");
      link.href = signedUrl;
      link.download = fileName;
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
  });

  return (
    <div className="overflow-hidden rounded-lg border bg-card text-card-foreground">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-medium text-muted-foreground">
              Project
            </TableHead>
            <TableHead className="font-medium text-muted-foreground">
              Submitted At
            </TableHead>
            <TableHead className="text-right font-medium text-muted-foreground">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.length > 0 ? (
            submissions.map((submission) => (
              <TableRow key={submission.submission_id}>
                <TableCell>
                  <div className="flex items-center gap-3 py-2">
                    <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-background">
                      {submission.environment?.icon ? (
                        <Image
                          src={submission.environment.icon}
                          alt={submission.environment.name}
                          width={28}
                          height={28}
                          className="object-contain"
                        />
                      ) : (
                        <ImageIcon className="size-5 text-muted-foreground" />
                      )}
                    </div>
                    <span className="text-sm font-medium">
                      {submission.project?.name ?? "Unknown project"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 py-2">
                    <span className="text-sm font-medium">
                      {format(submission.submitted_at, "MMM d, h:mm a")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(submission.submitted_at, {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end py-2">
                    <Button
                      variant="outline"
                      className="gap-2"
                      disabled={downloadMutation.isPending}
                      onClick={() => downloadMutation.mutate(submission)}
                    >
                      <Download className="size-4" />
                      {downloadMutation.isPending
                        ? "Downloading..."
                        : "Download Submitted Files"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={3}
                className="p-6 text-center text-muted-foreground"
              >
                <Empty className="min-h-40 border">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Download />
                    </EmptyMedia>
                    <EmptyTitle>No submissions found</EmptyTitle>
                    <EmptyDescription>
                      Submitted work will appear here when you complete a
                      project.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
