import { z } from "zod";

export const telegramSendMessageSchema = z.object({
  bot_token: z.string().trim().min(1, "Bot token is required"),

  chat_id: z.string().trim().min(1, "Chat ID is required"),

  message: z.string().trim().min(1, "Message is required"),
});

export type TelegramSendMessageSchemaT = z.infer<
  typeof telegramSendMessageSchema
>;