// hooks/use-delete-workflow.ts
"use client";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import type { WorkflowsPage } from "@/features/workflows/types";

export const useDeleteWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.delete.mutationOptions({
      onMutate: async (input) => {
        const infiniteKey = trpc.workflows.getAll.infiniteQueryKey({});
        await queryClient.cancelQueries({ queryKey: infiniteKey });

        const prevList =
          queryClient.getQueryData<InfiniteData<WorkflowsPage, string | null>>(infiniteKey);

        queryClient.setQueryData(infiniteKey, (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              workflows: page.workflows.filter(
                (w) => w.id !== input.workflow_id,
              ),
            })),
          };
        });

        return { prevList, infiniteKey };
      },
      onSuccess: (_data, input) => {
        queryClient.removeQueries({
          queryKey: trpc.workflows.getById.queryKey({
            workflow_id: input.workflow_id,
          }),
        });
      },
      onError: (_err, _input, ctx) => {
        if (ctx?.prevList)
          queryClient.setQueryData(ctx.infiniteKey, ctx.prevList);
      },
    }),
  );
};
