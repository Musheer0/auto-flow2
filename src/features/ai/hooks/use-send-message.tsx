"use client";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { MessageType } from "@/generated/prisma/enums";
import type { AppRouter } from "@/trpc/routers/_app";
import type { inferRouterOutputs } from "@trpc/server";
import { useRef } from "react";

type RouterOutput = inferRouterOutputs<AppRouter>;
type MessageOutput = RouterOutput["messages"]["getAll"]["messages"][number];

export const useSendMessage = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const optimisticKey = useRef<string|null>(null)
  return useMutation(
    trpc.messages.send.mutationOptions({
      onMutate: async (input) => {
        const infiniteKey = trpc.messages.getAll.infiniteQueryKey({
          workflow_id: input.workflow_id,
        });
        await queryClient.cancelQueries({ queryKey: infiniteKey });

        const prevList = queryClient.getQueryData(
          infiniteKey,
        );
        const tempid = `temp-${Date.now()}`
        optimisticKey.current = tempid
        const optimisticMessage = {
          id: tempid,
          user_id: "",
          workflow_id: input.workflow_id,
          type: input.type ?? MessageType.USER,
          content: input.content,
          credits_used: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        queryClient.setQueryData(
          infiniteKey,
          (old: any) => {
            if (!old) {
              return {
                pages: [{ messages: [optimisticMessage], nextCursor: null }],
                pageParams: [null],
              };
            }

            const [firstPage, ...restPages] = old.pages;

            return {
              ...old,
              pages: [
                {
                  ...firstPage,
                  messages: [optimisticMessage, ...firstPage.messages],
                },
                ...restPages,
              ],
            };
          },
        );

        return { prevList, infiniteKey };
      },
      onError: (_err, input, ctx) => {
        if (ctx?.prevList)
          queryClient.setQueryData(ctx.infiniteKey, ctx.prevList);
      },
      onSuccess: (_data, input) => {
        const infiniteKey = trpc.messages.getAll.infiniteQueryKey({
          workflow_id: input.workflow_id,
        });
         queryClient.setQueryData(
          infiniteKey,
          (old: any) => {
            if (!old) {
              return {
                pages: [{ messages:_data.messages, nextCursor: null }],
                pageParams: [null],
              };
            }

            const [firstPage, ...restPages] = old.pages;

            return {
              ...old,
              pages: [
                {
                  ...firstPage,
                  messages: [ ...firstPage.messages].filter((m)=>m.id!==optimisticKey.current,..._data.messages),
                },
                ...restPages,
              ],
            };
          },
        );
        optimisticKey.current = null
         queryClient.setQueryData(
          trpc.workflows.getById.queryKey({ workflow_id:_data.workflow.id }),
          _data.workflow
        );
      },
    }),
  );
};
