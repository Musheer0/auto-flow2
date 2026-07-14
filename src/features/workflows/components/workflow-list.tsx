"use client";

import { useQueryState, parseAsString } from "nuqs";
import { Loader2, Search, X, Workflow as WorkflowIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { useWorkflowsInfinite } from "@/features/workflows/hooks/use-workflows-infinite";
import { WorkflowCard } from "./workflow-card";
import { CreateWorkflowDialog } from "./create-workflow-dialog";

export function WorkflowList() {
  // URL-persisted filter value (shareable / refresh-safe). No debounce
  // needed here since this only filters data already in memory — it
  // never triggers a network request.
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("").withOptions({
      shallow: false,
      clearOnDefault: true,
    }),
  );

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useWorkflowsInfinite();

  const allWorkflows = data?.pages.flatMap((page) => page.workflows) ?? [];

  // Client-side filter over whatever pages have been fetched so far.
  // Pages not yet loaded (via "Load more") aren't searched — load more
  // first if you expect a match further down the list.
  const normalizedSearch = search.trim().toLowerCase();
  const workflows = normalizedSearch
    ? allWorkflows.filter((w) =>
        (w.name || "").toLowerCase().includes(normalizedSearch),
      )
    : allWorkflows;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Workflows
          </h1>
          <p className="text-sm text-muted-foreground">
            {isPending
              ? "Loading your workflows…"
              : `${workflows.length} workflow${workflows.length === 1 ? "" : "s"}${
                  search ? ` matching “${search}”` : ""
                }`}
          </p>
        </div>

        <div className="relative ml-auto w-full sm:w-72">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value || null)}
            placeholder="Search workflows…"
            className="pl-8 pr-8"
            aria-label="Search workflows"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch(null)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <CreateWorkflowDialog />
      </div>

      {/* Error state */}
      {isError && (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-10 text-center">
          <p className="text-sm font-medium text-destructive">
            Couldn&apos;t load workflows
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            {error?.message ?? "Something went wrong. Please try again."}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      )}

      {/* Initial loading skeletons */}
      {isPending && !isError && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="space-y-4 rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isPending && !isError && workflows.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border px-6 py-16 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <WorkflowIcon className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-foreground">
            {search ? "No matching workflows" : "No workflows yet"}
          </p>
          <p className="max-w-xs text-sm text-muted-foreground">
            {search
              ? hasNextPage
                ? "No matches in what's loaded yet — try Load more, or clear the filter."
                : "Try a different search term, or clear the filter."
              : "Workflows you create will show up here."}
          </p>
          {search && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setSearch(null)}
            >
              Clear search
            </Button>
          )}
        </div>
      )}

      {/* Results grid */}
      {!isPending && !isError && workflows.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workflows.map((workflow) => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}
        </div>
      )}

      {/* Load more */}
      {!isPending && !isError && hasNextPage && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className={cn("min-w-40")}
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading…
              </>
            ) : (
              "Load more"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
