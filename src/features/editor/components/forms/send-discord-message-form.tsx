"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { NodeProps } from "@xyflow/react";
import { InfoIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SelectCredentials from "@/features/credentials/components/select-credential";
import { sendDiscordMessageSchema } from "@/features/editor/schemas/send-discord-message.schema";
import { useEditorStore } from "@/features/editor/store/editor.store";
import type { NodeData } from "@/features/editor/types";

const schema = z
  .object({
    name: z.string().trim().min(1, "Node name is required"),
  })
  .merge(sendDiscordMessageSchema);

type FormValues = z.infer<typeof schema>;

const SendDiscordMessageForm = (
  props: NodeProps & { children: React.ReactNode },
) => {
  const [open, setOpen] = useState(false);
  const node = props.data as NodeData<z.infer<typeof sendDiscordMessageSchema>>;
  const { updateNode } = useEditorStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: node?.config?.name ?? "",
      webhook_credential_id: node?.user_data?.webhook_credential_id ?? "",
      message: node?.user_data?.message ?? "",
    },
  });

  const onSubmit = (values: FormValues) => {
    updateNode(props.id, (n) => ({
      ...n,
      data: {
        config: {
          name: values.name,
        },
        user_data: {
          webhook_credential_id: values.webhook_credential_id,
          message: values.message,
        },
      },
    }));

    toast.success("Send Discord message saved");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{props.children}</DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Send Discord Message</DialogTitle>
          <DialogDescription>
            Send a message to a Discord channel via webhook.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label>Node name</Label>
            <Input
              placeholder="e.g. Notify Discord"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <SelectCredentials
              type="SEND_DISCORD_MESSAGE"
              currentId={form.getValues("webhook_credential_id")}
              onSelect={(id) => form.setValue("webhook_credential_id", id)}
            />
            {form.formState.errors.webhook_credential_id ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.webhook_credential_id.message}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Go to Server Settings &gt; Integrations &gt; Webhooks &gt; New
                Webhook, then copy the URL.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Message</Label>
            </div>

            <Textarea
              rows={5}
              placeholder="e.g. New order from {{webhook.customer_name}}"
              {...form.register("message")}
            />

            {form.formState.errors.message ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.message.message}
              </p>
            ) : (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <InfoIcon className="h-3.5 w-3.5 shrink-0" />
                Reference data from earlier steps with{" "}
                <code className="rounded bg-muted px-1 py-0.5">
                  {"{{node_name.field}}"}
                </code>
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SendDiscordMessageForm;
