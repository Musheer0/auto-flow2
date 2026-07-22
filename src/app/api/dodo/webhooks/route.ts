import { NextRequest, NextResponse } from "next/server";
import DodoPayments from "dodopayments";
import prisma from "@/db";
import { updateUserAiUsage } from "@/trpc/utils/update-user-ai-usage";
import { upgradeUserAiUsage } from "@/trpc/utils/upgrade-user-ai-usage";

const client = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY!,
  environment: "test_mode",
  webhookKey: process.env.DODO_WH!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    const event = client.webhooks.unwrap(body, {
      headers: {
        "webhook-id": req.headers.get("webhook-id")!,
        "webhook-signature": req.headers.get("webhook-signature")!,
        "webhook-timestamp": req.headers.get("webhook-timestamp")!,
      },
    });

    if(event.type==="credit.added"){
        const customer = await client.customers.retrieve(event.data.customer_id)
        const user = await prisma.user.findFirst({where:{email:customer.email}})
        if(user){
            await upgradeUserAiUsage(user.id, parseInt(event.data.amount))
        }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { success: false, error: "Invalid webhook signature" },
      { status: 400 }
    );
  }
}