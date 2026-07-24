import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "AutoFlow — AI-Powered Workflow Automation",
  description:
    "Self-hosted workflow automation with an AI copilot that builds your flows for you. Describe what you want in plain English and watch it come to life.",
};

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
