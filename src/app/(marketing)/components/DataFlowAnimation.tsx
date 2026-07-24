"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FadeIn, Section, SectionHeading } from "./animations";

const flowSteps = [
  {
    from: { label: "fetch_data", field: "response" },
    to: { label: "summarize", field: "user_prompt" },
    value: '{ "status": 200, "items": [...] }',
  },
  {
    from: { label: "summarize", field: "output" },
    to: { label: "send_telegram", field: "message" },
    value: '"Summary: 3 new orders received..."',
  },
];

function FlowLine({ index }: { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const step = flowSteps[index];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.3, duration: 0.6 }}
      className="flex flex-col items-center gap-4"
    >
      <div className="flex w-full max-w-xl items-center gap-4">
        {/* Source node */}
        <div className="flex-1 rounded-xl border border-white/[0.08] bg-zinc-900/80 p-4">
          <span className="text-xs text-zinc-500">{step.from.label}</span>
          <div className="mt-1 rounded-lg bg-white/[0.03] px-3 py-2">
            <code className="text-xs text-cyan-400">
              {`{{${step.from.label}.${step.from.field}}}`}
            </code>
          </div>
        </div>

        {/* Animated connection line */}
        <div className="relative flex w-24 flex-col items-center">
          <div className="h-px w-full bg-white/[0.08]" />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{
              delay: index * 0.3 + 0.3,
              duration: 0.8,
              ease: "easeOut",
            }}
            className="absolute h-px w-full origin-left bg-gradient-to-r from-cyan-500 to-violet-500"
          />
          <motion.div
            initial={{ x: "-50%", opacity: 0 }}
            animate={isInView ? { x: "50%", opacity: [0, 1, 1, 0] } : {}}
            transition={{
              delay: index * 0.3 + 0.5,
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 2,
            }}
            className="absolute top-1/2 size-2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-500/50"
          />
          <span className="mt-2 rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] text-zinc-600">
            data flows
          </span>
        </div>

        {/* Target node */}
        <div className="flex-1 rounded-xl border border-white/[0.08] bg-zinc-900/80 p-4">
          <span className="text-xs text-zinc-500">{step.to.label}</span>
          <div className="mt-1 rounded-lg bg-white/[0.03] px-3 py-2">
            <code className="text-xs text-violet-400">{step.to.field}</code>
          </div>
        </div>
      </div>

      {/* Value bubble */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: index * 0.3 + 0.6, duration: 0.4 }}
        className="rounded-lg border border-white/[0.06] bg-zinc-800/80 px-4 py-2"
      >
        <span className="text-xs text-zinc-400">{step.value}</span>
      </motion.div>
    </motion.div>
  );
}

export function DataFlowAnimation() {
  return (
    <Section>
      <SectionHeading
        badge="Data Flow"
        title="How data moves between nodes"
        description="Handlebars variables like {{node_name.property}} let downstream nodes access upstream outputs."
      />
      <div className="mx-auto mt-16 flex max-w-3xl flex-col gap-12">
        {flowSteps.map((_, i) => (
          <FlowLine key={`flow-${i}`} index={i} />
        ))}
      </div>
      <FadeIn delay={0.4} className="mx-auto mt-12 max-w-md text-center">
        <p className="text-sm text-zinc-500">
          Every node output becomes available to all downstream nodes. The AI
          handles variable references automatically.
        </p>
      </FadeIn>
    </Section>
  );
}
