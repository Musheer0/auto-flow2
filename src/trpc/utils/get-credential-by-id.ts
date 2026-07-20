import prisma from "@/db";
import { redis } from "@/db/redis";
import { credential } from "@/generated/prisma/client";
import { redisKeys } from "@/lib/redis-keys";

export const getCredentialById = async (userId: string, credentialId: string) => {
  const cacheKey = redisKeys.CREDENTIAL(userId, credentialId);
  const cached = await redis.get<credential>(cacheKey);
  if (cached) return cached;

  const credential = await prisma.credential.findFirst({
    where: {
      id: credentialId,
      user_id: userId,
    },
  });

  if (credential) {
    await redis.set(cacheKey, credential, { ex: 60 * 60 });
  }

  return credential;
};
