"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight, MessageSquareText, Play, Sparkles } from "lucide-react";
import { useRef } from "react";
import { Section, SectionHeading } from "./animations";

const steps = [
  {
    icon: MessageSquareText,
    title: "Describe",
    description:
      "Tell the AI what you want in plain English. 'When a form is submitted, summarize it and send to Telegram.'",
    color: "from-violet-500 to-violet-600",
    glow: "shadow-violet-500/20",
  },
  {
    icon: Sparkles,
    title: "Generate",
    description:
      "The AI builds your workflow instantly — nodes appear, edges connect, configuration is filled in.",
    color: "from-cyan-500 to-cyan-600",
    glow: "shadow-cyan-500/20",
  },
  {
    icon: Play,
    title: "Automate",
    description:
      "Trigger your workflow via webhook, schedule, or manual run. Watch data flow through your nodes in real time.",
    color: "from-emerald-500 to-emerald-600",
    glow: "shadow-emerald-500/20",
  },
];

function StepCard({
  step,
  index,
}: {
  step: (typeof steps)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const Icon = step.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: index * 0.15,
        duration: 0.6,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className="relative flex-1"
    >
      <div
        className={`rounded-2xl border border-white/[0.06] bg-zinc-900/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.12] hover:bg-zinc-900/80 hover:shadow-xl ${step.glow}`}
      >
        <div
          className={`mb-5 inline-flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${step.color} shadow-lg ${step.glow}`}
        >
          <Icon className="size-5 text-white" />
        </div>
        <div className="mb-2 flex items-center gap-3">
          <span className="flex size-6 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.05] text-xs font-bold text-zinc-400">
            {index + 1}
          </span>
          <h3 className="text-xl font-semibold text-white">{step.title}</h3>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          {step.description}
        </p>
      </div>
      {index < steps.length - 1 && (
        <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-[calc(50%+12px)] text-zinc-700 lg:block">
          <ArrowRight className="size-5" />
        </div>
      )}
    </motion.div>
  );
}

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <SectionHeading
        badge="How it Works"
        title="Three steps to automation"
        description="From idea to running workflow in under a minute."
      />
      <div className="mx-auto mt-16 flex max-w-5xl flex-col items-stretch gap-6 lg:flex-row lg:items-start lg:gap-0">
        {steps.map((step, i) => (
          <StepCard key={step.title} step={step} index={i} />
        ))}
      </div>
    </Section>
  );
}
