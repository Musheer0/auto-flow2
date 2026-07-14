// hooks/use-update-workflow.ts
"use client";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import type { Workflow, WorkflowsPage } from "@/features/workflows/types";

export const useUpdateWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.update.mutationOptions({
      onMutate: async (input) => {
        const byIdKey = trpc.workflows.getById.queryKey({
          workflow_id: input.workflow_id,
        });
        const infiniteKey = trpc.workflows.getAll.infiniteQueryKey({});

        await Promise.all([
          queryClient.cancelQueries({ queryKey: byIdKey }),
          queryClient.cancelQueries({ queryKey: infiniteKey }),
        ]);

        const prevWorkflow = queryClient.getQueryData<Workflow>(byIdKey);
        const prevList =
          queryClient.getQueryData<InfiniteData<WorkflowsPage, string | null>>(
            infiniteKey,
          );

        if (prevWorkflow) {
          queryClient.setQueryData(byIdKey, (old) => {
            if (!old) return old;
            return { ...old, name: input.name };
          });
        }

        queryClient.setQueryData(infiniteKey, (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              workflows: page.workflows.map((w) =>
                w.id === input.workflow_id ? { ...w, name: input.name } : w,
              ),
            })),
          };
        });

        return { prevWorkflow, prevList, byIdKey, infiniteKey };
      },
      onError: (_err, _input, ctx) => {
        if (!ctx) return;
        if (ctx.prevWorkflow)
          queryClient.setQueryData(ctx.byIdKey, ctx.prevWorkflow);
        if (ctx.prevList)
          queryClient.setQueryData(ctx.infiniteKey, ctx.prevList);
      },
      onSuccess: (updatedWorkflow) => {
        // reconcile with server response (in case server changed anything)
        queryClient.setQueryData(
          trpc.workflows.getById.queryKey({ workflow_id: updatedWorkflow.id }),
          updatedWorkflow,
        );
        queryClient.setQueryData(
          trpc.workflows.getAll.infiniteQueryKey({}),
          (old) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                workflows: page.workflows.map((w) =>
                  w.id === updatedWorkflow.id ? updatedWorkflow : w,
                ),
              })),
            };
          },
        );
      },
    }),
  );
};
