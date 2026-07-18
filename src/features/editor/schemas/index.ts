import { NodeType } from "@/generated/prisma/enums";
import z, { ZodObject } from "zod";
import { httpRequestSchema } from "./http-form.schema";
import { telegramSendMessageSchema } from "./send-telegram-message.schema";

export const node_schemas:Record<NodeType,ZodObject|null> ={
     MANUAL_TRIGGER:null,
     HTTP_REQUEST:httpRequestSchema,
     SEND_TELEGRAM_MESSAGE:telegramSendMessageSchema,
     WEBHOOK:z.object({
           webhook_secret:z.string()
     })
}