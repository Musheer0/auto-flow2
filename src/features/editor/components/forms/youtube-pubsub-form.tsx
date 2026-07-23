"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { NodeProps } from "@xyflow/react";
import { CheckIcon, CopyIcon, RefreshCwIcon } from "lucide-react";
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
import { YoutubePubSubSchema } from "@/features/editor/schemas/youtube-pubsubhubhub-schema";
import { useEditorStore } from "@/features/editor/store/editor.store";
import type { NodeData } from "@/features/editor/types";
import { useParams } from "next/navigation";

const formSchema = z
  .object({
    name: z.string().trim().min(1, "Node name is required"),
  })
  .merge(YoutubePubSubSchema);

type FormValues = z.infer<typeof formSchema>;

const generateBase64Secret = () => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
};

const YoutubePubSubForm = (props: NodeProps & { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const node = props.data as NodeData<z.infer<typeof YoutubePubSubSchema>>;
  const { updateNode } = useEditorStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: node?.config?.name ?? "",
      channel_id: node?.user_data?.channel_id ?? "",
      verify_secret: node?.user_data?.verify_secret ?? "",
      has_subscribed: node?.user_data?.has_subscribed ?? false,
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
          channel_id: values.channel_id,
          verify_secret: values.verify_secret,
          has_subscribed: values.has_subscribed,
        },
      },
    }));

    toast.success("YouTube PubSub saved");
    setOpen(false);
  };

  const handleGenerateSecret = () => {
    const secret = generateBase64Secret();
    form.setValue("verify_secret", secret);
    toast.success("Secret generated");
  };

  const { id } = useParams<{ id: string }>();
  const callbackUrl = `${window.origin}/api/workflows/${id}/webhook/${props.id}/pubsub`;
  const [callbackCopied, setCallbackCopied] = useState(false);

  const channelId = form.watch("channel_id");
  const verifySecret = form.watch("verify_secret");
  const topicUrl = channelId
    ? `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${channelId}`
    : "";
  const [topicCopied, setTopicCopied] = useState(false);
  const [secretCopied, setSecretCopied] = useState(false);

  const handleCopyTopic = () => {
    if (!topicUrl) return;
    navigator.clipboard.writeText(topicUrl);
    setTopicCopied(true);
    toast.success("Topic URL copied");
    setTimeout(() => setTopicCopied(false), 1500);
  };

  const handleCopySecret = () => {
    if (!verifySecret) return;
    navigator.clipboard.writeText(verifySecret);
    setSecretCopied(true);
    toast.success("Secret copied");
    setTimeout(() => setSecretCopied(false), 1500);
  };

  const handleCopyCallback = () => {
    navigator.clipboard.writeText(callbackUrl);
    setCallbackCopied(true);
    toast.success("Callback URL copied");
    setTimeout(() => setCallbackCopied(false), 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{props.children}</DialogTrigger>

      <DialogContent className="sm:max-w-lg overflow-y-scroll max-h-screen">
        <DialogHeader>
          <DialogTitle>YouTube PubSub Hubbub</DialogTitle>
          <DialogDescription>
            Subscribe to YouTube channel updates via PubSubHubbub.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label>Node name</Label>
            <Input
              placeholder="e.g. youtube_channel_updates"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Channel ID</Label>
            <Input
              placeholder="e.g. UC_x5XG1OV2P6uZZ5FSM9Ttw"
              {...form.register("channel_id")}
            />
            {form.formState.errors.channel_id ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.channel_id.message}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                The YouTube channel ID to subscribe to.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Verify Secret</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Click generate or enter manually"
                {...form.register("verify_secret")}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleGenerateSecret}
              >
                <RefreshCwIcon className="h-4 w-4" />
                Generate
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCopySecret}
                disabled={!verifySecret}
              >
                {secretCopied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
              </Button>
            </div>
            {form.formState.errors.verify_secret ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.verify_secret.message}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Used to verify that subscription requests are authentic.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {channelId && (
              <div className="space-y-2">
                <Label>Topic URL</Label>
                <div className="flex gap-2">
                  <Input readOnly value={topicUrl} className="font-mono text-xs" />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCopyTopic}
                  >
                    {topicCopied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                    {topicCopied ? "Copied" : "Copy"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use this as the Topic URL when subscribing below.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label>Callback URL</Label>
              <div className="flex gap-2">
                <Input readOnly value={callbackUrl} className="font-mono text-xs" />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCopyCallback}
                >
                  {callbackCopied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                  {callbackCopied ? "Copied" : "Copy"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Use this as the Callback URL when subscribing below.
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
            <p className="text-sm font-medium">How to subscribe</p>
            <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Copy the <strong>Topic URL</strong> above.</li>
              <li>Copy the <strong>Callback URL</strong> above.</li>
              <li>
                Go to{" "}
                <a
                  href="https://pubsubhubbub.appspot.com/subscribe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline underline-offset-2"
                >
                  pubsubhubbub.appspot.com/subscribe
                </a>
              </li>
              <li>Paste the Topic URL into the <strong>Topic (feed URL)</strong> field.</li>
              <li>Paste the Callback URL into the <strong>Callback URL</strong> field.</li>
              <li>Paste the <strong>Verify Secret</strong> into the <strong>Secret</strong> field.</li>
              <li>Click <strong>Subscribe</strong>.</li>
            </ol>
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

export default YoutubePubSubForm;
