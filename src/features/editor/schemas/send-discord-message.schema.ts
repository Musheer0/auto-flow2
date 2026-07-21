import { z } from "zod";

export const sendDiscordMessageSchema = z.object({
  webhook_credential_id: z.string().trim().min(1, "Webhook credential is required"),
  message: z.string().trim().min(1, "Message is required"),
});

export type SendDiscordMessageSchemaT = z.infer<typeof sendDiscordMessageSchema>;
