"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useWorkflowById } from "@/features/workflows/hooks/use-workflow-byid";
import { useDeleteWorkflow } from "@/features/workflows/hooks/use-delete-workflow";
import { useUpdateWorkflow } from "@/features/workflows/hooks/use-update-workflow";

import { WorkflowDetailHeader } from "./workflow-detail-header";
import { WorkflowDetailSkeleton } from "./workflow-detail-skeleton";
import { WorkflowDetailNotFound } from "./workflow-detail-not-found";
import { WorkflowEditDialog } from "./workflow-edit-dialog";

export function WorkflowDetail({ workflowId }: { workflowId: string }) {
  const router = useRouter();
  const { data: workflow, isPending, isError } = useWorkflowById(workflowId);

  const deleteWorkflow = useDeleteWorkflow();
  const updateWorkflow = useUpdateWorkflow();

  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteWorkflow.mutateAsync({ workflow_id: workflowId });
      toast.success("Workflow deleted");
      router.push("/workflows");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete workflow",
      );
    }
  };

  const handleUpdate = async (name: string) => {
    try {
      await updateWorkflow.mutateAsync({
        workflow_id: workflowId,
        name,
      });
      toast.success("Workflow updated");
      setEditOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update workflow",
      );
    }
  };

  if (isPending) {
    return <WorkflowDetailSkeleton />;
  }

  if (isError || !workflow) {
    return <WorkflowDetailNotFound />;
  }

  return (
    <div className="flex flex-col gap-6 ">
      <WorkflowDetailHeader
        name={workflow.name}
        createdAt={workflow.created_at}
        onEdit={() => setEditOpen(true)}
        onDelete={handleDelete}
        isDeleting={deleteWorkflow.isPending}
      />


      <WorkflowEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        name={workflow.name}
        onSave={handleUpdate}
        isPending={updateWorkflow.isPending}
      />
    </div>
  );
}
