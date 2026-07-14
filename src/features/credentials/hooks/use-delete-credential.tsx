"use client";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import type { CredentialsPage } from "@/features/credentials/types";

export const useDeleteCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.delete.mutationOptions({
      onMutate: async (input) => {
        const infiniteKey = trpc.credentials.getAll.infiniteQueryKey({});
        await queryClient.cancelQueries({ queryKey: infiniteKey });

        const prevList =
          queryClient.getQueryData<InfiniteData<CredentialsPage, string | null>>(infiniteKey);

        queryClient.setQueryData(infiniteKey, (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              credentials: page.credentials.filter(
                (c) => c.id !== input.credential_id,
              ),
            })),
          };
        });

        return { prevList, infiniteKey };
      },
      onError: (_err, _input, ctx) => {
        if (ctx?.prevList)
          queryClient.setQueryData(ctx.infiniteKey, ctx.prevList);
      },
    }),
  );
};
