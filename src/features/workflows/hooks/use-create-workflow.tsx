// hooks/use-create-workflow.ts
"use client";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import type { WorkflowsPage } from "@/features/workflows/types";

export const useCreateWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.create.mutationOptions({
      onSuccess: (newWorkflow) => {
        const infiniteKey = trpc.workflows.getAll.infiniteQueryKey({});

        queryClient.setQueryData(infiniteKey, (old) => {
          if (!old) {
            return {
              pages: [{ workflows: [newWorkflow], nextCursor: null }],
              pageParams: [null],
            };
          }

          const [firstPage, ...restPages] = old.pages;

          return {
            ...old,
            pages: [
              {
                ...firstPage,
                workflows: [newWorkflow, ...firstPage.workflows],
              },
              ...restPages,
            ],
          };
        });

        // seed the getById cache too, so navigating to it is instant
        queryClient.setQueryData(
          trpc.workflows.getById.queryKey({ workflow_id: newWorkflow.id }),
          newWorkflow,
        );
      },
    }),
  );
};
