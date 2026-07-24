import type { NodeProps } from "@xyflow/react";
import type { ComponentType, ReactNode } from "react";
import type { NodeType } from "@/generated/prisma/enums";
import HttpRequestForm from "../components/forms/http-form";
import SendEmailForm from "../components/forms/send-email-form";
import SendDiscordMessageForm from "../components/forms/send-discord-message-form";
import SendTelegramMessageForm from "../components/forms/send-telegram-message-form";
import WebhookForm from "../components/forms/webhook-form";
import GroqAiForm from "../components/forms/groq-ai-form";
import YoutubePubSubForm from "../components/forms/youtube-pubsub-form";
import GoogleFormTriggerForm from "../components/forms/google-form-trigger-form";

type NodeFormComponent = ComponentType<NodeProps & { children: ReactNode }>;

export const NodeForms: Record<NodeType, NodeFormComponent | null> = {
    MANUAL_TRIGGER: null,
    HTTP_REQUEST: HttpRequestForm,
    SEND_TELEGRAM_MESSAGE: SendTelegramMessageForm,
    SEND_EMAIL: SendEmailForm,
    SEND_DISCORD_MESSAGE: SendDiscordMessageForm,
    WEBHOOK: WebhookForm,
    GROQ_AI:GroqAiForm,
    PUBSUBHUBBUB:YoutubePubSubForm,
    GOOGLE_FORMS:GoogleFormTriggerForm
};