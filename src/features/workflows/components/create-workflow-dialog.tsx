"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { useCreateWorkflow } from "@/features/workflows/hooks/use-create-workflow";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateWorkflowDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const createWorkflow = useCreateWorkflow();

  const handleCreate = async () => {
    try {
      await createWorkflow.mutateAsync({
        name: name.trim() || undefined,
      });

      toast.success("Workflow created");

      setName("");
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create workflow",
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!createWorkflow.isPending) {
          setOpen(value);
        }
      }}
    >
      <DialogTrigger >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Workflow
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-md"
       
      >
        <DialogHeader>
          <DialogTitle>Create Workflow</DialogTitle>
          <DialogDescription>
            Give your workflow a name now, or leave it empty and rename it
            later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="workflow-name">Name (optional)</Label>

          <Input
            id="workflow-name"
            placeholder="My awesome workflow"
            value={name}
            disabled={createWorkflow.isPending}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !createWorkflow.isPending
              ) {
                handleCreate();
              }
            }}
          />
        </div>

        <DialogFooter>
          <Button
            onClick={handleCreate}
            disabled={createWorkflow.isPending}
          >
            {createWorkflow.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}