"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WorkflowEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onSave: (name: string) => Promise<void>;
  isPending: boolean;
}

export function WorkflowEditDialog({
  open,
  onOpenChange,
  name,
  onSave,
  isPending,
}: WorkflowEditDialogProps) {
  const [editName, setEditName] = useState(name);

  const handleSave = async () => {
    await onSave(editName.trim() || "Untitled workflow");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!isPending) onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Workflow</DialogTitle>
          <DialogDescription>Update the workflow name.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <Label htmlFor="edit-workflow-name">Name</Label>
          <Input
            id="edit-workflow-name"
            placeholder="Workflow name"
            value={editName}
            disabled={isPending}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isPending) {
                handleSave();
              }
            }}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
