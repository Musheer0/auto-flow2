import { NodeType } from "@/generated/prisma/enums";
import BaseTrigger from "../components/nodes/base-trigger";
import BaseExecutor from "../components/nodes/base-executor";
import PubSubTrigger from "../components/nodes/pubsub-trigger";

export const NodeTypes: Record<NodeType, any> = {
  MANUAL_TRIGGER: BaseTrigger,
  WEBHOOK:BaseTrigger,
  HTTP_REQUEST:BaseExecutor,
  SEND_TELEGRAM_MESSAGE:BaseExecutor,
  SEND_EMAIL:BaseExecutor,
  SEND_DISCORD_MESSAGE:BaseExecutor,
  GROQ_AI:BaseExecutor,
  PUBSUBHUBBUB:BaseTrigger,
  GOOGLE_FORMS:BaseTrigger
};
