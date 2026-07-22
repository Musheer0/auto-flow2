import { getCurrentUser } from "@/lib/auth.server";
import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import { getUserAiUsage } from "./utils/get-user-ai-usage";
import prisma from "@/db";

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: "user_123" };
});

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await getCurrentUser();
  if (!session) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({ ctx: { ...ctx, session } });
});
export const protectedWithUsageProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const usage = await getUserAiUsage(ctx.session.user.id)
  if (!usage) {
    const usage =await prisma.ai_usage.create({
      data:{
        user_id:ctx.session.user.id
      }
    })
      return next({ ctx: { ...ctx, session:{...ctx.session, usage} } });

  }
  return next({ ctx: { ...ctx, session:{...ctx.session, usage} } });
});