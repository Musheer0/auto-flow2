import z from "zod";
import prisma from "@/db";
import { encrypt, decrypt } from "@/lib/encrypt-decrypt";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { NodeType } from "@/generated/prisma/enums";
import { redis } from "@/db/redis";
import { redisKeys } from "@/lib/redis-keys";

export const credentialsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.nativeEnum(NodeType),
        data: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const credential = await prisma.credential.create({
        data: {
          user_id: ctx.session.user.id,
          name: input.name,
          type: input.type,
          data: encrypt(input.data),
        },
      });

      await redis.del(redisKeys.CREDENTIAL_BY_TYPE(ctx.session.user.id, input.type));

      return {
        ...credential,
      };
    }),

  update: protectedProcedure
    .input(
      z.object({
        credential_id: z.string(),
        name: z.string(),
        type: z.nativeEnum(NodeType),
        data: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const credential = await prisma.credential.updateMany({
        where: {
          id: input.credential_id,
          user_id: ctx.session.user.id,
        },
        data: {
          name: input.name,
          type: input.type,
          data: encrypt(input.data),
        },
      });

      await redis.del(redisKeys.CREDENTIAL_BY_TYPE(ctx.session.user.id, input.type));

      return credential;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        credential_id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const credential = await prisma.credential.findFirst({
        where: {
          id: input.credential_id,
          user_id: ctx.session.user.id,
        },
        select: { type: true },
      });

      await prisma.credential.deleteMany({
        where: {
          id: input.credential_id,
          user_id: ctx.session.user.id,
        },
      });

      if (credential) {
        await redis.del(redisKeys.CREDENTIAL_BY_TYPE(ctx.session.user.id, credential.type));
      }

      return true;
    }),
  getByType: protectedProcedure
    .input(
      z.object({
        type: z.nativeEnum(NodeType),
      }),
    )
    .query(async ({ ctx, input }) => {
      const cacheKey = redisKeys.CREDENTIAL_BY_TYPE(ctx.session.user.id, input.type);
      const cached = await redis.get<Awaited<ReturnType<typeof prisma.credential.findMany>>>(cacheKey);
      if (cached) return cached;

      const credentials = await prisma.credential.findMany({
        where: {
          user_id: ctx.session.user.id,
          type: input.type,
        },
        orderBy: {
          created_at: "desc",
        },
      });

      const result = credentials.map((credential) => ({
        ...credential,
      }));

      await redis.set(cacheKey, result, { ex: 60 * 60 });

      return result;
    }),

  getAll: protectedProcedure
    .input(
      z.object({
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const hasCursor = !!input.cursor;

      const credentials = await prisma.credential.findMany({
        where: {
          user_id: ctx.session.user.id,
        },
        orderBy: {
          created_at: "desc",
        },
        take: 10,
        ...(hasCursor && {
          cursor: {
            id: input.cursor,
          },
          skip: 1, // don't include the cursor item again
        }),
        select: {
          id: true,
          name: true,
          type: true,
          created_at: true,
          updated_at: true,
        },
      });

      return {
        credentials,
        nextCursor:
          credentials.length === 10
            ? credentials[credentials.length - 1].id
            : null,
      };
    }),
});
