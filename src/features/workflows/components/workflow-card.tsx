"use client";

import Link from "next/link";
import { Workflow as WorkflowIcon, ArrowUpRight } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

export interface WorkflowCardData {
  id: string;
  name: string;
  updated_at: string | Date;
  created_at: string | Date;
}

function formatRelativeTime(date: string | Date) {
  const value = new Date(date);
  const diffMs = value.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / 60000);

  const divisions: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 60 * 24 * 365],
    ["month", 60 * 24 * 30],
    ["week", 60 * 24 * 7],
    ["day", 60 * 24],
    ["hour", 60],
    ["minute", 1],
  ];

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const [unit, minutesInUnit] of divisions) {
    if (Math.abs(diffMinutes) >= minutesInUnit || unit === "minute") {
      return rtf.format(Math.round(diffMinutes / minutesInUnit), unit);
    }
  }

  return rtf.format(diffMinutes, "minute");
}

export function WorkflowCard({ workflow }: { workflow: WorkflowCardData }) {
  return (
    <Link
      href={`/workflows/${workflow.id}`}
      className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Card className="h-full border-border bg-card text-card-foreground transition-colors hover:border-foreground/20 hover:bg-accent/40">
        <CardHeader className="gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <WorkflowIcon className="h-4 w-4" />
            </div>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>

          <div className="space-y-1">
            <CardTitle className="line-clamp-1 text-base font-medium">
              {workflow.name || "Untitled workflow"}
            </CardTitle>
            <CardDescription>
              Created {formatRelativeTime(workflow.created_at)}
            </CardDescription>
          </div>
        </CardHeader>

        <CardFooter className="pt-0">
          <span className="text-xs text-muted-foreground">
            Updated {formatRelativeTime(workflow.updated_at)}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
