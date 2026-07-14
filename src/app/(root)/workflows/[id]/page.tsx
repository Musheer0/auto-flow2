import { WorkflowDetail } from "@/features/workflows/components/workflow-detail";

export default async function WorkflowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WorkflowDetail workflowId={id} />;
}
