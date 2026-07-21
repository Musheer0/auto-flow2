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
  [NodeType.SEND_EMAIL]: "SMTP Email",
  [NodeType.SEND_DISCORD_MESSAGE]: "Discord Webhook",
};

interface CreateCredentialDialogProps {
  type?: NodeType;
  children?: React.ReactNode;
  onCreated?: (id: string) => void;
}

export function CreateCredentialDialog({
  type,
  children,
  onCreated,
}: CreateCredentialDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [selectedType, setSelectedType] = useState<NodeType>(
    type ?? NodeType.HTTP_REQUEST,
  );
  const [data, setData] = useState("");

  const createCredential = useCreateCredential();

  // if a fixed type is passed, always use it; otherwise fall back to the picker's state
  const resolvedType = type ?? selectedType;

  const handleCreate = async () => {
    try {
      const created = await createCredential.mutateAsync({
        name: name.trim() || "untitled credential",
        type: resolvedType,
        data: data.trim(),
      });

      toast.success("Credential created");

      setName("");
      setSelectedType(type ?? NodeType.HTTP_REQUEST);
      setData("");
      setOpen(false);

      onCreated?.(created.id);
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
        {children ?? (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Credential
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Create {NODE_TYPE_LABELS[resolvedType]} Credential
          </DialogTitle>
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

          {!type && (
            <div className="space-y-2">
              <Label>Type</Label>

              <Select
                value={selectedType}
                onValueChange={(value) => {
                  if (value !== null) setSelectedType(value as NodeType);
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
          )}

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