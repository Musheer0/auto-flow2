import { client } from "@/features/payment/client";
import { createTRPCRouter, protectedWithUsageProcedure } from "../init";
import { create_session } from "@/features/payment/create-session";

export const aiUsageRouter = createTRPCRouter({
  getUsage: protectedWithUsageProcedure.query(async ({ ctx }) => {
    return ctx.session.usage;
  }),

  upgradeUsage: protectedWithUsageProcedure.mutation(async ({ ctx }) => {
    const { email, name } = ctx.session.user;

    const session = await create_session(email, name);

    return { url: session.checkout_url };
  }),
});
