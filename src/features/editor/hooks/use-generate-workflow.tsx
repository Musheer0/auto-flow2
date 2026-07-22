import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useGenerateWorkflow = (id: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.generateWorkflow.mutationOptions({
      onSuccess: (data) => {
        queryClient.setQueryData(
          trpc.workflows.getById.queryKey({ workflow_id:id }),
          data
        );
      },
    })
  );
};