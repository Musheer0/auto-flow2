"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MenuIcon, Workflow, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Nodes", href: "#nodes" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "/docs" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/[0.06] bg-black/60 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500">
            <Workflow className="size-4 text-white" />
            <span className="absolute inset-0 animate-pulse rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 opacity-40 blur-md" />
          </span>
          <span className="text-lg font-bold tracking-tight text-white">
            Auto<span className="text-violet-400">Flow</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-zinc-400 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="https://github.com/Musheer0/auto-flow2"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md px-3 py-2 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            GitHub
          </Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-white"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="sm"
              className="relative overflow-hidden border-0 bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:from-violet-500 hover:to-cyan-400"
            >
              Get Started
            </Button>
          </Link>
        </div>

        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-md text-zinc-400 hover:text-white md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <XIcon className="size-5" />
          ) : (
            <MenuIcon className="size-5" />
          )}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-white/[0.06] bg-black/90 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="block rounded-md px-3 py-2.5 text-sm text-zinc-400 transition-colors hover:text-white"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
                className="mt-2 flex flex-col gap-2 border-t border-white/[0.06] pt-3"
              >
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-zinc-400"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button
                    size="sm"
                    className="w-full justify-start bg-gradient-to-r from-violet-600 to-cyan-500 text-white"
                  >
                    Get Started
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
