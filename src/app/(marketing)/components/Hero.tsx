"use client";

import {
  Background,
  type Edge,
  Handle,
  type Node,
  type NodeTypes,
  Position,
  ReactFlow,
} from "@xyflow/react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { nodesUi } from "@/features/editor/config/nodes-ui";
import { NodeType } from "@/generated/prisma/enums";
import Aurora from "@/components/Aurora";
import { FadeIn } from "./animations";
import { NodeTypes as NT } from "@/features/editor/config/node-types";

function NodeIcon({ type }: { type: NodeType }) {
  const ui = nodesUi[type];
  if (!ui) return null;
  if (typeof ui.icon === "string") {
    return (
      <Image
        src={ui.icon}
        alt={ui.name}
        width={20}
        height={20}
        className="object-contain"
      />
    );
  }
  const Icon = ui.icon;
  return <Icon className="size-5" />;
}

function DemoNode({ data }: { data: { label: string; nodeType: NodeType } }) {
  const ui = nodesUi[data.nodeType];
  const isTrigger = ui?.type === "TRIGGER";
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/[0.1] bg-zinc-900 px-3 py-2 shadow-lg">
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-transparent !border-0"
      />
      <div
        className={`flex size-7 items-center justify-center rounded-md ${
          isTrigger
            ? "bg-orange-500/20 text-orange-400"
            : "bg-violet-500/20 text-violet-400"
        }`}
      >
        <NodeIcon type={data.nodeType} />
      </div>
      <span className="whitespace-nowrap text-xs font-medium text-zinc-300">
        {data.label}
      </span>
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-transparent !border-0"
      />
    </div>
  );
}

const heroNodeTypes: NodeTypes = {
  hero: DemoNode,
};

const DEMO_NODES: Node[] = [
  {
    id: "webhook",
    type: NodeType.WEBHOOK,
    position: { x: 20, y: 110 },
    data: { label: "Webhook", nodeType: NodeType.WEBHOOK },
  },
  {
    id: "http",
    type: NodeType.HTTP_REQUEST,
    position: { x: 240, y: 50 },
    data: { label: "HTTP Request", nodeType: NodeType.HTTP_REQUEST },
  },
  {
    id: "groq",
    type: NodeType.GROQ_AI,
    position: { x: 460, y: 110 },
    data: { label: "Groq AI", nodeType: NodeType.GROQ_AI },
  },
  {
    id: "telegram",
    type: NodeType.SEND_TELEGRAM_MESSAGE,
    position: { x: 680, y: 40 },
    data: { label: "Telegram", nodeType: NodeType.SEND_TELEGRAM_MESSAGE },
  },
  {
    id: "discord",
    type: NodeType.SEND_DISCORD_MESSAGE,
    position: { x: 680, y: 180 },
    data: { label: "Discord", nodeType: NodeType.SEND_DISCORD_MESSAGE },
  },
];

const DEMO_EDGES: Edge[] = [
  { id: "e1", source: "webhook", target: "http", type: "default", animated: true ,sourceHandle:"", targetHandle:""},
  { id: "e2", source: "http", target: "groq", type: "default", animated: true ,sourceHandle:"", targetHandle:""},
  { id: "e3", source: "groq", target: "telegram", type: "default", animated: true ,sourceHandle:"", targetHandle:""},
  { id: "e4", source: "groq", target: "discord", type: "default", animated: true,sourceHandle:"", targetHandle:"" },
];

const TYPING_PROMPT =
  "When a form is submitted, summarize it with AI and send to Telegram and Discord...";

function TypingBubble() {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < TYPING_PROMPT.length) {
        setText(TYPING_PROMPT.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="absolute -top-16 left-8 z-10 max-w-sm"
    >
      <div className="rounded-xl border border-white/[0.08] bg-zinc-900/90 px-4 py-2.5 text-sm text-zinc-300 shadow-xl backdrop-blur-sm">
        <span className="mr-1.5 inline-block size-2 rounded-full bg-violet-400" />
        {text}
        {!done && (
          <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-violet-400" />
        )}
      </div>
      <div className="absolute -bottom-1.5 left-6 h-3 w-3 rotate-45 border-b border-r border-white/[0.08] bg-zinc-900/90" />
    </motion.div>
  );
}

