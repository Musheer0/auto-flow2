"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowUp, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useSendMessage } from "../hooks/use-send-message";

const AIMessageInput = () => {
  const [prompt, setPrompt] = useState("");
   const [last_summary, setLastSummary] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { id } = useParams<{ id: string }>();

  const { mutate, isPending } = useSendMessage();

 useEffect(() => {
  const textarea = textareaRef.current;
  if (!textarea) return;

  textarea.style.height = "0px";

  const scrollHeight = textarea.scrollHeight;

  textarea.style.height = `${Math.min(scrollHeight, 200)}px`;
  textarea.style.overflowY = scrollHeight > 200 ? "auto" : "hidden";
}, [prompt]);
  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error("Please describe the workflow.");
      return;
    }

    mutate(
      {
        content:prompt,
        workflow_id: id,
        prev_summary:last_summary
      },
      {
        onSuccess: (data) => {
          setLastSummary(data.messages.find((m)=>m.type=="AI")?.content||"")
          toast.success("Workflow generated successfully.");
          setPrompt("");
          
          requestAnimationFrame(() => {
            if (textareaRef.current) {
              textareaRef.current.style.height = "44px";
            }
          });
        },
        onError: (error) => {
          toast.error(error.message || "Failed to generate workflow.");
        },
      }
    );
  };

  return (
    <div className="border-t w-full p-3">
      <div className="relative rounded-2xl w-full border  bg-background">
        <Textarea
          ref={textareaRef}
          rows={1}
          value={prompt}
          disabled={isPending}
          placeholder="Describe the workflow you want to build..."
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleGenerate();
            }
          }}
          className="min-h-11 max-h-[200px] w-full resize-none rounded-2xl  border-0 bg-transparent pr-14 shadow-none focus-visible:ring-0"
        />

        <Button
          size="icon"
          onClick={handleGenerate}
          disabled={isPending || !prompt.trim()}
          className="absolute bottom-2 right-2 rounded-full"
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ArrowUp className="size-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default AIMessageInput;