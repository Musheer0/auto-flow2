"use client";

import React from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { NodeType } from "@/generated/prisma/enums";

import { useEditorStore } from "../store/editor.store";
import useTriggerWorkflow from "../hooks/use-trigger-workflow";

const StartWorkflowManually = () => {
  const { nodes } = useEditorStore();
  const { id } = useParams<{ id: string }>();

  const { mutateAsync, isPending } = useTriggerWorkflow();

  const triggerNode = nodes.find(
    (node) => node.type === NodeType.MANUAL_TRIGGER
  );

  const handleClick = async () => {
    if (!triggerNode) {
      toast.error("No manual trigger node found.");
      return;
    }

    await toast.promise(
      mutateAsync({
        workflowId: id,
        triggerNodeId: triggerNode.id,
      }),
      {
        loading: "Starting workflow...",
        success: "Workflow execution started successfully.",
        error: (err) =>
          err instanceof Error ? err.message : "Failed to start workflow.",
      }
    );
  };
if(triggerNode)
  return (
    <Button onClick={handleClick} disabled={isPending}>
      {isPending ? "Starting..." : "Start Execution"}
    </Button>
  );
};

export default StartWorkflowManually;