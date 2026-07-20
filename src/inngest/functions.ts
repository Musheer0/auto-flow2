// src/inngest/functions.ts
import { workflow } from "@/generated/prisma/client";
import { inngest } from "./client";
import {
  WorkflowDataSchema,
  nodeSchema,
  edgeSchema,
} from "@/features/editor/schemas/workflow-schema";
import z from "zod";

type Node = z.infer<typeof nodeSchema>;
type Edge = z.infer<typeof edgeSchema>;

const executeNode = async (
  node: Node,
  context: Record<string, any>
) => {
  console.log(`Executing: ${node.data?.config?.name ?? node.type}`);

  await new Promise((r) => setTimeout(r, 500));

  return {
    success: true,
    node: node.data?.config?.name ?? node.type,
  };
};

export const processTask = inngest.createFunction(
  { id: "process-task", triggers: { event: "app/workflow.started" } },
  async ({ event, step }) => {
    const { data } = event;
    const workflowRecord: workflow = data.workflow as any;
    const triggerNodeId = data.triggerNodeId as string;
    const workflowData = JSON.parse(
      workflowRecord.data
    ) as WorkflowDataSchema;

    const { nodes, edges } = workflowData;

    const getNode = (id: string) => nodes.find((n) => n.id === id)!;
    
    const outgoing = new Map<string, string[]>();
    const indegree = new Map<string, number>();

    for (const node of nodes) {
      outgoing.set(node.id, []);
      indegree.set(node.id, 0);
    }

    for (const edge of edges) {
      outgoing.get(edge.source)!.push(edge.target);
      indegree.set(edge.target, (indegree.get(edge.target) ?? 0) + 1);
    }

    const trigger = getNode(triggerNodeId);

    const context: Record<string, any> = {
      [
        trigger.type === "MANUAL_TRIGGER"
          ? "manual"
          : trigger.data?.config?.name ?? trigger.type
      ]: "started",
    };

    const executed = new Set<string>();
    const queue: string[] = [triggerNodeId];

    while (queue.length) {
      const batch = [...queue];
      queue.length = 0;

      await Promise.all(
        batch.map(async (id) => {
          if (executed.has(id)) return;

          const node = getNode(id);

          if (node.type !== "MANUAL_TRIGGER") {
            const result = await step.run(
              `execute-${node.id}`,
              () => executeNode(node, context)
            );
            context[node.data?.config?.name ?? node.type] = result;
          }

          executed.add(id);

          for (const child of outgoing.get(id) ?? []) {
            indegree.set(child, indegree.get(child)! - 1);
            if (indegree.get(child) === 0 && !executed.has(child)) {
              queue.push(child);
            }
          }
        })
      );
    }
  }
);
