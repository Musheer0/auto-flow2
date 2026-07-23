"use client";

import { useEffect, useRef, useState } from "react";
import { MessageType } from "@/generated/prisma/enums";
import { useMessagesInfinite } from "@/features/ai/hooks/use-messages-infinite";
import { UserMessage } from "./messages/user-message";
import { AIMessage } from "./messages/ai-message";
import { WorkflowMessage } from "./messages/workflow-message";

type MessageListProps = {
  workflowId: string;
};

export function MessageList({ workflowId }: MessageListProps) {
  const { data, isLoading } = useMessagesInfinite(workflowId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const prevMessageIdsRef = useRef<Set<string>>(new Set());

  const messages = data?.pages.flatMap((page) => page.messages) ?? [];

  useEffect(() => {
    if (!scrollRef.current) return;

    const el = scrollRef.current;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const threshold = 100;

    setIsAtBottom(distanceFromBottom <= threshold);
  }, []);

  useEffect(() => {
    if (!scrollRef.current || messages.length === 0) return;

    const currentIds = new Set(messages.map((m) => m.id));
    const hasNewMessages = currentIds.size > prevMessageIdsRef.current.size;

    prevMessageIdsRef.current = currentIds;

    if (hasNewMessages && isAtBottom) {
      requestAnimationFrame(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [messages, isAtBottom]);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
    setIsAtBottom(true);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;

    const el = scrollRef.current;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const threshold = 100;

    setIsAtBottom(distanceFromBottom <= threshold);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading messages...</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">No messages yet</p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 relative">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message) => {
          switch (message.type) {
            case MessageType.USER:
              return <UserMessage key={message.id} content={message.content} />;
            case MessageType.AI:
              return <AIMessage key={message.id} content={message.content} />;
            case MessageType.WORKFLOW:
              return (
                <WorkflowMessage
                  key={message.id}
                  content={message.content}
                />
              );
            default:
              return null;
          }
        })}
        <div ref={endRef} />
      </div>

      {!isAtBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors px-3 py-2 text-sm font-medium"
        >
          ↓ Scroll to bottom
        </button>
      )}
    </div>
  );
}
