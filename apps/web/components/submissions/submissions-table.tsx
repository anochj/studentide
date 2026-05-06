"use client";

import { useMutation } from "@tanstack/react-query";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { format, formatDistanceToNow } from "date-fns";
import { Download, Search, Terminal } from "lucide-react";
import { useMemo, useState } from "react";
import { launchSubmissionIDESession } from "@/actions/ide-sessions";
import { getSignedUrlForSubmissionContent } from "@/actions/submissions";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserProfileAvatar } from "@/components/user-profile-avatar";

type Submission = {
  submission_id: string;
  user: {
    name: string;
    profile?: string | null;
  };
  submitted_at: Date;
};

type SubmissionsTableProps = {
  submissions: Submission[];
  onOpenInIDE?: (submissionId: string) => void;
  onDownload?: (submissionId: string) => void;
};

export default function SubmissionsTable({
  submissions,
  onDownload,
  onOpenInIDE,
}: SubmissionsTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "submitted_at", desc: true },
  ]);

  const downloadMutation = useMutation({
    mutationFn: async (submissionId: string) => {
      const res = await getSignedUrlForSubmissionContent({ submissionId });
      if (res.serverError) throw new Error(res.serverError);
      if (!res.data) throw new Error("No data returned");

      return res.data.signedUrl;
    },
    onSuccess: (signedUrl) => {
      window.open(signedUrl, "_blank");
    },
  });

  const openInIDEMutation = useMutation({
    mutationFn: async (submissionId: string) => {
      const res = await launchSubmissionIDESession({ submissionId });
      if (res.serverError) throw new Error(res.serverError);
      if (!res.data) throw new Error("No data returned");

      return res.data.session.url;
    },
    onSuccess: (url) => {
      window.open(url, "_blank");
    },
  });

  const columns = useMemo<ColumnDef<Submission>[]>(
    () => [
      {
        id: "student",
        accessorFn: (row) => row.user.name,
        header: "Student",
        cell: ({ row }) => {
          const user = row.original.user;

          return (
            <div className="flex items-center gap-4 py-2">
              <UserProfileAvatar
                className="h-10 w-10"
                image={user.profile}
                name={user.name}
              />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "submitted_at",
        header: "Submitted At",
        cell: ({ row }) => {
          const date = row.original.submitted_at;
          return (
            <div className="flex flex-col gap-1 py-2">
              <span className="text-sm font-medium">
                {format(date, "MMM d, h:mm a")}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(date, { addSuffix: true })}
              </span>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          const submissionId = row.original.submission_id;
          return (
            <div className="flex items-center justify-end gap-3 py-2">
              <Button
                className="gap-2"
                disabled={openInIDEMutation.isPending}
                onClick={() => {
                  if (onOpenInIDE) {
                    onOpenInIDE(submissionId);
                    return;
                  }

                  openInIDEMutation.mutate(submissionId);
                }}
              >
                <Terminal className="h-4 w-4" />
                {openInIDEMutation.isPending ? "Opening..." : "Open in IDE"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="text-muted-foreground"
                disabled={downloadMutation.isPending}
                onClick={() => {
                  if (onDownload) {
                    onDownload(submissionId);
                    return;
                  }

                  downloadMutation.mutate(submissionId);
                }}
              >
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
            </div>
          );
        },
      },
    ],
    [downloadMutation, onDownload, onOpenInIDE, openInIDEMutation],
  );

  const table = useReactTable({
    data: submissions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    state: {
      globalFilter,
      sorting,
    },
  });

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            className="pl-8"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
        <Select
          value={sorting[0]?.desc ? "desc" : "asc"}
          onValueChange={(val) =>
            setSorting([{ id: "submitted_at", desc: val === "desc" }])
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest first</SelectItem>
            <SelectItem value="asc">Oldest first</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-card text-card-foreground">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="font-medium text-muted-foreground"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="p-6 text-center text-muted-foreground"
                >
                  <Empty className="min-h-40 border">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Terminal />
                      </EmptyMedia>
                      <EmptyTitle>No submissions found</EmptyTitle>
                      <EmptyDescription>
                        Submitted work will appear here as students finish this
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
    </div>
  );
}
