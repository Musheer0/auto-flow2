import type { NodeProps } from "@xyflow/react";
import type { ComponentType, ReactNode } from "react";
import type { NodeType } from "@/generated/prisma/enums";
import HttpRequestForm from "../components/forms/http-form";
import SendEmailForm from "../components/forms/send-email-form";
import SendDiscordMessageForm from "../components/forms/send-discord-message-form";
import SendTelegramMessageForm from "../components/forms/send-telegram-message-form";
import WebhookForm from "../components/forms/webhook-form";

type NodeFormComponent = ComponentType<NodeProps & { children: ReactNode }>;

export const NodeForms: Record<NodeType, NodeFormComponent | null> = {
    MANUAL_TRIGGER: null,
    HTTP_REQUEST: HttpRequestForm,
    SEND_TELEGRAM_MESSAGE: SendTelegramMessageForm,
    SEND_EMAIL: SendEmailForm,
    SEND_DISCORD_MESSAGE: SendDiscordMessageForm,
    WEBHOOK: WebhookForm,
};