import { NodeType } from "@/generated/prisma/enums";
import { NodeProps } from "@xyflow/react";
import { ComponentType, ReactNode } from "react";
import WebhookForm from "../components/forms/webhook-form";
import HttpRequestForm from "../components/forms/http-form";
import SendTelegramMessageForm from "../components/forms/send-telegram-message-form";

type NodeFormComponent = ComponentType<NodeProps & { children: ReactNode }>;

export const NodeForms: Record<NodeType, NodeFormComponent | null> = {
    MANUAL_TRIGGER: null,
    HTTP_REQUEST: HttpRequestForm,
    SEND_TELEGRAM_MESSAGE: SendTelegramMessageForm,
    WEBHOOK: WebhookForm,
};