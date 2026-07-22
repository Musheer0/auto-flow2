import prisma from "@/db";
import { redis } from "@/db/redis";
import { ai_usage } from "@/generated/prisma/client";
import { redisKeys } from "@/lib/redis-keys";

type UpdateMode = "inc" | "dec";

export const updateUserAiUsage = async (
  userId: string,
  tokens: number,
  mode: UpdateMode = "inc"
) => {
  const cacheKey = redisKeys.AI_USAGE(userId);

  const usage = await prisma.ai_usage.update({
    where: {
      user_id: userId,
    },
    data: {
      credits_used: {
        [mode === "inc" ? "increment" : "decrement"]: tokens,
      },
    },
  });

  await redis.set(cacheKey, usage, {
    ex: 60 * 60,
  });

  return usage;
};