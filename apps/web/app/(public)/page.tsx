import {
  ArrowRight,
  BookOpenCheck,
  Calendar,
  Code2,
  FileCode2,
  FolderKanban,
  FolderOpen,
  GitBranch,
  ImageIcon,
  Inbox,
  MoreHorizontal,
  Play,
  Rocket,
  Search,
  Send,
  TerminalSquare,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { absoluteUrl, jsonLdScript, siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

const workflow = [
  {
    icon: FolderKanban,
    label: "Define",
    text: "Package goals, starter files, visibility, and runtime choices into a reusable project.",
  },
  {
    icon: TerminalSquare,
    label: "Launch",
    text: "Open a prepared workspace so students start in the right environment, not setup docs.",
  },
  {
    icon: Send,
    label: "Review",
    text: "Collect submissions with enough structure for instructors to compare work quickly.",
  },
];

const explorerFiles = [
  { name: "studentide.json", active: true },
  { name: "instructions.md" },
  { name: "src/app.ts" },
  { name: "tests/api.test.ts" },
  { name: "submission.md" },
];

const definitionRows = [
  ["Runtime", "Node 22, Postgres, pnpm"],
  ["Starter files", "6 files, 2 hidden tests"],
  ["Visibility", "Classroom now, marketplace later"],
  ["Review", "Rubric, diff, submission notes"],
];

const definitionEnvironments = [
  ["Node.js API", "Express, pnpm, Postgres"],
  ["React App", "Vite, Vitest, browser preview"],
];

const sessionCards = [
  {
    name: "REST API Lab",
    status: "Active",
    statusClass: "bg-green-100 text-green-800 hover:bg-green-100",
    runtime: "Running for 18 minutes",
    due: "Due on May 12",
  },
  {
    name: "Data Structures",
    status: "Provisioning",
    statusClass: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    runtime: "Running for 2 minutes",
    due: "Due on May 16",
  },
];

const marketplaceSkills = [
  {
    name: "REST API Lab",
    environment: "Node.js API",
    description:
      "Build an authenticated Express API with persistence, tests, and structured submission notes.",
    environmentDescription: "Express, auth middleware, Postgres, and Jest.",
  },
  {
    name: "Data Structures",
    environment: "TypeScript",
    description:
      "Practice arrays, maps, queues, and linked structures with an automated test suite.",
    environmentDescription: "TypeScript starter files with Jest tests.",
  },
  {
    name: "SQL Practice",
    environment: "Postgres",
    description:
      "Write migrations and queries against a prepared schema, then submit the final SQL files.",
    environmentDescription: "Postgres database, seed data, and query checks.",
  },
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    url: absoluteUrl("/"),
    description: siteConfig.description,
  };

  return (
    <main className="min-h-dvh overflow-hidden">
      <script type="application/ld+json">{jsonLdScript(jsonLd).__html}</script>
      <section className="section-container grid min-h-[calc(100dvh-4rem)] items-center gap-12 py-16 lg:grid-cols-[1fr_0.88fr] lg:py-20">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-mint/25 bg-mint/10 px-2.5 py-1 text-xs font-medium text-mint">
            <BookOpenCheck className="size-3.5" />
            Coding projects from definition to submission
          </div>

          <h1 className="max-w-4xl text-5xl leading-[0.95] tracking-tight text-heading sm:text-6xl lg:text-7xl">
            A technical classroom workspace that starts at the project.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-body-muted sm:text-lg">
            studentide helps instructors turn coding assignments into structured
            project definitions, prepared IDE sessions, and reviewable student
            submissions. The product is built to show the workflow, not hide it
            behind a generic dashboard.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/project-definitions">
                Create a project
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/project-marketplace">Browse marketplace</Link>
            </Button>
          </div>

          <div className="mt-10 grid max-w-2xl gap-3 border-y border-border py-5 sm:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-heading">Instructors</p>
              <p className="mt-1 text-sm leading-6 text-body-muted">
                Build once, reuse and review with context.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-heading">Students</p>
              <p className="mt-1 text-sm leading-6 text-body-muted">
                Start from a ready workspace and clear goals.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-heading">Portfolio</p>
              <p className="mt-1 text-sm leading-6 text-body-muted">
                Demonstrates full-stack product judgment.
              </p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-brand-glow blur-3xl" />
          <div className="relative overflow-hidden rounded-2xl border bg-surface-1 shadow-2xl shadow-background/60">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                  <Code2 className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-heading">StudentIDE</p>
                  <p className="truncate text-xs text-body-muted">
                    intro-api-lab.workspace
                  </p>
                </div>
              </div>
              <div className="hidden items-center gap-1.5 text-xs text-body-muted sm:flex">
                <span className="size-2 rounded-full bg-mint" />
                workspace ready
              </div>
            </div>

            <div className="grid min-h-[24rem] grid-cols-[3rem_1fr] sm:grid-cols-[3rem_10rem_1fr]">
              <div className="border-r bg-surface-2 py-3">
                <div className="flex flex-col items-center gap-3 text-body-muted">
                  <FileCode2 className="size-4 text-heading" />
                  <Search className="size-4" />
                  <GitBranch className="size-4" />
                  <Rocket className="size-4 text-mint" />
                </div>
              </div>

              <div className="hidden border-r bg-surface-1 p-3 sm:block">
                <p className="mb-3 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-body-muted">
                  Explorer
                </p>
                <div className="space-y-1">
                  {explorerFiles.map((file) => (
                    <div
                      key={file.name}
                      className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-xs ${
                        file.active
                          ? "bg-brand-soft text-heading"
                          : "text-body-muted"
                      }`}
                    >
                      <FileCode2 className="size-3.5" />
                      <span className="truncate">{file.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex border-b bg-surface-2 text-xs">
                  <div className="border-r border-border bg-surface-1 px-3 py-2 text-heading">
                    studentide.json
                  </div>
                  <div className="hidden px-3 py-2 text-body-muted sm:block">
                    src/app.ts
                  </div>
                </div>
                <div className="bg-[oklch(15%_0.012_250)]">
                  <pre className="min-h-[18rem] overflow-hidden p-4 font-mono text-[0.78rem] leading-6 text-body sm:text-sm">
                    <code>{`type Submission = {
  projectId: string
  author: Student
  files: StarterBundle
}

await studentide.launch({
  environment: "node",
  reviewMode: "structured",
  marketplaceSkill: "rest-api"
})`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-surface-1/50">
        <div className="section-container py-16">
          <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
            <div>
              <p className="landing-kicker">Workflow</p>
              <h2 className="mt-3 text-3xl tracking-tight text-heading">
                The product surface mirrors the real teaching loop.
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {workflow.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border bg-background p-4"
                >
                  <item.icon className="size-5 text-brand" />
                  <h3 className="mt-5 text-base text-heading">{item.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-body-muted">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t">
        <div className="section-container grid gap-8 py-16 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div>
            <p className="landing-kicker">Create definitions</p>
            <h2 className="mt-3 text-3xl tracking-tight text-heading">
              Use the same definition form students and instructors will meet in
              the app.
            </h2>
            <p className="mt-4 text-sm leading-6 text-body-muted">
              The landing preview now mirrors the create page: project details,
              environment selection, starter folder upload, and release
              controls.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 rounded-xl border bg-background p-4 md:p-6 lg:grid-cols-5">
            <div className="flex flex-col gap-6 lg:col-span-3">
              <fieldset className="flex flex-col gap-4">
                <legend className="mb-1.5 font-medium text-base">
                  Project Details
                </legend>
                <p className="-mt-1.5 text-sm leading-normal text-muted-foreground">
                  Basic information to categorize your project.
                </p>
                <div className="flex flex-col gap-5">
                  <div className="flex w-full flex-col gap-2">
                    <label
                      htmlFor="landing-project-name"
                      className="w-fit text-sm font-medium leading-snug"
                    >
                      Name<span className="text-destructive">*</span>
                    </label>
                    <div
                      id="landing-project-name"
                      className="flex h-8 w-full items-center rounded-lg border border-input bg-transparent px-2.5 text-sm text-heading dark:bg-input/30"
                    >
                      Intro API Lab
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-2">
                    <label
                      htmlFor="landing-project-description"
                      className="w-fit text-sm font-medium leading-snug"
                    >
                      Description
                    </label>
                    <div
                      id="landing-project-description"
                      className="min-h-16 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm leading-6 text-muted-foreground dark:bg-input/30"
                    >
                      Build a small Express API, persist records in Postgres,
                      and submit tests with implementation notes.
                    </div>
                  </div>
                </div>
              </fieldset>

              <fieldset className="flex flex-col gap-4">
                <legend className="mb-1.5 font-medium text-base">
                  Development Environment
                </legend>
                <p className="-mt-1.5 text-sm leading-normal text-muted-foreground">
                  Choose the environment the project will have.
                </p>
                <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                  {definitionEnvironments.map(([name, description], index) => (
                    <div
                      key={name}
                      className={`flex items-start justify-between gap-3 rounded-lg border p-2.5 ${
                        index === 0 ? "border-primary/30 bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-background">
                          <ImageIcon className="size-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{name}</p>
                          <p className="text-sm leading-normal text-muted-foreground">
                            {description}
                          </p>
                        </div>
                      </div>
                      <span className="mt-1 size-4 rounded-full border border-primary/40 bg-primary/10" />
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="flex flex-col gap-6 lg:col-span-2">
              <fieldset className="flex flex-col gap-4">
                <legend className="mb-1.5 font-medium text-base">
                  Upload Starter Folder
                </legend>
                <p className="-mt-1.5 text-sm leading-normal text-muted-foreground">
                  This folder becomes the initial content of the project.
                </p>
                <div className="rounded-lg border border-dashed bg-muted/40 p-4">
                  <div className="flex items-center gap-3">
                    <FolderOpen className="size-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-heading">
                        starter-files.zip
                      </p>
                      <p className="text-xs text-muted-foreground">
                        6 files detected, overview.md imported
                      </p>
                    </div>
                  </div>
                </div>
              </fieldset>

              <fieldset className="flex flex-col gap-4">
                <legend className="mb-1.5 font-medium text-base">
                  Release Settings
                </legend>
                <div className="space-y-2">
                  {definitionRows.slice(2).map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-lg border bg-muted/30 p-3"
                    >
                      <p className="text-sm font-medium">{label}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-surface-1/50">
        <div className="section-container grid gap-8 py-16 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div>
            <p className="landing-kicker">Launch IDE sessions</p>
            <h2 className="mt-3 text-3xl tracking-tight text-heading">
              Show sessions as the same cards students use after launch.
            </h2>
            <p className="mt-4 text-sm leading-6 text-body-muted">
              The preview borrows the IDE session card structure: project icon,
              status badge, run metadata, and the same open and submit actions.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {sessionCards.map((session) => (
              <Card
                key={session.name}
                className="group flex h-full flex-col justify-between border transition-all"
              >
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                      <Code2 className="h-5 w-5" />
                    </div>

                    <div className="flex flex-col items-start gap-1">
                      <h3 className="font-semibold leading-none tracking-tight">
                        {session.name}
                      </h3>
                      <Badge
                        variant="default"
                        className={`px-1.5 py-0 text-[10px] font-normal ${session.statusClass}`}
                      >
                        {session.status}
                      </Badge>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="-mr-2 -mt-2 h-8 w-8 cursor-pointer"
                    aria-label="More options"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </CardHeader>

                <CardContent className="flex flex-col gap-3 pt-2">
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TerminalSquare size={16} />
                    {session.runtime}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar size={16} />
                    {session.due}
                  </p>
                </CardContent>

                <CardFooter className="mt-auto flex w-full items-center justify-between gap-2 border-t p-2">
                  <Button
                    variant="default"
                    size="lg"
                    className="grow gap-2 transition-colors"
                    asChild
                  >
                    <Link href="/ide-sessions">
                      <Play className="h-4 w-4" />
                      Open IDE
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 transition-colors hover:bg-primary hover:text-primary-foreground"
                    asChild
                  >
                    <Link href="/submissions">
                      <Inbox className="h-4 w-4" />
                      Submit
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t">
        <div className="section-container grid gap-8 py-16 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div>
            <p className="landing-kicker">Search marketplace</p>
            <h2 className="mt-3 text-3xl tracking-tight text-heading">
              Match the marketplace search and project cards.
            </h2>
            <p className="mt-4 text-sm leading-6 text-body-muted">
              The landing page now previews the actual marketplace pattern:
              centered search language, icon tiles, descriptions, and muted
              environment callouts inside each card.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="relative w-full">
              <Search className="-translate-y-1/2 pointer-events-none absolute left-3 top-1/2 h-4 w-4 text-muted-foreground" />
              <div className="flex h-10 w-full items-center rounded-xl border border-input bg-transparent pl-9 pr-3 text-sm text-muted-foreground dark:bg-input/30">
                Search for projects...
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {marketplaceSkills.map((skill) => (
                <Card
                  key={skill.name}
                  className="group relative h-full cursor-pointer transition-all hover:ring-primary/40 hover:shadow-md"
                >
                  <Link
                    href="/project-marketplace"
                    aria-label={`Open ${skill.name}`}
                    className="absolute inset-0 z-10 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />

                  <CardHeader className="pointer-events-none relative z-20 flex flex-row items-start justify-between gap-3 space-y-0 pb-1">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground ring-1 ring-foreground/10">
                        <Code2 className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                          <h2 className="truncate font-semibold leading-tight tracking-tight">
                            {skill.name}
                          </h2>
                        </div>
                        <p className="text-xs font-medium text-muted-foreground">
                          {skill.environment}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pointer-events-none relative z-20 flex flex-1 flex-col gap-4">
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {skill.description}
                    </p>

                    <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                      <FolderOpen className="mt-0.5 h-4 w-4 shrink-0" />
                      <p className="line-clamp-2">
                        {skill.environmentDescription}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
