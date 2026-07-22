"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

import { useGenerateWorkflow } from "../hooks/use-generate-workflow";

interface GenerateWorkflowProps {
  id: string;
}

const GenerateWorkflow = ({ id }: GenerateWorkflowProps) => {
  const [prompt, setPrompt] = useState("");

  const { mutate, isPending } = useGenerateWorkflow(id);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error("Please describe the workflow.");
      return;
    }

    mutate(
      {
        prompt,
        workflow_id:id
      },
      {
        onSuccess: () => {
          toast.success("Workflow generated successfully.");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to generate workflow.");
        },
      }
    );
  };

  return (
    <Sheet>
      <SheetTrigger >
        <Button size="icon" variant="outline">
          <Sparkles className="size-4" />
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Generate Workflow</SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 py-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the workflow you want to build..."
            className="min-h-48 resize-none"
            disabled={isPending}
          />

          <Button
            onClick={handleGenerate}
            disabled={isPending || !prompt.trim()}
            className="w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 size-4" />
                Generate
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default GenerateWorkflow;