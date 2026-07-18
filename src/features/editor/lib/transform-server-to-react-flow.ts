import { Edge, Node } from "@xyflow/react";
import { WorkflowSchema } from "../schemas/workflow-schema";

export const transformServerDataToReactFlow = (
  workflow: WorkflowSchema
): {
  nodes: Node[];
  edges: Edge[];
} => {
  return {
    nodes: workflow.nodes as Node[],
    edges: workflow.edges as Edge[],
  };
};