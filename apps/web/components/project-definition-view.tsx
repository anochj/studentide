"use client";

import {
  Calendar,
  Code2,
  FileText,
  Puzzle,
  Rocket,
  UserCircle,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import Markdown from "react-markdown";
import { launchIDESession } from "@/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { getAuthPageHref } from "@/lib/auth-redirect";

type ProjectDefinitionViewProps = {
  project: {
    id: string;
    name: string;
    description: string | null;
    overview: string | null;
    starter_folder_included?: boolean;
    availability_opens: Date | null;
    availability_closes: Date | null;
    extension_store_enabled: boolean;
  };
  creator: {
    name: string;
    icon: string | null;
  };
  environment: {
    name: string;
    description: string;
    icon: string | null;
  };
};

function formatDate(date: Date | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

const markdownClassName = [
  "prose prose-sm md:prose-base max-w-none rounded-xl border bg-card p-6 text-card-foreground ring-1 ring-foreground/5",
  "prose-headings:font-heading prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-heading",
  "prose-h1:border-b prose-h1:border-border prose-h1:pb-3 prose-h1:text-3xl prose-h1:leading-tight",
  "prose-h2:border-b prose-h2:border-border/70 prose-h2:pb-2 prose-h2:text-2xl prose-h2:leading-tight",
  "prose-h3:text-xl prose-h4:text-lg prose-h5:text-base prose-h6:text-sm",
  "prose-p:leading-7 prose-p:text-body prose-lead:text-body-muted",
  "prose-a:font-medium prose-a:text-brand prose-a:underline prose-a:decoration-brand/40 prose-a:underline-offset-4 hover:prose-a:decoration-brand",
  "prose-strong:font-medium prose-strong:text-heading prose-em:text-body",
  "prose-ul:text-body prose-ol:text-body prose-li:marker:text-brand prose-li:pl-1",
  "prose-blockquote:rounded-lg prose-blockquote:border prose-blockquote:border-border prose-blockquote:bg-surface-2 prose-blockquote:px-4 prose-blockquote:py-3 prose-blockquote:text-body-muted prose-blockquote:not-italic",
  "prose-code:rounded-md prose-code:border prose-code:border-border prose-code:bg-surface-2 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-[0.9em] prose-code:font-medium prose-code:text-mint prose-code:before:content-none prose-code:after:content-none",
  "prose-pre:overflow-x-auto prose-pre:rounded-lg prose-pre:border prose-pre:border-border prose-pre:bg-background prose-pre:p-4 prose-pre:text-body prose-pre:shadow-none",
  "prose-pre:prose-code:border-0 prose-pre:prose-code:bg-transparent prose-pre:prose-code:p-0 prose-pre:prose-code:text-inherit",
  "prose-hr:border-border",
  "prose-table:overflow-hidden prose-table:rounded-lg prose-table:border prose-table:border-border prose-table:text-sm",
  "prose-thead:border-border prose-thead:bg-surface-2 prose-th:border-border prose-th:px-3 prose-th:py-2 prose-th:text-heading",
  "prose-td:border-border prose-td:px-3 prose-td:py-2 prose-td:text-body prose-tr:border-border",
  "prose-img:rounded-lg prose-img:border prose-img:border-border prose-img:bg-surface-2",
  "prose-figcaption:text-body-muted",
].join(" ");

export default function ProjectDefinitionView({
  project,
  creator,
  environment,
}: ProjectDefinitionViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const launchAction = useAction(launchIDESession);
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const opensAt = formatDate(project.availability_opens);
  const closesAt = formatDate(project.availability_closes);

  async function handleLaunch() {
    if (!session) {
      router.push(getAuthPageHref("/signup", pathname));
      return;
    }

    const result = await launchAction.executeAsync({
      projectId: project.id,
    });

    if (result?.data?.success) {
      router.push("/ide-sessions");
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl p-6 lg:p-8">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3 lg:gap-12">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {project.name}
            </h1>
            {project.description && (
              <p className="mt-3 text-lg text-muted-foreground">
                {project.description}
              </p>
            )}
          </div>

          <div className={markdownClassName}>
            <Markdown>{project.overview || "No overview provided."}</Markdown>
          </div>
        </div>

        <div className="sticky top-8 flex flex-col gap-6 lg:col-span-1">
          <div className="flex flex-col gap-2">
            <Button
              size="lg"
              className="h-12 w-full gap-2 text-base font-semibold"
              onClick={handleLaunch}
              disabled={launchAction.isExecuting || isSessionPending}
            >
              <Rocket className="h-5 w-5" />
              {launchAction.isExecuting ? "Launching..." : "Launch IDE"}
            </Button>

            {launchAction.result.serverError && (
              <p className="text-center text-sm font-medium text-destructive">
                {launchAction.result.serverError}
              </p>
            )}
            {launchAction.hasSucceeded && (
              <p className="text-center text-sm font-medium text-muted-foreground">
                Starting your workspace...
              </p>
            )}
          </div>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Project details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 rounded-md bg-muted p-2 text-foreground">
                  {environment.icon ? (
                    <Image
                      src={environment.icon}
                      alt={environment.name}
                      width={25}
                      height={25}
                    />
                  ) : (
                    <Code2 className="h-5 w-5" />
                  )}
                </div>
                <div className="grid gap-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Environment
                  </p>
                  <p className="text-sm font-medium leading-none">
                    {environment.name}
                  </p>
                  {environment.description && (
                    <p className="text-xs text-muted-foreground">
                      {environment.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="h-px bg-border" />

              <div className="flex items-start gap-4">
                <div className="mt-0.5 rounded-md bg-muted p-2 text-foreground">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="grid gap-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Availability
                  </p>
                  {opensAt || closesAt ? (
                    <>
                      {opensAt && (
                        <p className="text-sm font-medium">Opens: {opensAt}</p>
                      )}
                      {closesAt && (
                        <p className="text-sm font-medium text-muted-foreground">
                          Closes: {closesAt}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm font-medium text-muted-foreground">
                      Always open
                    </p>
                  )}
                </div>
              </div>

              <div className="h-px bg-border" />

              <div className="flex items-start gap-4">
                <div className="mt-0.5 rounded-md bg-muted p-2 text-muted-foreground">
                  <Puzzle className="h-5 w-5" />
                </div>
                <div className="grid gap-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Extension Marketplace
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">
                    {project.extension_store_enabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </div>

              <div className="h-px bg-border" />

              <div className="flex items-start gap-4">
                <div className="mt-0.5 rounded-md bg-muted p-2 text-muted-foreground">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="grid gap-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Starter Files
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">
                    {project.starter_folder_included
                      ? "Included in workspace"
                      : "Not included in workspace"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                {creator.icon ? (
                  <Image
                    src={creator.icon}
                    alt={creator.name}
                    className="h-full w-full rounded-full object-cover"
                    width={40}
                    height={40}
                  />
                ) : (
                  <UserCircle className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div className="grid gap-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Created By
                </p>
                <p className="text-sm font-medium">{creator.name}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
