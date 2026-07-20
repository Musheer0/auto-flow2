import { NodeType } from "@/generated/prisma/enums";
import { executeHttpNode } from "./executors/execute-http-node";
import { executeTelegramSendMessageNode } from "./executors/execute-send-telegram-message-node";

type NodeExecutor = (
  userId: string,
  node_data: any,
  context: any
) => Promise<any>;

export const executorsConfig: Record<NodeType, NodeExecutor | null> = {
  MANUAL_TRIGGER: null,
  HTTP_REQUEST: executeHttpNode,
  SEND_TELEGRAM_MESSAGE: executeTelegramSendMessageNode,
  WEBHOOK: null,
};