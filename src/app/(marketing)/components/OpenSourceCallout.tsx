"use client";

import { useInView } from "framer-motion";
import { Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FadeIn, Section } from "./animations";

const installLines = [
  "$ git clone https://github.com/Musheer0/auto-flow2.git.git",
  "$ cd auto-flow",
  "$ npm install",
  "$ npx prisma migrate dev",
  "$ npm run dev",
];

function TerminalTyping() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [visibleLines, setVisibleLines] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    if (currentLine >= installLines.length) return;

    const line = installLines[currentLine];
    if (currentChar < line.length) {
      const timer = setTimeout(
        () => {
          setCurrentChar((c) => c + 1);
        },
        25 + Math.random() * 25,
      );
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      setVisibleLines((v) => v + 1);
      setCurrentLine((l) => l + 1);
      setCurrentChar(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [isInView, currentChar, currentLine]);

  return (
    <div
      ref={ref}
      className="rounded-xl border border-white/[0.08] bg-zinc-950 p-5 font-mono text-sm"
    >
      {installLines.map((line, i) => (
        <div key={`install-${i}`} className="flex gap-2">
          {i < visibleLines ? (
            <span className="text-emerald-400">{line}</span>
          ) : i === visibleLines ? (
            <span className="text-emerald-400">
              {line.slice(0, currentChar)}
              <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-emerald-400" />
            </span>
          ) : null}
        </div>
      ))}
      {visibleLines >= installLines.length && (
        <div className="mt-2 text-zinc-500">
          Ready! Visit http://localhost:3000
        </div>
      )}
    </div>
  );
}

export function OpenSourceCallout() {
  return (
    <Section>
      <div className="mx-auto max-w-4xl">
        <FadeIn>
          <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-zinc-900/60 to-transparent p-8 md:p-12">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  Open Source
                </span>
                <h2 className="mt-4 text-3xl font-bold text-white">
                  Free forever.
                  <br />
                  Fork it. Ship it.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                  AutoFlow is fully open source. Self-host it, modify it, deploy
                  it anywhere. No usage limits, no vendor lock-in.
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <Link
                    href="https://github.com/Musheer0/auto-flow2.git"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:from-violet-500 hover:to-cyan-400">
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
                      Star on GitHub
                    </Button>
                  </Link>
                  <span className="flex items-center gap-1.5 text-sm text-zinc-500">
                    <Star className="size-4" />
                    <CountUp target={247} />
                  </span>
                </div>
              </div>
              <TerminalTyping />
            </div>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}

function CountUp({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    if (count >= target) return;
    const timer = setTimeout(() => setCount((c) => c + 1), 10);
    return () => clearTimeout(timer);
  }, [isInView, count, target]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}
