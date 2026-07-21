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
import { sendEmailSchema } from "@/features/editor/schemas/send-email.schema";
import { useEditorStore } from "@/features/editor/store/editor.store";
import type { NodeData } from "@/features/editor/types";

const schema = z
  .object({
    name: z.string().trim().min(1, "Node name is required"),
  })
  .merge(sendEmailSchema);

type FormValues = z.infer<typeof schema>;

const SendEmailForm = (props: NodeProps & { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const node = props.data as NodeData<z.infer<typeof sendEmailSchema>>;
  const { updateNode } = useEditorStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: node?.config?.name ?? "",
      email_credential_id: node?.user_data?.email_credential_id ?? "",
      password_credential_id: node?.user_data?.password_credential_id ?? "",
      to: node?.user_data?.to ?? "",
      subject: node?.user_data?.subject ?? "",
      body: node?.user_data?.body ?? "",
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
          email_credential_id: values.email_credential_id,
          password_credential_id: values.password_credential_id,
          to: values.to,
          subject: values.subject,
          body: values.body,
        },
      },
    }));

    toast.success("Send email saved");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{props.children}</DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Send Email</DialogTitle>
          <DialogDescription>
            Send an email through Gmail SMTP when this step runs.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label>Node name</Label>
            <Input
              placeholder="e.g. Send Welcome Email"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Gmail address</Label>
            <SelectCredentials
              type="SEND_EMAIL"
              currentId={form.getValues("email_credential_id")}
              onSelect={(id) => form.setValue("email_credential_id", id)}
            />
            {form.formState.errors.email_credential_id ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.email_credential_id.message}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                The Gmail address you're sending from.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>App password</Label>
            <SelectCredentials
              type="SEND_EMAIL"
              currentId={form.getValues("password_credential_id")}
              onSelect={(id) => form.setValue("password_credential_id", id)}
            />
            {form.formState.errors.password_credential_id ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.password_credential_id.message}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Create one at{" "}
                <a
                  href="https://myaccount.google.com/apppasswords"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline underline-offset-2"
                >
                  myaccount.google.com/apppasswords
                </a>
                .
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>To</Label>
            <Input
              placeholder="e.g. user@example.com or {{webhook.email}}"
              {...form.register("to")}
            />
            {form.formState.errors.to ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.to.message}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Recipient email address. Use{" "}
                <code className="rounded bg-muted px-1 py-0.5">
                  {"{{node_name.field}}"}
                </code>{" "}
                to reference data from earlier steps.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Subject</Label>
            <Input
              placeholder="e.g. Welcome to AutoFlow"
              {...form.register("subject")}
            />
            {form.formState.errors.subject && (
              <p className="text-xs text-destructive">
                {form.formState.errors.subject.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Body</Label>
            <Textarea
              rows={6}
              placeholder="e.g. Hi {{user.name}}, welcome to AutoFlow!"
              {...form.register("body")}
            />
            {form.formState.errors.body ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.body.message}
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

export default SendEmailForm;
