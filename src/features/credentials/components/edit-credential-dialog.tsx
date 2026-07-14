"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { NodeType } from "@/generated/prisma/enums";

import { useUpdateCredential } from "@/features/credentials/hooks/use-update-credential";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CredentialListItem } from "@/features/credentials/types";

const NODE_TYPE_LABELS: Record<NodeType, string> = {
  [NodeType.MANUAL_TRIGGER]: "Manual Trigger",
  [NodeType.WEBHOOK]: "Webhook",
  [NodeType.HTTP_REQUEST]: "HTTP Request",
  [NodeType.SEND_TELEGRAM_MESSAGE]: "Telegram Message",
};

interface EditCredentialDialogProps {
  credential: CredentialListItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCredentialDialog({
  credential,
  open,
  onOpenChange,
}: EditCredentialDialogProps) {
  const [name, setName] = useState(credential.name);
  const [type, setType] = useState<NodeType>(credential.type);
  const [data, setData] = useState("");

  const updateCredential = useUpdateCredential();

  const handleUpdate = async () => {
    try {
      await updateCredential.mutateAsync({
        credential_id: credential.id,
        name: name.trim() || "untitled credential",
        type,
        data: data.trim(),
      });

      toast.success("Credential updated");
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update credential",
      );
    }
  };

  const canSubmit = data.trim().length > 0 && !updateCredential.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!updateCredential.isPending) {
          onOpenChange(value);
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Credential</DialogTitle>
          <DialogDescription>
            Update the details for &ldquo;{credential.name}&rdquo;.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="edit-credential-name">Name</Label>

            <Input
              id="edit-credential-name"
              placeholder="My API key"
              value={name}
              disabled={updateCredential.isPending}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canSubmit) {
                  handleUpdate();
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Type</Label>

            <Select
              value={type}
              onValueChange={(value) => {
                if (value !== null) setType(value as NodeType);
              }}
              disabled={updateCredential.isPending}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {Object.values(NodeType).map((nodeType) => (
                  <SelectItem key={nodeType} value={nodeType}>
                    {NODE_TYPE_LABELS[nodeType]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-credential-data">Secret</Label>

            <Input
              id="edit-credential-data"
              type="password"
              placeholder="Enter new secret value"
              value={data}
              disabled={updateCredential.isPending}
              onChange={(e) => setData(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canSubmit) {
                  handleUpdate();
                }
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleUpdate} disabled={!canSubmit}>
            {updateCredential.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
