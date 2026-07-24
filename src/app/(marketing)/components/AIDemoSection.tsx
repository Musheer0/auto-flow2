"use client";

import { motion } from "framer-motion";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { useState } from "react";
import { FadeIn, Section, SectionHeading } from "./animations";

const DEMO_MESSAGES = [
  {
    role: "user" as const,
    text: "Create a workflow that receives webhook data, summarizes it with AI, and sends the summary to Telegram",
  },
  {
    role: "ai" as const,
    text: "I've generated a 4-node workflow:\n\n1. **Webhook Trigger** — receives incoming POST data\n2. **HTTP Request** — fetches additional context\n3. **Groq AI** — summarizes the combined data\n4. **Send Telegram** — delivers the summary\n\nThe nodes are connected and ready to run!",
  },
];

const CODE_SNIPPET = `{
  "nodes": [
    { "id": "n1", "type": "WEBHOOK", "position": { "x": 40, "y": 120 } },
    { "id": "n2", "type": "HTTP_REQUEST", "position": { "x": 280, "y": 120 } },
    { "id": "n3", "type": "GROQ_AI", "position": { "x": 520, "y": 120 } },
    { "id": "n4", "type": "SEND_TELEGRAM_MESSAGE", "position": { "x": 760, "y": 120 } }
  ],
  "edges": [
    { "id": "e1", "source": "n1", "target": "n2" },
    { "id": "e2", "source": "n2", "target": "n3" },
    { "id": "e3", "source": "n3", "target": "n4" }
  ]
}`;

export function AIDemoSection() {
  const [showCode, setShowCode] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState(DEMO_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: inputValue }]);
    setInputValue("");
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "I've analyzed your request and generated a workflow with the appropriate nodes and connections. Check the editor canvas to see your new workflow!",
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <Section id="ai-generation">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          badge="AI Copilot"
          title="Describe it. Watch it build."
          description="Our AI understands workflow topology, node configurations, and data flow. Just tell it what you want."
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-2 lg:items-start">
          {/* Copy side */}
          <div className="flex flex-col gap-6">
            <FadeIn delay={0.1}>
              <div className="rounded-xl border border-white/[0.06] bg-zinc-900/50 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  Natural Language Generation
                </h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  Type what you want in plain English. The AI understands node
                  types, connections, data flow, and configuration. It generates
                  valid workflows every time.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="rounded-xl border border-white/[0.06] bg-zinc-900/50 p-6">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  Structured Output
                </h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  The AI returns validated Zod schemas — nodes, edges, and
                  configuration — that map directly to your workflow graph. No
                  hallucinated connections.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="flex items-center gap-3 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                <Sparkles className="size-5 shrink-0 text-violet-400" />
                <span className="text-sm text-violet-300">
                  Powered by Groq &middot; gpt-oss-120b
                </span>
              </div>
            </FadeIn>
          </div>

          {/* Interactive demo side */}
          <FadeIn delay={0.2}>
            <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/80 shadow-2xl shadow-violet-500/5 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-red-500/70" />
                  <span className="size-3 rounded-full bg-yellow-500/70" />
                  <span className="size-3 rounded-full bg-green-500/70" />
                  <span className="ml-3 text-xs text-zinc-500">AI Chat</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="rounded-md px-3 py-1 text-xs text-zinc-500 transition-colors hover:bg-white/[0.05] hover:text-zinc-300"
                >
                  {showCode ? "Chat" : "View Output"}
                </button>
              </div>

              {showCode ? (
                <div className="h-[400px] overflow-auto p-4">
                  <pre className="text-xs leading-relaxed text-zinc-400">
                    <code>{CODE_SNIPPET}</code>
                  </pre>
                </div>
              ) : (
                <div className="flex h-[400px] flex-col">
                  <div className="flex-1 overflow-auto p-4">
                    <div className="flex flex-col gap-4">
                      {messages.map((msg, i) => (
                        <motion.div
                          key={`msg-${msg.role}-${i}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
                        >
                          {msg.role === "ai" && (
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-cyan-500">
                              <Bot className="size-3.5 text-white" />
                            </div>
                          )}
                          <div
                            className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                              msg.role === "user"
                                ? "bg-violet-600 text-white"
                                : "border border-white/[0.06] bg-zinc-900 text-zinc-300"
                            }`}
                          >
                            {msg.text}
                          </div>
                          {msg.role === "user" && (
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-zinc-800">
                              <User className="size-3.5 text-zinc-400" />
                            </div>
                          )}
                        </motion.div>
                      ))}
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex gap-3"
                        >
                          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-cyan-500">
                            <Bot className="size-3.5 text-white" />
                          </div>
                          <div className="rounded-xl border border-white/[0.06] bg-zinc-900 px-4 py-3">
                            <div className="flex gap-1">
                              <span className="size-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:0ms]" />
                              <span className="size-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:150ms]" />
                              <span className="size-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:300ms]" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <div className="border-t border-white/[0.06] p-3">
                    <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-zinc-900 px-3 py-2">
                      <input
                        type="text"
                        placeholder="Describe your workflow..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="flex size-8 items-center justify-center rounded-lg bg-violet-600 text-white transition-colors hover:bg-violet-500"
                      >
                        <Send className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </Section>
  );
}
