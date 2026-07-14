"use client";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import type { CredentialsPage } from "@/features/credentials/types";

export const useCreateCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.create.mutationOptions({
      onSuccess: (newCredential) => {
        const infiniteKey = trpc.credentials.getAll.infiniteQueryKey({});

        queryClient.setQueryData(infiniteKey, (old) => {
          if (!old) {
            return {
              pages: [{ credentials: [newCredential], nextCursor: null }],
              pageParams: [null],
            };
          }

          const [firstPage, ...restPages] = old.pages;

          return {
            ...old,
            pages: [
              {
                ...firstPage,
                credentials: [newCredential, ...firstPage.credentials],
              },
              ...restPages,
            ],
          };
        });
      },
    }),
  );
};
