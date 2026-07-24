"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { nodesUi } from "@/features/editor/config/nodes-ui";
import { NodeAction, NodeType } from "@/generated/prisma/enums";
import { FadeIn, Section, SectionHeading } from "./animations";

type FilterType = "all" | "trigger" | "action";

const nodeEntries = Object.entries(nodesUi).map(([type, ui]) => ({
  type: type as NodeType,
  name: ui.name,
  description: ui.description,
  icon: ui.icon,
  category: (ui.type === NodeAction.TRIGGER ? "trigger" : "action") as FilterType,
  color:
    ui.type === NodeAction.TRIGGER
      ? "border-orange-500/30 bg-orange-500/5"
      : "border-violet-500/30 bg-violet-500/5",
  fields: getNodeFields(type as NodeType),
}));

function getNodeFields(type: NodeType): string[] {
  switch (type) {
    case NodeType.WEBHOOK:
      return ["webhook_secret"];
    case NodeType.PUBSUBHUBBUB:
      return ["channel_id", "verify_secret"];
    case NodeType.HTTP_REQUEST:
      return ["url", "method", "headers", "body"];
    case NodeType.SEND_EMAIL:
      return ["to", "subject", "body"];
    case NodeType.SEND_TELEGRAM_MESSAGE:
      return ["chat_id", "message"];
    case NodeType.SEND_DISCORD_MESSAGE:
      return ["message"];
    case NodeType.GROQ_AI:
      return ["model", "system_prompt", "user_prompt"];
    default:
      return [];
  }
}

function NodeIcon({
  icon,
  className,
}: {
  icon: (typeof nodesUi)[NodeType]["icon"];
  className?: string;
}) {
  if (typeof icon === "string") {
    return <Image src={icon} alt="" width={20} height={20} className={className} />;
  }
  const Icon = icon;
  return <Icon className={className} />;
}

const filters: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Triggers", value: "trigger" },
  { label: "Actions", value: "action" },
];

export function NodeExplorer() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [flipped, setFlipped] = useState<string | null>(null);

  const filtered =
    activeFilter === "all"
      ? nodeEntries
      : nodeEntries.filter((n) => n.category === activeFilter);

  return (
    <Section id="nodes">
      <SectionHeading
        badge="Node Library"
        title="Composable building blocks"
        description="Each node is a self-contained unit. Connect them to build powerful automations."
      />

      {/* Filter pills */}
      <FadeIn delay={0.1} className="mx-auto mt-10 flex max-w-md justify-center">
        <div className="flex gap-1 rounded-xl border border-white/[0.06] bg-zinc-900/60 p-1">
          {filters.map((f) => (
            <button
              type="button"
              key={f.value}
              onClick={() => {
                setActiveFilter(f.value);
                setFlipped(null);
              }}
              className={`relative rounded-lg px-5 py-2 text-sm font-medium transition-colors ${
                activeFilter === f.value
                  ? "text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {f.label}
              {activeFilter === f.value && (
                <motion.div
                  layoutId="activeNodeFilter"
                  className="absolute inset-0 rounded-lg bg-white/[0.06]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Node grid */}
      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((node, i) => {
            const isFlipped = flipped === node.type;

            return (
              <motion.div
                key={node.type}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                className="cursor-pointer [perspective:800px]"
                onClick={() => setFlipped(isFlipped ? null : node.type)}
              >
                <div
                  className={`relative h-48 transition-transform duration-500 [transform-style:preserve-3d] ${
                    isFlipped ? "[transform:rotateY(180deg)]" : ""
                  }`}
                >
                  {/* Front */}
                  <div
                    className={`absolute inset-0 rounded-2xl border p-6 [backface-visibility:hidden] ${node.color} transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/5 hover:-translate-y-1`}
                  >
                    <div
                      className={`mb-3 inline-flex size-10 items-center justify-center rounded-lg ${
                        node.category === "trigger"
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-violet-500/20 text-violet-400"
                      }`}
                    >
                      <NodeIcon icon={node.icon} className="size-5" />
                    </div>
                    <h3 className="font-semibold text-white">{node.name}</h3>
                    <p className="mt-1 text-sm text-zinc-400">{node.description}</p>
                    <span
                      className={`mt-3 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        node.category === "trigger"
                          ? "bg-orange-500/10 text-orange-400"
                          : "bg-violet-500/10 text-violet-400"
                      }`}
                    >
                      {node.category}
                    </span>
                  </div>

                  {/* Back */}
                  <div className="absolute inset-0 rotate-y-180 rounded-2xl border border-white/[0.08] bg-zinc-900 p-6 [backface-visibility:hidden]">
                    <h4 className="mb-3 text-sm font-semibold text-white">
                      Config Fields
                    </h4>
                    {node.fields.length === 0 ? (
                      <p className="text-xs text-zinc-500">
                        No additional configuration required
                      </p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {node.fields.map((field) => (
                          <div
                            key={field}
                            className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2"
                          >
                            <span className="h-1 w-1 rounded-full bg-zinc-600" />
                            <code className="text-xs text-zinc-400">{field}</code>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="mt-4 text-xs text-zinc-600">Click to flip back</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Section>
  );
}
