"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { NodeType } from "@/generated/prisma/enums";

import { useCreateCredential } from "@/features/credentials/hooks/use-create-credential";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

const NODE_TYPE_LABELS: Record<NodeType, string> = {
  [NodeType.MANUAL_TRIGGER]: "Manual Trigger",
  [NodeType.WEBHOOK]: "Webhook",
  [NodeType.HTTP_REQUEST]: "HTTP Request",
  [NodeType.SEND_TELEGRAM_MESSAGE]: "Telegram Message",
};

export function CreateCredentialDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<NodeType>(NodeType.HTTP_REQUEST);
  const [data, setData] = useState("");

  const createCredential = useCreateCredential();

  const handleCreate = async () => {
    try {
      await createCredential.mutateAsync({
        name: name.trim() || "untitled credential",
        type,
        data: data.trim(),
      });

      toast.success("Credential created");

      setName("");
      setType(NodeType.HTTP_REQUEST);
      setData("");
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create credential",
      );
    }
  };

  const canSubmit = data.trim().length > 0 && !createCredential.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!createCredential.isPending) {
          setOpen(value);
        }
      }}
    >
      <DialogTrigger>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Credential
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Credential</DialogTitle>
          <DialogDescription>
            Add an API key, token, or other secret to use in your workflows.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="credential-name">Name</Label>

            <Input
              id="credential-name"
              placeholder="My API key"
              value={name}
              disabled={createCredential.isPending}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canSubmit) {
                  handleCreate();
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
              disabled={createCredential.isPending}
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
            <Label htmlFor="credential-data">Secret</Label>

            <Input
              id="credential-data"
              type="password"
              placeholder="sk-..."
              value={data}
              disabled={createCredential.isPending}
              onChange={(e) => setData(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canSubmit) {
                  handleCreate();
                }
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleCreate} disabled={!canSubmit}>
            {createCredential.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
