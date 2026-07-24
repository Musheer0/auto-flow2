"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { NodeProps } from "@xyflow/react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useMemo, useState } from "react";
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
import { generateGoogleFormScript } from "@/lib/google-form-script";
import { useEditorStore } from "@/features/editor/store/editor.store";
import type { NodeData } from "@/features/editor/types";
import { useParams } from "next/navigation";

const formSchema = z.object({
  name: z.string().trim().min(1, "Node name is required"),
});

type FormValues = z.infer<typeof formSchema>;

type GoogleFormData = {
  name?: string;
};

const GoogleFormTriggerForm = (props: NodeProps & { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const node = props.data as NodeData<GoogleFormData>;
  const { updateNode } = useEditorStore();
  const { id: workflowId } = useParams<{ id: string }>();

  const webhookUrl = useMemo(() => {
    if (!workflowId) return "";
    return `${process.env.NEXT_PUBLIC_APP}/api/webhooks/triggers/google-form?workflow=${workflowId}`;
  }, [workflowId]);

  const appScript = useMemo(() => {
    if (!webhookUrl) return "";
    return generateGoogleFormScript(webhookUrl);
  }, [webhookUrl]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: node?.config?.name ?? "gforms",
    },
  });

  const onSubmit = (values: FormValues) => {
    updateNode(props.id, (n) => ({
      ...n,
      data: {
        config: {
          name: values.name,
        },
        user_data: {},
      },
    }));

    toast.success("Google Form trigger saved");
    setOpen(false);
  };

  const [webhookCopied, setWebhookCopied] = useState(false);
  const [scriptCopied, setScriptCopied] = useState(false);

  const handleCopyWebhook = async () => {
    await navigator.clipboard.writeText(webhookUrl);
    setWebhookCopied(true);
    toast.success("Webhook URL copied");
    setTimeout(() => setWebhookCopied(false), 1500);
  };

  const handleCopyScript = async () => {
    await navigator.clipboard.writeText(appScript);
    setScriptCopied(true);
    toast.success("Apps Script copied");
    setTimeout(() => setScriptCopied(false), 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{props.children}</DialogTrigger>

      <DialogContent className="sm:max-w-xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Google Form Trigger</DialogTitle>
          <DialogDescription>
            Trigger this workflow when a Google Form is submitted.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <input type="hidden" {...form.register("name")} value="gforms" />

          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <div className="flex gap-2">
              <Input readOnly value={webhookUrl} className="font-mono text-xs" />
              <Button
                type="button"
                variant="secondary"
                onClick={handleCopyWebhook}
                disabled={!webhookUrl}
              >
                {webhookCopied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                {webhookCopied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Google Apps Script</Label>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCopyScript}
              disabled={!appScript}
            >
              {scriptCopied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
              {scriptCopied ? "Copied" : "Copy Apps Script"}
            </Button>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
            <p className="text-sm font-medium">How to connect Google Form</p>
            <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Open your Google Form</li>
              <li>Click the three dots (⋮) → Extensions → Apps Script</li>
              <li>Delete any existing code, paste the script, then click Save</li>
              <li>Click Run once to authorize</li>
              <li>In Apps Script, go to Triggers → Add trigger</li>
              <li>Function: <strong>onFormSubmit</strong></li>
              <li>Event source: <strong>Form</strong></li>
              <li>Event type: <strong>On form submit</strong></li>
              <li>Click Save</li>
            </ol>
          </div>

          <div className="space-y-2">
            <Label>Access Google Form data in next nodes</Label>
            <Textarea
              readOnly
              className="font-mono text-xs"
              rows={6}
              value={`// Full payload
gforms.data

// All answers
gforms.data.responses

// Single answer (remove all spaces from your question)
gforms.data.responses.What is your name?`}
            />
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

export default GoogleFormTriggerForm;
