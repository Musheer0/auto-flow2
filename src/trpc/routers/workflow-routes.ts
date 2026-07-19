import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { generateSlug } from "random-word-slugs";
import prisma from "@/db";
import { redis } from "@/db/redis";
import { redisKeys } from "@/lib/redis-keys";

export const workflowsRouer = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const workflow_name = input.name || generateSlug();
      const new_workflow = await prisma.workflow.create({
        data: {
          user_id: userId,
          name: workflow_name,
        },
      });
      await redis.set(redisKeys.WORKFLOW(userId, new_workflow.id), new_workflow, { ex: 60 * 60 });
      return new_workflow;
    }),
  update: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        workflow_id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const workflow_name = input.name;
      const updated_workflow = await prisma.workflow.update({
        where: {
          id: input.workflow_id,
          user_id: userId,
        },
        data: {
          user_id: userId,
          name: workflow_name,
        },
      });
      await redis.set(redisKeys.WORKFLOW(userId, updated_workflow.id), updated_workflow, { ex: 60 * 60 });
      return updated_workflow;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        workflow_id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      await prisma.workflow.deleteMany({
        where: {
          user_id: userId,
          id: input.workflow_id,
        },
      });
      await redis.del(redisKeys.WORKFLOW(userId, input.workflow_id));
    }),
  getById: protectedProcedure
    .input(
      z.object({
        workflow_id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const cacheKey = redisKeys.WORKFLOW(userId, input.workflow_id);
      const cached = await redis.get<Awaited<ReturnType<typeof prisma.workflow.findFirst>>>(cacheKey);
      if (cached) return cached;
      const workflow = await prisma.workflow.findFirst({
        where: {
          user_id: userId,
          id: input.workflow_id,
        },
      });
      if (workflow) {
        await redis.set(cacheKey, workflow, { ex: 60 * 60 });
      }
      return workflow;
    }),
  getAll: protectedProcedure
    .input(
      z.object({
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const hasCursor = !!input.cursor;
      if (!hasCursor) {
        const workflows = await prisma.workflow.findMany({
          where: {
            user_id: userId,
          },
          orderBy: {
            created_at: "desc",
          },
          take: 10,
        });
        return {
          workflows,
          nextCursor: workflows.length > 9 ? workflows[9].id : null,
        };
      }
      const workflows = await prisma.workflow.findMany({
        where: {
          user_id: userId,
        },
        orderBy: {
          created_at: "desc",
        },
        take: 10,
        cursor: {
          id: input.cursor,
        },
        skip: 1,
      });
      return {
        workflows,
        nextCursor: workflows.length > 9 ? workflows[9].id : null,
      };
    }),
});
