import { redirect } from "next/navigation";
import DodoPayments from "dodopayments";

const client = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY!,
  environment: "test_mode",
});

type Props = {
  searchParams: Promise<{
    payment_id?: string;
    status?: string;
    email?: string;
  }>;
};

export default async function Page({
  searchParams,
}: Props) {
  const { payment_id } = await searchParams;

  if (!payment_id) {
    redirect("/checkout");
  }

  try {
    // Fetch the payment from Dodo
    const payment = await client.payments.retrieve(payment_id);



    // TODO:
    // - Upgrade the user's plan
    // - Save subscription/payment in your DB
    // - Grant credits, etc.

    redirect("/workflows");
  } catch (err) {
    console.error(err);
    redirect("/checkout?error=payment_verification_failed");
  }
}