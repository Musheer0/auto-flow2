"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles } from "lucide-react";

type AIMessageProps = {
  content: string;
};

export function AIMessage({ content }: AIMessageProps) {
  return (
    <div className="flex items-start gap-2">
      <Avatar size="sm">
        <AvatarFallback className="bg-muted">
          <Sparkles className="size-3" />
        </AvatarFallback>
      </Avatar>
      <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-muted px-4 py-2.5 text-sm">
        <p className="whitespace-pre-wrap break-words">{content}</p>
      </div>
    </div>
  );
}
