"use client";

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

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading messages...</p>
      </div>
    );
  }

  const messages = data?.pages.flatMap((page) => page.messages) ?? [];

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">No messages yet</p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
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
    </div>
  );
}
