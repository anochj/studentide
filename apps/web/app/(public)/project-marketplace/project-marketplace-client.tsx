"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Code2, FolderOpen, Search, SearchX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getProjectMarketplaceProjects,
  queryProjectMarketplace,
} from "@/actions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

type MarketplaceProject = NonNullable<
  Awaited<ReturnType<typeof getProjectMarketplaceProjects>>["data"]
>["results"][number];

const skeletonCards = [
  "project-marketplace-skeleton-1",
  "project-marketplace-skeleton-2",
  "project-marketplace-skeleton-3",
  "project-marketplace-skeleton-4",
  "project-marketplace-skeleton-5",
  "project-marketplace-skeleton-6",
];

function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}

export default function ProjectMarketplacePage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim(), 250);

  const marketplaceQuery = useQuery({
    queryKey: ["project-marketplace", debouncedQuery],
    queryFn: async () => {
      if (debouncedQuery) {
        return await queryProjectMarketplace({
          query: debouncedQuery,
          maxResults: 20,
        });
      }

      return await getProjectMarketplaceProjects({
        page: 1,
        pageSize: 20,
      });
    },
  });

  const result = marketplaceQuery.data;
  const projects = useMemo(() => {
    if (!result?.data?.success) {
      return [];
    }

    return result.data.results;
  }, [result]);

  const errorMessage =
    result?.serverError ||
    (result?.validationErrors ? "Failed to validate request" : null);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-10 pt-8 sm:px-6 lg:px-8">
      <header className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 text-center">
        <div className="space-y-2">
          <h1 className="font-satoshi text-3xl font-semibold tracking-tight sm:text-4xl">
            Find Your Next Project
          </h1>
          <p className="text-muted-foreground">
            Explore the community built project definitions that anyone can use!
          </p>
        </div>

        <div className="relative w-full max-w-xl">
          <Search className="-translate-y-1/2 pointer-events-none absolute left-3 top-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            aria-label="Search projects"
            className="h-10 rounded-xl pl-9"
            placeholder="Search for projects..."
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
        </div>
      </header>

      <section className="min-h-[24rem]">
        {marketplaceQuery.isLoading && <MarketplaceProjectGridSkeleton />}

        {!marketplaceQuery.isLoading && errorMessage && (
          <MarketplaceState
            icon="error"
            title="Failed to load projects"
            description={errorMessage}
          />
        )}

        {!marketplaceQuery.isLoading &&
          !errorMessage &&
          projects.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {projects.map((item) => (
                <MarketplaceProjectCard item={item} key={item.project.id} />
              ))}
            </div>
          )}

        {!marketplaceQuery.isLoading &&
          !errorMessage &&
          projects.length === 0 && (
            <MarketplaceState
              icon={debouncedQuery ? "search" : "projects"}
              title={
                debouncedQuery
                  ? "No matching projects"
                  : "No public projects yet"
              }
              description={
                debouncedQuery
                  ? "Try a different search term or clear the search field."
                  : "Public project definitions will appear here once they are created."
              }
            />
          )}
      </section>
    </main>
  );
}

function MarketplaceProjectCard({ item }: { item: MarketplaceProject }) {
  const { project, environment } = item;
  const description = project.description || "No description provided";
  const environmentName = environment?.name || "Environment";
  const environmentDescription = environment?.description;

  return (
    <Card className="group relative h-full cursor-pointer transition-all hover:ring-primary/40 hover:shadow-md">
      <Link
        href={`/project/${project.slug}`}
        aria-label={`Open ${project.name}`}
        className="absolute inset-0 z-10 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />

      <CardHeader className="pointer-events-none relative z-20 flex flex-row items-start justify-between gap-3 space-y-0 pb-1">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground ring-1 ring-foreground/10">
            {environment?.icon ? (
              <Image
                src={environment.icon}
                alt={`${environmentName} icon`}
                width={28}
                height={28}
                className="object-cover"
              />
            ) : (
              <Code2 className="h-5 w-5" />
            )}
          </div>
          <div className="min-w-0 space-y-1">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h2 className="truncate font-semibold leading-tight tracking-tight">
                {project.name}
              </h2>
            </div>
            <p className="text-xs font-medium text-muted-foreground">
              {environmentName}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pointer-events-none relative z-20 flex flex-1 flex-col gap-4">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {description}
        </p>

        {environmentDescription && (
          <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
            <FolderOpen className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="line-clamp-2">{environmentDescription}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MarketplaceProjectGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {skeletonCards.map((key) => (
        <Card key={key} className="h-[14.5rem]">
          <CardHeader className="flex flex-row items-start gap-3 space-y-0">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </CardContent>
          <CardFooter className="justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-24" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function MarketplaceState({
  icon,
  title,
  description,
}: {
  icon: "error" | "projects" | "search";
  title: string;
  description: string;
}) {
  const Icon =
    icon === "error" ? AlertCircle : icon === "search" ? SearchX : FolderOpen;

  return (
    <Empty className="min-h-[20rem] border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
