"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

export const useUpgradeUsage = () => {
  const trpc = useTRPC();
  return useMutation(
    trpc.aiUsage.upgradeUsage.mutationOptions({
      onSuccess: (data) => {
        if(window){
          //@ts-ignore
          window.location.href = data.url;
        }
      },
    }),
  );
};
