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
import { EnumSelect } from "@/features/editor/components/enum-selector";

import { groqAiSchema, GROQ_MODELS} from "@/features/editor/schemas/groq-ai-schema";
import { useEditorStore } from "@/features/editor/store/editor.store";
import type { NodeData } from "@/features/editor/types";

const schema = z
  .object({
    name: z.string().trim().min(1, "Node name is required"),
  })
  .merge(groqAiSchema);

type FormValues = z.infer<typeof schema>;

const GroqAiForm = (
  props: NodeProps & {
    children: React.ReactNode;
  },
) => {
  const [open, setOpen] = useState(false);

  const node = props.data as NodeData<z.infer<typeof groqAiSchema>>;
  const { updateNode } = useEditorStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: node?.config?.name ?? "",
      api_key: node?.user_data?.api_key ?? "",
      system_prompt: node?.user_data?.system_prompt ?? "",
      user_prompt: node?.user_data?.user_prompt ?? "",
      model: node?.user_data?.model ?? GROQ_MODELS.GPT_OSS_20B,
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
          api_key: values.api_key,
          system_prompt: values.system_prompt,
          user_prompt: values.user_prompt,
          model: values.model,
        },
      },
    }));

    toast.success("Groq AI node saved");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{props.children}</DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Groq AI</DialogTitle>
          <DialogDescription>
            Configure a Groq model and prompts.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label>Node name</Label>

            <Input
              placeholder="e.g. Generate Summary"
              {...form.register("name")}
            />

            {form.formState.errors.name && (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>API Key Credential</Label>

            <SelectCredentials
              type="GROQ_AI"
              currentId={form.watch("api_key")}
              onSelect={(id) =>
                form.setValue("api_key", id, {
                  shouldValidate: true,
                })
              }
            />

            {form.formState.errors.api_key ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.api_key.message}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Select the stored Groq API credential.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Model</Label>

            <EnumSelect
              enums={GROQ_MODELS}
              value={form.watch("model")}
              onSelect={(value) =>
                form.setValue("model", value, {
                  shouldValidate: true,
                })
              }
              formatLabel={(_, value) => value}
            />

            {form.formState.errors.model && (
              <p className="text-xs text-destructive">
                {form.formState.errors.model.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>System Prompt</Label>

            <Textarea
              rows={6}
              placeholder="You are a helpful assistant..."
              {...form.register("system_prompt")}
            />

            {form.formState.errors.system_prompt ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.system_prompt.message}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Defines the model's behaviour and rules.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>User Prompt</Label>

            <Textarea
              rows={8}
              placeholder="Summarize {{webhook.body}}"
              {...form.register("user_prompt")}
            />

            {form.formState.errors.user_prompt ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.user_prompt.message}
              </p>
            ) : (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <InfoIcon className="h-3.5 w-3.5 shrink-0" />
                Use workflow variables like{" "}
                <code className="rounded bg-muted px-1 py-0.5">
                  {"{{webhook.body}}"}
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

            <Button type="submit">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GroqAiForm;