export function Hero() {
  const [showNodes, setShowNodes] = useState(false);
  const [showEdges, setShowEdges] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    const bubbleTimer = setTimeout(() => setShowBubble(true), 600);
    const nodeTimer = setTimeout(() => setShowNodes(true), 2800);
    const edgeTimer = setTimeout(() => setShowEdges(true), 3600);
    return () => {
      clearTimeout(bubbleTimer);
      clearTimeout(nodeTimer);
      clearTimeout(edgeTimer);
    };
  }, []);

  const visibleNodes = useMemo(
    () => (showNodes ? DEMO_NODES : []),
    [showNodes],
  );
  const visibleEdges = useMemo(
    () => (showEdges ? DEMO_EDGES : []),
    [showEdges],
  );

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-16">
      {/* Aurora background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Aurora colorStops={["#1a2b6b", "#3a5ba0", "#1a2b6b"]} amplitude={1} blend={0.5} />
      </div>
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <FadeIn delay={0}>
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-300">
            <span className="size-1.5 rounded-full bg-violet-400 animate-pulse" />
            Open Source &middot; Self-Hosted
          </span>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Automate anything.
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Describe it in plain English.
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Self-hosted workflow automation with an AI copilot that builds your
            flows for you. No vendor lock-in. Your data stays on your servers.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button
                size="lg"
                className="group relative overflow-hidden border-0 bg-gradient-to-r from-violet-600 to-cyan-500 px-8 text-base text-white hover:from-violet-500 hover:to-cyan-400"
              >
                Start Building Free
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link
              href="https://github.com/Musheer0/auto-flow2.git"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="lg"
                className="border-white/[0.1] bg-white/[0.03] px-8 text-base text-zinc-300 hover:border-white/[0.2] hover:bg-white/[0.06]"
              >
                <svg
                  className="mr-2 size-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                View on GitHub
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>

      {/* Live React Flow demo */}
      <FadeIn
        delay={0.5}
        y={24}
        className="relative z-10 mt-20 w-full max-w-4xl px-6"
      >
        <div className="relative rounded-2xl border border-white/[0.08] bg-zinc-950/80 shadow-2xl shadow-violet-500/5 backdrop-blur-sm">
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
            <span className="size-3 rounded-full bg-red-500/70" />
            <span className="size-3 rounded-full bg-yellow-500/70" />
            <span className="size-3 rounded-full bg-green-500/70" />
            <span className="ml-3 text-xs text-zinc-500">workflow-editor</span>
          </div>
          <div className="relative h-[320px]">
            <AnimatePresence>{showBubble && <TypingBubble />}</AnimatePresence>
            <ReactFlow
              nodes={visibleNodes}
              edges={visibleEdges}
              nodeTypes={NT}
              fitView
              proOptions={{ hideAttribution: true }}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
              zoomOnScroll={false}
              zoomOnPinch={false}
              panOnDrag={false}
              className="pointer-events-none"
            >
              <Background color="#ffffff08" gap={40} size={1} />
            </ReactFlow>
          </div>
        </div>
      </FadeIn>

      {/* Trust badges */}
      <FadeIn
        delay={0.7}
        className="relative z-10 mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500"
      >
        <span className="flex items-center gap-1.5">
          <span className="size-1 rounded-full bg-emerald-500" />
          Self-hosted
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-1 rounded-full bg-violet-500" />
          Open Source
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-1 rounded-full bg-cyan-500" />
          Bring your own Groq key
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-1 rounded-full bg-amber-500" />
          No vendor lock-in
        </span>
      </FadeIn>
    </section>
  );
}
