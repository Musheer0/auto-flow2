import { NodeType } from "@/generated/prisma/enums";
import BaseTrigger from "../components/nodes/base-trigger";
import BaseExecutor from "../components/nodes/base-executor";

export const NodeTypes: Record<NodeType, any> = {
  MANUAL_TRIGGER: BaseTrigger,
  WEBHOOK:BaseTrigger,
  HTTP_REQUEST:BaseExecutor,
  SEND_TELEGRAM_MESSAGE:BaseExecutor
};
