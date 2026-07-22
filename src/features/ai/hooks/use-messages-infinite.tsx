"use client";
import { useTRPC } from "@/trpc/client";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useMessagesInfinite = (workflowId: string) => {
  const trpc = useTRPC();
  return useInfiniteQuery(
    trpc.messages.getAll.infiniteQueryOptions(
      { workflow_id: workflowId },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
        initialCursor: undefined,
      },
    ),
  );
};
