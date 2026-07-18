// hooks/use-workflow-by-id.ts
"use client";
import { workflowSchema } from "@/features/editor/schemas/workflow-schema";
import { useEditorStore } from "@/features/editor/store/editor.store";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export const useWorkflowById = (id: string) => {
  const trpc = useTRPC();
  const { setNodes, setEdges } = useEditorStore();

  const query = useQuery(
    trpc.workflows.getById.queryOptions(
      { workflow_id: id },
      {
        select: (result) => {
          if (!result || result.data === "{}") return result;
          // pure parse only — no side effects here
          return {...result,data:JSON.parse(result.data)}
        },
      }
    )
  );

  const { data, isSuccess } = query;

  useEffect(() => {
    if (!isSuccess || !data) return;

    try {
      const parsed = workflowSchema.parse({ ...data.data, workflowId: id });
      setNodes(parsed.nodes);
      setEdges(parsed.edges);
    } catch (error) {
      console.error("Invalid workflow:", error);
      toast.error(
        "This workflow contains invalid or corrupted data. Please create a new workflow."
      );
    }
    // only re-run when the actual data changes, not on every render
  }, [data, isSuccess, id, setNodes, setEdges]);

  return query;
};