"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetUsage = () => {
  const trpc = useTRPC();
  return useQuery(trpc.aiUsage.getUsage.queryOptions());
};
