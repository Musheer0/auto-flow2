"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FadeIn, Section, SectionHeading } from "./animations";

const tabs = [
  {
    id: "editor",
    label: "Editor",
    description: "Visual workflow canvas with drag-and-drop node placement",
  },
  {
    id: "ai-chat",
    label: "AI Chat",
    description: "Natural language workflow generation sidebar",
  },
  {
    id: "credentials",
    label: "Credentials",
    description: "Encrypted API key and token management",
  },
  {
    id: "executions",
    label: "Executions",
    description: "Workflow run history and status tracking",
  },
];

export function ProductShowcase() {
  const [activeTab, setActiveTab] = useState("editor");

  return (
    <Section>
      <SectionHeading
        badge="Product"
        title="See it in action"
        description="A modern, dark-mode-first interface designed for developers and automation engineers."
      />
      <FadeIn delay={0.2} y={24} className="mx-auto mt-16 max-w-5xl">
                                         <img src="/screenshots/editor.png" alt="" />

      </FadeIn>
    </Section>
  );
}
