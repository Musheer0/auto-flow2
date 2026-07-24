"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn, Section, SectionHeading } from "./animations";

const plans = [
  {
    id: "self-hosted",
    name: "Self-Hosted",
    price: "Free",
    period: "forever",
    description:
      "Run AutoFlow on your own infrastructure. Full control, full features.",
    features: [
      "Unlimited workflows",
      "All node types",
      "AI workflow generation (bring your own Groq key)",
      "Visual React Flow editor",
      "Webhook triggers",
      "Encrypted credentials",
      "Community support",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    id: "cloud",
    name: "Cloud Credits",
    price: "$10",
    period: "one-time",
    description: "Purchase AI credits for managed usage. No server required.",
    features: [
      "10,000 credits on signup",
      "Additional credits via DodoPayments",
      "Same AI generation power",
      "Pay only for what you use",
      "Credit usage dashboard",
    ],
    cta: "Buy Credits",
    highlighted: true,
  },
];

export function PricingSection() {
  return (
    <Section id="pricing">
      <SectionHeading
        badge="Pricing"
        title="Simple, transparent pricing"
        description="Self-host for free, or buy credits for managed AI usage."
      />

      <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
        {plans.map((plan, i) => (
          <FadeIn key={plan.id} delay={i * 0.1}>
            <div
              className={`relative rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 ${
                plan.highlighted
                  ? "border-violet-500/30 bg-gradient-to-b from-violet-500/10 to-transparent shadow-xl shadow-violet-500/10"
                  : "border-white/[0.06] bg-zinc-900/40 hover:border-white/[0.12]"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">
                  {plan.price}
                </span>
                <span className="text-sm text-zinc-500">/{plan.period}</span>
              </div>
              <p className="mt-3 text-sm text-zinc-400">{plan.description}</p>
              <ul className="mt-6 flex flex-col gap-3">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-sm text-zinc-300"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className={`mt-8 w-full ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:from-violet-500 hover:to-cyan-400"
                    : ""
                }`}
                variant={plan.highlighted ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </div>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
