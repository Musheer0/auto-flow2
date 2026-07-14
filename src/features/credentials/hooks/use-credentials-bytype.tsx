import { NodeType } from "@/generated/prisma/enums";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export const useCredentialsByType = (type: NodeType) => {
  const trpc = useTRPC();
  return useQuery(trpc.credentials.getByType.queryOptions({ type }));
};
