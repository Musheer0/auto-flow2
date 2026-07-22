import { NodeType } from "@/generated/prisma/enums";
import { z } from "zod";

export const requiredFieldSchema = z.object({
  label: z.string(),
  placeholder: z.string(),
  is_credential: z.boolean(),
  type: z.enum([
    "text",
    "password",
    "email",
    "number",
    "textarea",
    "select",
  ]).default("text"),
  options: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ).optional(),
  value: z.any(),
});

const requiredFieldsSchema = z.array(
  z.object({
    nodeId: z.string(),
    fields: z.array(
      z.object({
        name: z.string(),
        label: z.string(),
        placeholder: z.string(),
        isCredential: z.boolean(),
        type: z.enum([
          "text",
          "password",
          "email",
          "number",
          "textarea",
          "select",
        ]),
        options: z.array(
          z.object({
            label: z.string(),
            value: z.string(),
          })
        ).nullable(),
        value: z.unknown().nullable(),
      })
    )
  })
);
export const nodeSchema = z.object({
  id: z.string().min(1),
  type: z.enum(NodeType),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: z.any(),
});

export const edgeSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  target: z.string().min(1),
});

export const workflowDataSchema = z.object({
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
  summary:z.string()
});
export const generatedOutPutSchema = workflowDataSchema