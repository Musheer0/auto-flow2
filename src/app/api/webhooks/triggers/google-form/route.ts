import { workflowDataSchema } from "@/features/editor/schemas/workflow-schema";
import { inngest } from "@/inngest/client";
import { getWorkflowByid } from "@/trpc/utils/get-workflow-by-id";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const workflowId = req.nextUrl.searchParams.get("workflow");

  if (!workflowId) {
    return NextResponse.json({ error: "Missing workflow query parameter" }, { status: 400 });
  }

  const workflow = await getWorkflowByid(workflowId);
  if (!workflow) {
    return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
  }

  const workflowData = workflowDataSchema.safeParse(JSON.parse(workflow.data));
  if (workflowData.error) {
    return NextResponse.json({ ...workflowData.error }, { status: 400 });
  }

  const triggerNode = workflowData.data.nodes.find(
    (n) => n.type === "GOOGLE_FORMS"
  );
  if (!triggerNode) {
    return NextResponse.json({ error: "Google Form trigger node not found" }, { status: 400 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  await inngest.send({
    name: "app/workflow.started",
    data: {
      workflow,
      triggerNodeId: triggerNode.id,
      body,
    },
  });

  return NextResponse.json({ ok: true });
};
