"use client";

import { useState } from "react";
import { NodeProps } from "@xyflow/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { EyeIcon, EyeOffIcon, InfoIcon, SendIcon } from "lucide-react";
import { toast } from "sonner";

import { useEditorStore } from "@/features/editor/store/editor.store";
import type { NodeData } from "@/features/editor/types";
import { telegramSendMessageSchema } from "@/features/editor/schemas/send-telegram-message.schema";

const TELEGRAM_MESSAGE_LIMIT = 4096;

const schema = z.object({
  name: z.string().trim().min(1, "Node name is required"),
}).merge(telegramSendMessageSchema);

type FormValues = z.infer<typeof schema>;

const SendTelegramMessageForm = (
  props: NodeProps & { children: React.ReactNode }
) => {
  const [open, setOpen] = useState(false);
  const [showToken, setShowToken] = useState(false);

  const node = props.data as NodeData<z.infer<typeof telegramSendMessageSchema>>;
  const { updateNode } = useEditorStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: node?.config?.name ?? "",
      bot_token: node?.user_data?.bot_token ?? "",
      chat_id: node?.user_data?.chat_id ?? "",
      message: node?.user_data?.message ?? "",
    },
  });

  const message = form.watch("message");
  const name = form.watch("name");
  const remaining = TELEGRAM_MESSAGE_LIMIT - message.length;
  const nearLimit = remaining <= 200;

  const onSubmit = (values: FormValues) => {
    updateNode(props.id, (n) => ({
      ...n,
      data: {
        config: {
          name: values.name,
        },
        user_data: {
          bot_token: values.bot_token,
          chat_id: values.chat_id,
          message: values.message,
        },
      },
    }));

    toast.success("Telegram message saved");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{props.children}</DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Send Telegram Message</DialogTitle>
          <DialogDescription>
            Send a message through a Telegram bot when this step runs.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label>Node name</Label>
            <Input placeholder="e.g. Notify Team" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Bot token</Label>
            <div className="relative">
              <Input
                type={showToken ? "text" : "password"}
                placeholder="123456789:AAExampleTokenFromBotFather"
                className="pr-9 font-mono text-sm"
                {...form.register("bot_token")}
              />
              <button
                type="button"
                onClick={() => setShowToken((s) => !s)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showToken ? "Hide token" : "Show token"}
              >
                {showToken ? (
                  <EyeOffIcon className="size-4" />
                ) : (
                  <EyeIcon className="size-4" />
                )}
              </button>
            </div>
            {form.formState.errors.bot_token ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.bot_token.message}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Get this from{" "}
                <span className="font-medium text-foreground">@BotFather</span>{" "}
                on Telegram after creating a bot. Kept private, never shown in
                logs.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Chat ID</Label>
            <Input placeholder="e.g. -1001234567890" {...form.register("chat_id")} />
            {form.formState.errors.chat_id ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.chat_id.message}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                The user, group, or channel to message. Message{" "}
                <span className="font-medium text-foreground">@userinfobot</span>{" "}
                for your own ID, or add the bot to a group and check its
                updates for the group's ID.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Message</Label>
              <span
                className={cn(
                  "text-xs tabular-nums",
                  nearLimit ? "text-amber-600" : "text-muted-foreground",
                  remaining < 0 && "text-destructive"
                )}
              >
                {remaining} left
              </span>
            </div>

            <Textarea
              rows={5}
              placeholder="e.g. New order received from {{Webhook.body.customer_name}}"
              {...form.register("message")}
            />

            {form.formState.errors.message && (
              <p className="text-xs text-destructive">
                {form.formState.errors.message.message}
              </p>
            )}

            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <InfoIcon className="h-3.5 w-3.5 shrink-0" />
              Reference data from earlier steps with{" "}
              <code className="rounded bg-muted px-1 py-0.5">
                {"{{node_name.field}}"}
              </code>
            </p>

            {/* Small live preview so it's obvious how the message will actually
               read, since raw textareas hide line breaks and length at a glance. */}
            {message.trim() && (
              <div className="rounded-lg border bg-muted/40 p-3">
                <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <SendIcon className="h-3 w-3" />
                  Preview
                </div>
                <div className="rounded-lg rounded-tl-sm bg-[#effdde] px-3 py-2 text-sm text-foreground shadow-sm dark:bg-emerald-950/60">
                  <p className="whitespace-pre-wrap break-words">{message}</p>
                </div>
              </div>
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

export default SendTelegramMessageForm;