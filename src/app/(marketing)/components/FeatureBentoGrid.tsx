"use client";

import { motion, useInView } from "framer-motion";
import {
  Bot,
  GitBranch,
  Globe,
  Lock,
  Mail,
  MousePointerClick,
  Server,
  Webhook,
} from "lucide-react";
import { useRef } from "react";
import { Section, SectionHeading } from "./animations";

const features = [
  {
    title: "Visual Editor",
    description:
      "Drag-and-drop React Flow canvas. Connect nodes visually, configure each step, see your workflow take shape.",
    icon: MousePointerClick,
    span: "col-span-1 lg:col-span-2",
    gradient: "from-violet-500/10 to-transparent",
  },
  {
    title: "AI Generation",
    description:
      "Describe your workflow in natural language and watch it materialize on the canvas.",
    icon: Bot,
    span: "col-span-1",
    gradient: "from-cyan-500/10 to-transparent",
  },
  {
    title: "Node Library",
    description:
      "HTTP, Email, Telegram, Discord, Groq AI, Webhooks, YouTube, Google Forms.",
    icon: Globe,
    span: "col-span-1",
    gradient: "from-blue-500/10 to-transparent",
  },
  {
    title: "Multiple Triggers",
    description:
      "Manual, webhook, YouTube PubSub, Google Forms. Start workflows from anything.",
    icon: Webhook,
    span: "col-span-1",
    gradient: "from-emerald-500/10 to-transparent",
  },
  {
    title: "Credentials Vault",
    description:
      "AES-256 encrypted at rest. API keys, tokens, and secrets stored securely per-user.",
    icon: Lock,
    span: "col-span-1 lg:col-span-2",
    gradient: "from-amber-500/10 to-transparent",
  },
  {
    title: "Parallel Execution",
    description:
      "Branching workflows run in parallel. Topological sort ensures correct ordering.",
    icon: GitBranch,
    span: "col-span-1",
    gradient: "from-rose-500/10 to-transparent",
  },
  {
    title: "Self-Hosted",
    description:
      "Docker-ready. Your data never leaves your infrastructure. No telemetry.",
    icon: Server,
    span: "col-span-1",
    gradient: "from-teal-500/10 to-transparent",
  },
  {
    title: "Credit-Based AI",
    description:
      "Pay only for what you use. 10,000 free credits on signup. Upgrade via DodoPayments.",
    icon: Mail,
    span: "col-span-1 lg:col-span-2",
    gradient: "from-indigo-500/10 to-transparent",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: index * 0.06,
        duration: 0.5,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-6 transition-all duration-300 hover:border-white/[0.12] hover:bg-zinc-900/70 hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-1 ${feature.span}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />
      <div className="relative z-10">
        <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-white/[0.06]">
          <Icon className="size-5 text-zinc-300" />
        </div>
        <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

export function FeatureBentoGrid() {
  return (
    <Section id="features">
      <SectionHeading
        badge="Features"
        title="Everything you need"
        description="A complete workflow automation platform, from visual editing to AI generation to production execution."
      />
      <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <FeatureCard key={feature.title} feature={feature} index={i} />
        ))}
      </div>
    </Section>
  );
}
