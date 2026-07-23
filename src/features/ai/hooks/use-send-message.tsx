"use client";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { MessageType } from "@/generated/prisma/enums";
import type { AppRouter } from "@/trpc/routers/_app";
import { TRPCError, type inferRouterOutputs } from "@trpc/server";
import { useRef } from "react";
import { toast } from "sonner";
import { useAurora } from "@/stores/aurora-store";

type RouterOutput = inferRouterOutputs<AppRouter>;
type MessageOutput = RouterOutput["messages"]["getAll"]["messages"][number];

export const useSendMessage = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const {show, hide} = useAurora()
  // const optimisticKey = useRef<string|null>(null)
  return useMutation(
    trpc.messages.send.mutationOptions({
      onMutate: async (input) => {
        show()
        // const infiniteKey = trpc.messages.getAll.infiniteQueryKey({
        //   workflow_id: input.workflow_id,
        // });
        // await queryClient.cancelQueries({ queryKey: infiniteKey });

        // const prevList = queryClient.getQueryData(
        //   infiniteKey,
        // );
        // const tempid = `temp-${Date.now()}`
        // optimisticKey.current = tempid
        // const optimisticMessage = {
        //   id: tempid,
        //   user_id: "",
        //   workflow_id: input.workflow_id,
        //   type: input.type ?? MessageType.USER,
        //   content: input.content,
        //   credits_used: 0,
        //   created_at: new Date().toISOString(),
        //   updated_at: new Date().toISOString(),
        // };

        // queryClient.setQueryData(
        //   infiniteKey,
        //   (old: any) => {
        //     if (!old) {
        //       return {
        //         pages: [{ messages: [optimisticMessage], nextCursor: null }],
        //         pageParams: [null],
        //       };
        //     }

        //     const [firstPage, ...restPages] = old.pages;

        //     return {
        //       ...old,
        //       pages: [
        //         {
        //           ...firstPage,
        //           messages: [optimisticMessage, ...firstPage.messages],
        //         },
        //         ...restPages,
        //       ],
        //     };
        //   },
        // );

        // return { prevList, infiniteKey };
      },
      onError: (_err, input, ctx) => {
        hide()
        // if (ctx?.prevList)
        //   queryClient.setQueryData(ctx.infiniteKey, ctx.prevList);
       if(_err instanceof TRPCError && _err.code==="PAYMENT_REQUIRED"){
        toast.error("your out of tokens please buy more tokens to continue")
       } 
      },
      onSuccess: async (_data, input) => {
        hide()
        const infiniteKey = trpc.messages.getAll.infiniteQueryKey({
          workflow_id: input.workflow_id,
        });
        await queryClient.invalidateQueries({ queryKey: infiniteKey });
         queryClient.setQueryData(
          trpc.workflows.getById.queryKey({ workflow_id:_data.workflow.id }),
          _data.workflow
        );
      },
    }),
  );
};
