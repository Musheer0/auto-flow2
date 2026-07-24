"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn, Section } from "./animations";

export function FinalCTA() {
  return (
    <Section>
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/[0.06]">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-cyan-500/10 to-violet-600/20" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 0.5px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 px-8 py-20 text-center md:px-16">
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Start building smarter workflows
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                today.
              </span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="mx-auto mt-6 max-w-lg text-lg text-zinc-400">
              Free and open source. Self-host in minutes or start with AI
              credits.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/login">
                <Button
                  size="lg"
                  className="group relative overflow-hidden border-0 bg-gradient-to-r from-violet-600 to-cyan-500 px-10 text-base text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-cyan-400"
                >
                  Get Started Free
                  <span className="absolute inset-0 rounded-[inherit] shadow-[0_0_24px_rgba(139,92,246,0.3)] opacity-0 transition-opacity group-hover:opacity-100" />
                </Button>
              </Link>
              <Link
                href="https://github.com/Musheer0/auto-flow2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/[0.1] bg-white/[0.03] px-10 text-base text-zinc-300 hover:border-white/[0.2] hover:bg-white/[0.06]"
                >
                  View Docs
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </Section>
  );
}
