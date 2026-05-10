import { Skeleton } from "@/components/ui/skeleton";

function skeletonKeys(prefix: string, length: number) {
  return Array.from({ length }, (_, index) => `${prefix}-${index}`);
}

export function DashboardPageHeaderSkeleton({
  action = false,
}: {
  action?: boolean;
}) {
  return (
    <div className="flex-none flex justify-between items-start pb-4 mb-4 border-b">
      <Skeleton className="h-9 w-56" />
      {action && <Skeleton className="h-10 w-32" />}
    </div>
  );
}

export function DashboardTableSkeleton({
  rows = 8,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="flex-1 min-h-0 overflow-hidden rounded-md border">
      <div
        className="grid gap-4 border-b bg-muted/30 px-4 py-3"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {skeletonKeys("column", columns).map((key) => (
          <Skeleton key={key} className="h-4 w-24" />
        ))}
      </div>
      <div className="divide-y">
        {skeletonKeys("row", rows).map((rowKey) => (
          <div
            key={rowKey}
            className="grid gap-4 px-4 py-4"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {skeletonKeys(`${rowKey}-column`, columns).map(
              (columnKey, columnIndex) => (
                <Skeleton
                  key={columnKey}
                  className={columnIndex === 0 ? "h-5 w-40" : "h-5 w-28"}
                />
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardCardGridSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-wrap gap-4">
        {skeletonKeys("card", cards).map((key) => (
          <div key={key} className="w-xs">
            <div className="flex min-h-48 flex-col rounded-lg border bg-card">
              <div className="flex items-start justify-between gap-3 p-6 pb-2">
                <div className="flex min-w-0 items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
              <div className="space-y-2 p-6 pt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              <div className="mt-auto flex items-center justify-between border-t p-4">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-9 w-28" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardPageSkeleton({
  variant = "cards",
  action = false,
}: {
  variant?: "cards" | "table";
  action?: boolean;
}) {
  return (
    <main className="flex h-full flex-col flex-1 min-h-0 p-6">
      <DashboardPageHeaderSkeleton action={action} />
      {variant === "table" ? (
        <DashboardTableSkeleton />
      ) : (
        <DashboardCardGridSkeleton />
      )}
    </main>
  );
}
