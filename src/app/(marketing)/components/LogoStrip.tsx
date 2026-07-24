"use client";

import { Bot, FileText, Globe, Mail, MessageSquare, Video } from "lucide-react";
import { FadeIn } from "./animations";

const integrations = [
  { name: "Telegram", icon: MessageSquare, color: "text-sky-400" },
  { name: "Discord", icon: MessageSquare, color: "text-indigo-400" },
  { name: "Gmail", icon: Mail, color: "text-red-400" },
  { name: "YouTube", icon: Video, color: "text-red-500" },
  { name: "Google Forms", icon: FileText, color: "text-green-400" },
  { name: "Groq AI", icon: Bot, color: "text-orange-400" },
  { name: "HTTP", icon: Globe, color: "text-zinc-400" },
  { name: "Webhooks", icon: Globe, color: "text-violet-400" },
];

const doubled = [...integrations, ...integrations];

export function LogoStrip() {
  return (
    <section className="relative border-y border-white/[0.04] bg-black/40 py-12">
      <FadeIn>
        <p className="mb-8 text-center text-sm text-zinc-500">
          Integrates with the tools you already use
        </p>
      </FadeIn>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-l from-black to-transparent" />
        <div className="flex w-max animate-marquee gap-12">
          {doubled.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={`${item.name}-${i}`}
                className="flex items-center gap-2.5 text-zinc-500 transition-colors hover:text-zinc-300"
              >
                <Icon className={`size-5 ${item.color}`} />
                <span className="whitespace-nowrap text-sm font-medium">
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
