"use client";

import { Bot, FileText, Globe, Mail, MessageSquare, Video } from "lucide-react";
import { FadeIn, Section, SectionHeading } from "./animations";

const useCases = [
  {
    title: "Form → AI → Telegram",
    description:
      "Auto-respond to form submissions with AI-generated summaries delivered to your team chat.",
    icon: FileText,
    color: "from-violet-500 to-cyan-500",
  },
  {
    title: "YouTube → Discord",
    description:
      "Get notified in Discord whenever your favorite channels upload. AI-summarized for quick scanning.",
    icon: Video,
    color: "from-red-500 to-indigo-500",
  },
  {
    title: "API → AI → Email",
    description:
      "Monitor an API endpoint, summarize changes with AI, and email a daily digest to stakeholders.",
    icon: Globe,
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "Webhook → Multi-Channel",
    description:
      "Receive a webhook, process with AI, and fan out to Telegram, Discord, and email simultaneously.",
    icon: MessageSquare,
    color: "from-amber-500 to-orange-500",
  },
  {
    title: "Scheduled Reports",
    description:
      "Trigger workflows on a schedule via webhook. Generate and deliver automated reports with AI.",
    icon: Bot,
    color: "from-cyan-500 to-blue-500",
  },
  {
    title: "Notification Routing",
    description:
      "Route alerts to the right channel based on severity. AI classifies and dispatches automatically.",
    icon: Mail,
    color: "from-rose-500 to-pink-500",
  },
];

export function UseCases() {
  return (
    <Section>
      <SectionHeading
        badge="Use Cases"
        title="Build with AutoFlow"
        description="Real-world automations you can set up in minutes."
      />
      <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {useCases.map((uc, i) => {
          const Icon = uc.icon;
          return (
            <FadeIn key={uc.title} delay={i * 0.08}>
              <div className="group rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-6 transition-all duration-300 hover:border-white/[0.12] hover:bg-zinc-900/70 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/5">
                <div
                  className={`mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-gradient-to-br ${uc.color} shadow-lg`}
                >
                  <Icon className="size-5 text-white" />
                </div>
                <h3 className="font-semibold text-white">{uc.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {uc.description}
                </p>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </Section>
  );
}
