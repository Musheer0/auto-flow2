import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

type Props = {
  searchParams: Promise<{
    error?: string;
  }>;
};

const errors = {
  payment_verification_failed: {
    title: "Payment verification failed",
    description:
      "We couldn't verify your payment. If you were charged, don't worry—we'll usually confirm it within a few moments.",
  },
  payment_not_completed: {
    title: "Payment not completed",
    description:
      "Your payment wasn't completed. Please try again or choose another payment method.",
  },
  default: {
    title: "Something went wrong",
    description:
      "An unexpected error occurred while processing your payment.",
  },
};

export default async function CheckoutPage({ searchParams }: Props) {
  const { error } = await searchParams;

  const data =
    error && error in errors
      ? errors[error as keyof typeof errors]
      : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm">
        {data ? (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-7 w-7 text-destructive" />
            </div>

            <h1 className="mt-6 text-center text-2xl font-bold">
              {data.title}
            </h1>

            <p className="mt-3 text-center text-muted-foreground">
              {data.description}
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/checkout"
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary text-primary-foreground hover:opacity-90"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Link>

              <Link
                href="/workflows"
                className="inline-flex h-11 items-center justify-center rounded-md border"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-center text-3xl font-bold">
              Complete your purchase
            </h1>

            <p className="mt-3 text-center text-muted-foreground">
              Choose a plan below to continue.
            </p>

            {/* Your Dodo checkout UI goes here */}
          </>
        )}
      </div>
    </main>
  );
}