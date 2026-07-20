import prisma from "@/db";
import { redis } from "@/db/redis";
import { workflow } from "@/generated/prisma/client";
import { redisKeys } from "@/lib/redis-keys";

export const getWorkflowByid = async (workflowId: string) => {
  const cacheKey = redisKeys.WORKFLOW_RUN(workflowId);
  const cached = await redis.get<workflow>(cacheKey);
  if (cached) return cached;

  const workflow = await prisma.workflow.findFirst({
    where: { id: workflowId },
  });

  if (workflow) {
    await redis.set(cacheKey, workflow, { ex: 60 * 60 });
  }

  return workflow;
};
