"use client";

import {
  Braces,
  Calendar,
  Check,
  Clock,
  Code2,
  Inbox,
  Loader2,
  MoreHorizontal,
  Play,
  RotateCw,
  Square,
  TriangleAlert,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { launchIDESession, stopIDESession } from "@/actions/ide-sessions";
import { submitIdeSession } from "@/actions/submissions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type ProjectCardProps = {
  id: string;
  name: string;
  icon: string;
  started_at: Date;
  ended_at: Date | null;
  status: "provisioning" | "active" | "terminated" | "error";
  ide_identifier: string;
  project_slug: string;
  submitted: boolean;
  due_date?: Date;
};

type ActionErrorResult = {
  serverError?: string;
  validationErrors?: {
    formErrors?: string[];
    fieldErrors?: Record<string, string[] | undefined>;
  };
};

function getActionError(result: ActionErrorResult) {
  if (result.serverError) return result.serverError;

  if (result.validationErrors) {
    const fieldErrors = Object.values(
      result.validationErrors.fieldErrors ?? {},
    ).flat();
    const messages = [
      ...(result.validationErrors.formErrors ?? []),
      ...fieldErrors,
    ].filter((message): message is string => Boolean(message));

    if (messages.length > 0) return messages.join(", ");
  }

  return "Action failed";
}

// Extracted to clean up the JSX
const statusConfig = {
  provisioning: {
    label: "Provisioning",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  },
  active: {
    label: "Active",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
  terminated: {
    label: "Terminated",
    className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  },
  error: {
    label: "Error",
    className: "bg-red-100 text-red-800 hover:bg-red-100",
  },
};

export default function IDESessionCard({
  id,
  name,
  icon,
  started_at,
  ended_at,
  status,
  ide_identifier,
  project_slug,
  submitted,
  due_date,
}: ProjectCardProps) {
  const router = useRouter();
  const stopAction = useAction(stopIDESession);
  const restartAction = useAction(launchIDESession);
  const submitAction = useAction(submitIdeSession);
  const [error, setError] = useState<string | null>(null);
  const currentStatus = statusConfig[status] || statusConfig.error;
  const isSubmitted = submitted || submitAction.hasSucceeded;
  const isBusy =
    stopAction.isExecuting ||
    restartAction.isExecuting ||
    submitAction.isExecuting;

  async function handleAction(
    action: () => Promise<ActionErrorResult | undefined>,
  ) {
    setError(null);
    const result = await action().catch((err) => {
      setError(err instanceof Error ? err.message : "Action failed");
      return undefined;
    });

    if (!result) {
      return;
    }

    if (result.serverError || result.validationErrors) {
      setError(getActionError(result));
      return;
    }

    router.refresh();
  }

  return (
    <Card className="group flex h-full max-w-xs flex-col justify-between transition-all border">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          {icon ? (
            <Image
              src={icon}
              alt={`${name} icon`}
              width={35}
              height={35}
              className="object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
              <Code2 className="h-5 w-5" />
            </div>
          )}

          <div className="flex flex-col items-start gap-1">
            <h3 className="font-semibold leading-none tracking-tight">
              {name}
            </h3>
            <Badge
              variant="default"
              className={`px-1.5 py-0 text-[10px] font-normal ${currentStatus.className}`}
            >
              {currentStatus.label}
            </Badge>
          </div>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="-mr-2 -mt-2 h-8 w-8 cursor-pointer"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="center" className="w-56 p-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href={`/project/${project_slug}`}>
                <Braces className="mr-2 h-4 w-4" />
                Project Definition
              </Link>
            </Button>

            {status === "active" && (
              <Button
                variant="destructive"
                className="mt-1 w-full justify-start"
                disabled={isBusy}
                onClick={() =>
                  handleAction(() =>
                    stopAction.executeAsync({ ideSessionId: id }),
                  )
                }
              >
                {stopAction.isExecuting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Square className="mr-2 h-4 w-4" />
                )}
                {stopAction.isExecuting ? "Stopping..." : "Stop Session"}
              </Button>
            )}
          </PopoverContent>
        </Popover>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pt-2">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          {status === "terminated" && (
            <>
              <Clock size={16} />
              Session stopped
              {ended_at ? ` on ${ended_at.toLocaleDateString()}` : ""}
            </>
          )}

          {status !== "terminated" && (
            <>
              <Clock size={16} />
              Running for{" "}
              {Math.floor((Date.now() - started_at.getTime()) / 60000)} minutes
            </>
          )}
        </p>
        {due_date && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar size={16} />
            Due on {due_date.toLocaleDateString()}
          </p>
        )}
      </CardContent>

      <CardFooter className="mt-auto flex w-full items-center justify-between gap-2 border-t p-2">
        {/* Active Link State */}
        {status === "active" && (
          <Button
            variant="default"
            size="lg"
            className="grow gap-2 transition-colors"
            asChild
          >
            <Link href={`https://${ide_identifier}-ide.studentide.com`}>
              <Play className="h-4 w-4" />
              Open IDE
            </Link>
          </Button>
        )}

        {/* Disabled State (Provisioning) */}
        {status === "provisioning" && (
          <Button
            variant="default"
            size="lg"
            className="grow gap-2 transition-colors"
            disabled
          >
            <Play className="h-4 w-4" />
            Open IDE
          </Button>
        )}

        {status === "terminated" && (
          <Button
            variant="default"
            size="lg"
            className="grow gap-2 transition-colors"
            disabled={isBusy || isSubmitted}
            onClick={() =>
              handleAction(() =>
                restartAction.executeAsync({ ideSessionId: id }),
              )
            }
          >
            {restartAction.isExecuting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCw className="h-4 w-4" />
            )}
            {restartAction.isExecuting ? "Restarting..." : "Restart Session"}
          </Button>
        )}

        {status === "error" && (
          <Button
            variant="destructive"
            size="lg"
            className="grow gap-2 transition-colors"
            disabled
          >
            <TriangleAlert className="h-4 w-4" />
            Session Error
          </Button>
        )}

        <Button
          variant="outline"
          size="lg"
          className="gap-2 transition-colors hover:bg-primary hover:text-primary-foreground"
          disabled={isSubmitted || isBusy}
          onClick={() =>
            handleAction(() => submitAction.executeAsync({ ideSessionId: id }))
          }
        >
          {submitAction.isExecuting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isSubmitted ? (
            <Check className="h-4 w-4" />
          ) : (
            <Inbox className="h-4 w-4" />
          )}
          {submitAction.isExecuting
            ? "Submitting..."
            : isSubmitted
              ? "Submitted"
              : "Submit"}
        </Button>
      </CardFooter>
      {error && (
        <p className="border-t px-3 py-2 text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </Card>
  );
}
