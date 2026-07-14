// hooks/use-workflow-by-id.ts
"use client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export const useWorkflowById = (id: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.workflows.getById.queryOptions({ workflow_id: id }));
};
