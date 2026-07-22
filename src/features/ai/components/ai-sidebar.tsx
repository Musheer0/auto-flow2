"use client";

import { cn } from "@/lib/utils";
import { useAISidebar } from "@/features/ai/components/ai-sidebar-provider";
import AIMessageInput from "./ai-message-input";
import { MessageList } from "./message-list";
import { useParams } from "next/navigation";

export function AISidebar() {
  const { open } = useAISidebar();
  const { id } = useParams<{ id: string }>();

  return (
    <aside
      className={cn(
        "h-full w-[300px] shrink-0 border-l bg-background flex flex-col transition-all duration-300 ease-in-out",
        open ? "flex " : "hidden"
      )}
    >
     <div className="messages w-full flex-1   overflow-y-auto flex flex-col">
       <MessageList workflowId={id} />
     </div>
      <AIMessageInput/>
    </aside>
  );
}