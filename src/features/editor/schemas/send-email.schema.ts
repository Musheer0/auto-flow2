import { z } from "zod";

export const sendEmailSchema = z.object({
  email_credential_id: z.string().trim().min(1, "Email credential is required"),
  password_credential_id: z.string().trim().min(1, "App password credential is required"),
  to: z.string().trim().min(1, "Recipient is required"),
  subject: z.string().trim().min(1, "Subject is required"),
  body: z.string().trim().min(1, "Body is required"),
});

export type SendEmailSchemaT = z.infer<typeof sendEmailSchema>;
