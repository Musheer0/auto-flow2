import z, { type ZodObject } from "zod";
import type { NodeType } from "@/generated/prisma/enums";
import { httpRequestSchema } from "./http-form.schema";
import { sendEmailSchema } from "./send-email.schema";
import { sendDiscordMessageSchema } from "./send-discord-message.schema";
import { telegramSendMessageSchema } from "./send-telegram-message.schema";
import { groqAiSchema } from "./groq-ai-schema";

export const node_schemas:Record<NodeType,ZodObject|null> ={
     MANUAL_TRIGGER:null,
     HTTP_REQUEST:httpRequestSchema,
     SEND_TELEGRAM_MESSAGE:telegramSendMessageSchema,
     SEND_EMAIL:sendEmailSchema,
     SEND_DISCORD_MESSAGE:sendDiscordMessageSchema,
     WEBHOOK:z.object({
           webhook_secret:z.string()
     }),
     GOOGLE_FORMS:null,
     GROQ_AI:groqAiSchema,
     PUBSUBHUBBUB:null
}