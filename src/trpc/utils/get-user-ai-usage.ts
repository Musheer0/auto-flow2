import prisma from "@/db";
import { redis } from "@/db/redis";
import { ai_usage } from "@/generated/prisma/client";
import { redisKeys } from "@/lib/redis-keys";

export const getUserAiUsage = async (userId: string) => {
  const cacheKey = redisKeys.AI_USAGE(userId);
  const cached = await redis.get<ai_usage>(cacheKey);
  if (cached) return cached;

  const ai_usage = await prisma.ai_usage.findFirst({
    where: {
      user_id: userId,
    },
  });

  if (ai_usage) {
    await redis.set(cacheKey, ai_usage, { ex: 60 * 60 });
  }

  return ai_usage;
};
