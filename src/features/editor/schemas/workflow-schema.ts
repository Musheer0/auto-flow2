import { NodeType } from "@/generated/prisma/enums";
import { z } from "zod";

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
  sourceHandle: z.any().optional(),
  targetHandle: z.any().optional(),
});

export const workflowSchema = z.object({
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
  workflowId:z.string()
});
export const workflowDataSchema = z.object({
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
});
export type WorkflowSchema = z.infer<typeof workflowSchema>;
export type WorkflowDataSchema = z.infer<typeof workflowDataSchema>;

