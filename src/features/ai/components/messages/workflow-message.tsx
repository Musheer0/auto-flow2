"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles, Workflow } from "lucide-react";

type WorkflowMessageProps = {
  content: string;
};

export function WorkflowMessage({ content }: WorkflowMessageProps) {
  return (
    <div className="flex items-start gap-2">
      <Avatar size="sm">
        <AvatarFallback className="bg-muted">
          <Sparkles className="size-3" />
        </AvatarFallback>
      </Avatar>
      <div className="max-w-[80%] rounded-2xl rounded-tl-sm border bg-card px-4 py-2.5 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Workflow className="size-4" />
          <span>{content || "Generate Workflow"}</span>
        </div>
      </div>
    </div>
  );
}
