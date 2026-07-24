"use client";

import { motion, useInView } from "framer-motion";
import { Database, HardDrive, Workflow, Zap } from "lucide-react";
import { useRef } from "react";
import { FadeIn, Section, SectionHeading } from "./animations";

const archParts = [
  {
    icon: Zap,
    label: "Inngest",
    desc: "Event-driven execution",
    color: "text-emerald-400",
  },
  {
    icon: Database,
    label: "PostgreSQL",
    desc: "Persistent storage",
    color: "text-blue-400",
  },
  {
    icon: HardDrive,
    label: "Redis",
    desc: "1hr cache layer",
    color: "text-red-400",
  },
  {
    icon: Workflow,
    label: "tRPC",
    desc: "Type-safe API",
    color: "text-violet-400",
  },
];

const execWaves = [
  { nodes: ["Webhook"], color: "bg-orange-500" },
  { nodes: ["HTTP Request"], color: "bg-violet-500" },
  { nodes: ["Groq AI"], color: "bg-cyan-500" },
  { nodes: ["Telegram", "Discord"], color: "bg-emerald-500" },
];

export function EngineDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <Section>
      <SectionHeading
        badge="Under the Hood"
        title="Built for reliability"
        description="Event-driven architecture with checkpointing, caching, and parallel execution."
      />

      <div className="mx-auto mt-16 grid max-w-5xl gap-12 lg:grid-cols-2">
        {/* Execution waves */}
        <FadeIn>
          <div className="rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-8">
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Topological Execution (BFS)
            </h3>
            <div ref={ref} className="flex flex-col gap-4">
              {execWaves.map((wave, i) => (
                <motion.div
                  key={`wave-${i}`}
                  initial={{ opacity: 0, x: -16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.3, duration: 0.5 }}
                  className="flex items-center gap-4"
                >
                  <span className="w-16 text-right text-xs text-zinc-600">
                    Wave {i + 1}
                  </span>
                  <div className="h-px flex-1 bg-white/[0.04]" />
                  <div className="flex gap-2">
                    {wave.nodes.map((node) => (
                      <motion.div
                        key={node}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={isInView ? { scale: 1, opacity: 1 } : {}}
                        transition={{
                          delay: i * 0.3 + 0.2,
                          type: "spring",
                          stiffness: 300,
                        }}
                        className={`rounded-lg border border-white/[0.08] bg-zinc-800/80 px-4 py-2 text-xs font-medium text-white`}
                      >
                        <span
                          className={`mr-2 inline-block size-1.5 rounded-full ${wave.color}`}
                        />
                        {node}
                      </motion.div>
                    ))}
                  </div>
                  {wave.nodes.length > 1 && (
                    <span className="text-[10px] text-zinc-600">
                      Promise.all
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
            <p className="mt-6 text-xs text-zinc-600">
              Nodes at the same depth execute in parallel via Promise.all. Each
              step is checkpointed by Inngest for fault tolerance.
            </p>
          </div>
        </FadeIn>

        {/* Architecture stack */}
        <FadeIn delay={0.1}>
          <div className="rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-8">
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Architecture Stack
            </h3>
            <div className="flex flex-col gap-4">
              {archParts.map((part, i) => {
                const Icon = part.icon;
                return (
                  <motion.div
                    key={part.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: i * 0.15 + 0.3, duration: 0.5 }}
                    className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                  >
                    <div
                      className={`flex size-10 items-center justify-center rounded-lg bg-white/[0.05]`}
                    >
                      <Icon className={`size-5 ${part.color}`} />
                    </div>
                    <div>
                      <p className="font-medium text-white">{part.label}</p>
                      <p className="text-xs text-zinc-500">{part.desc}</p>
                    </div>
                    {/* Data packet animation */}
                    <motion.div
                      animate={isInView ? { x: [0, 60, 0] } : {}}
                      transition={{
                        delay: i * 0.4 + 1,
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                      className="ml-auto size-1.5 rounded-full bg-white/20"
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* Tech badges */}
            <div className="mt-8 flex flex-wrap gap-2">
              {[
                "Next.js 16",
                "tRPC",
                "Prisma 7",
                "Inngest",
                "Groq",
                "Upstash",
                "React 19",
              ].map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-xs text-zinc-500"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}
