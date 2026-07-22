import z from "zod";
import { createTRPCRouter, protectedProcedure, protectedWithUsageProcedure } from "../init";
import prisma from "@/db";
import { TRPCError } from "@trpc/server";
import { MessageType } from "@/generated/prisma/enums";
import { getWorkflowByid } from "../utils/get-workflow-by-id";
import { generateWorkflow } from "@/features/ai/agent";
import { updateUserAiUsage } from "../utils/update-user-ai-usage";

export const messagesRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        workflow_id: z.string(),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const messages = await prisma.message.findMany({
        where: {
          user_id: userId,
          workflow_id: input.workflow_id,
        },
        orderBy: {
          created_at: "desc",
        },
        take: 50,
        ...(input.cursor && {
          cursor: {
            id: input.cursor,
          },
          skip: 1,
        }),
      });

      return {
        messages:messages.reverse(),
        nextCursor: messages.length === 50 ? messages[messages.length - 1].id : null,
      };
    }),

  send:protectedWithUsageProcedure
    .input(
      z.object({
        workflow_id: z.string(),
        content: z.string().min(1),
        type: z.nativeEnum(MessageType).optional(),
        prev_summary:z.string().max(10000).nullable()
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const hasSufficientCredits = ctx.session.usage.credits_alloted - ctx.session.usage.credits_used >2000
      if(!hasSufficientCredits) throw new TRPCError({code:"PAYMENT_REQUIRED"})

      const workflow = await getWorkflowByid(input.workflow_id)

      if (!workflow || workflow.user_id!==ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Workflow not found" });
      }

      const message = await prisma.message.create({
        data: {
          user_id: userId,
          workflow_id: input.workflow_id,
          content: input.content,
          type: input.type ?? MessageType.USER,
        },
      });
       const generated_workflow = await generateWorkflow(input.content,input.workflow_id, workflow.data||{},input.prev_summary!)
        const summary = await prisma.message.create({
        data: {
          user_id: userId,
          workflow_id: input.workflow_id,
          content: generated_workflow.summary,
          type: MessageType.AI,
          credits_used:generated_workflow.tokens_used||100
        },
      });
      const usage = await updateUserAiUsage(userId, generated_workflow.tokens_used,"inc")
      return {messages:[message,summary],workflow:generated_workflow.updated_workflow,usage};
    }),
});
