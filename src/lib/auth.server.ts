"use server";
import { cookie_name } from "@/constants";
import { cookies } from "next/headers";
import { verifyJwt } from "./jwt";
import prisma from "@/db";
import { redis } from "@/db/redis";
import { redisKeys } from "./redis-keys";
import { user } from "@/generated/prisma/client";

export const getCurrentUser = async () => {
  const c = await cookies();
  const token = c.get(cookie_name);
  if (!token?.value) return null;
  const jwt = verifyJwt(token.value);
  if (!jwt.sessionId) return null;
  const cached  = await redis.get<{id:string,expires_at:Date,user:user}>(redisKeys.SESSION(jwt.userId,jwt.sessionId))
  if(cached) return cached
  const sessionWithUser = await prisma.session.findFirst({
    where: {
      id: jwt.sessionId,
    },
    select: {
      id: true,
      user: true,
      expires_at: true,
    },
  });
  await redis.setex(redisKeys.SESSION(jwt.userId,jwt.sessionId),60*60*24,sessionWithUser)
  return sessionWithUser;
};
