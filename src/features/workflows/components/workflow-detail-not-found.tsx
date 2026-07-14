"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Workflow as WorkflowIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WorkflowDetailNotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <WorkflowIcon className="h-6 w-6" />
      </div>
      <p className="text-sm font-medium text-foreground">Workflow not found</p>
      <p className="text-sm text-muted-foreground">
        This workflow may have been deleted or you don&apos;t have access.
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push("/workflows")}
      >
        <ArrowLeft className="size-4" />
        Back to Workflows
      </Button>
    </div>
  );
}
