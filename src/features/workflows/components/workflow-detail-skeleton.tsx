import { Skeleton } from "@/components/ui/skeleton";

export function WorkflowDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-48" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-7 w-16" />
        </div>
      </div>
      <Skeleton className="h-px w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
