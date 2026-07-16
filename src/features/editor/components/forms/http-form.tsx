"use client";

import { useState } from "react";
import { NodeProps } from "@xyflow/react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { PlusIcon, Trash2Icon, InfoIcon } from "lucide-react";
import { toast } from "sonner";

import { useEditorStore } from "@/features/editor/store/editor.store";
import type { NodeData } from "@/features/editor/types";
import type { HttpRequestFormSchemaT } from "@/features/editor/schemas/http-form.schema";

const methods = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
] as const;

// Methods that don't conventionally carry a request body.
// Keeping the body field out of the way here avoids the "I sent a body but
// nothing happened" confusion on GET/HEAD requests.
const BODYLESS_METHODS = new Set(["GET", "HEAD"]);

const methodColors: Record<(typeof methods)[number], string> = {
  GET: "bg-blue-600",
  POST: "bg-emerald-600",
  PUT: "bg-amber-600",
  PATCH: "bg-amber-600",
  DELETE: "bg-red-600",
  HEAD: "bg-slate-500",
  OPTIONS: "bg-slate-500",
};

const schema = z.object({
  name: z.string().trim().min(1, "Node name is required"),
  url: z.url("Enter a valid URL, including https://"),
  method: z.enum(methods),
  headers: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
    })
  ),
  body: z.string(),
});

type FormValues = z.infer<typeof schema>;

const HttpRequestForm = (
  props: NodeProps & { children: React.ReactNode }
) => {
  const [open, setOpen] = useState(false);

  const node = props.data as NodeData<HttpRequestFormSchemaT>;
  const { updateNode } = useEditorStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: node?.config?.name ?? "",
      url: node?.user_data?.url ?? "",
      method: node?.user_data?.method ?? "GET",
      headers: node?.user_data?.headers ?? [],
      body: node?.user_data?.body ?? "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "headers",
  });

  const method = form.watch("method");
  const hasBody = !BODYLESS_METHODS.has(method);
  const bodyValue = form.watch("body");

  let bodyJsonError: string | null = null;
  if (hasBody && bodyValue.trim()) {
    try {
      JSON.parse(bodyValue);
    } catch {
      bodyJsonError = "This doesn't look like valid JSON — it'll still be sent as-is.";
    }
  }

  const onSubmit = (values: FormValues) => {
    updateNode(props.id, (n) => ({
      ...n,
      data: {
        config: {
          name: values.name,
        },
        user_data: {
          url: values.url,
          method: values.method,
          headers: values.headers.filter(
            (h) => h.key.trim() || h.value.trim()
          ),
          // Drop any body the user typed earlier if they've since switched
          // to a bodyless method, so stale data can't get sent silently.
          body: hasBody ? values.body : "",
          query: [],
        },
      },
    }));

    toast.success("HTTP request saved");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{props.children}</DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>HTTP Request</DialogTitle>
          <DialogDescription>
            Send an outgoing request when this step runs, and use the
            response later in your workflow.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label>Node name</Label>
            <Input placeholder="e.g. Get Order Details" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Request</Label>

            {/* Grouped method + URL, styled like a single address bar so the
               two fields read as one request rather than unrelated inputs. */}
            <div
              className={cn(
                "flex items-stretch rounded-md border transition-colors",
                "focus-within:ring-1 focus-within:ring-ring",
                form.formState.errors.url && "border-destructive"
              )}
            >
              <Select
                value={method}
                onValueChange={(value) =>
                  form.setValue("method", value as FormValues["method"], {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="w-[110px] rounded-r-none border-y-0 border-l-0 focus:ring-0">
                  <SelectValue>
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-xs font-semibold text-white",
                        methodColors[method]
                      )}
                    >
                      {method}
                    </span>
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  {methods.map((m) => (
                    <SelectItem key={m} value={m}>
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-xs font-semibold text-white",
                          methodColors[m]
                        )}
                      >
                        {m}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="https://api.example.com/v1/orders"
                className="rounded-l-none border-y-0 border-r-0 font-mono text-sm focus-visible:ring-0"
                {...form.register("url")}
              />
            </div>

            {form.formState.errors.url && (
              <p className="text-xs text-destructive">
                {form.formState.errors.url.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Headers</Label>

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => append({ key: "", value: "" })}
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Add header
              </Button>
            </div>

            {fields.length === 0 && (
              <p className="rounded-md border border-dashed px-3 py-4 text-center text-sm text-muted-foreground">
                No headers yet — add one if the API needs things like an
                API key or content type.
              </p>
            )}

            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  placeholder="Header, e.g. Authorization"
                  className="font-mono text-sm"
                  {...form.register(`headers.${index}.key`)}
                />

                <Input
                  placeholder="Value"
                  className="font-mono text-sm"
                  {...form.register(`headers.${index}.value`)}
                />

                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => remove(index)}
                  aria-label="Remove header"
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Body only applies to methods that actually send one — showing
             it unconditionally invites people to fill in a field that gets
             silently ignored on GET/HEAD requests. */}
          {hasBody ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Body</Label>
                <span className="text-xs text-muted-foreground">JSON</span>
              </div>

              <Textarea
                rows={8}
                className="font-mono text-sm"
                placeholder='{"hello":"world"}'
                {...form.register("body")}
              />

              {bodyJsonError && (
                <p className="flex items-center gap-1.5 text-xs text-amber-600">
                  <InfoIcon className="h-3.5 w-3.5 shrink-0" />
                  {bodyJsonError}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-md border border-dashed px-3 py-3 text-sm text-muted-foreground">
              <InfoIcon className="h-4 w-4 shrink-0" />
              <span>
                <Badge variant="secondary" className="mr-1">{method}</Badge>
                requests don't send a body.
              </span>
            </div>
          )}

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

export default HttpRequestForm;