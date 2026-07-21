import { NonRetriableError } from "inngest";
import nodemailer from "nodemailer";
import { sendEmailSchema } from "@/features/editor/schemas/send-email.schema";
import handlebars from "@/features/nodes/lib/handlebar";
import { decrypt } from "@/lib/encrypt-decrypt";
import { getCredentialById } from "@/trpc/utils/get-credential-by-id";

export const executeSendEmailNode = async (
  userId: string,
  node_data: any,
  context: any = {},
) => {
  const name = node_data?.config?.name;

  if (!name) {
    throw new NonRetriableError("Send email node not configured");
  }

  const { data, error } = sendEmailSchema.safeParse(node_data.user_data);

  if (error) {
    throw new NonRetriableError("Node not configured properly");
  }

  const [emailCred, passwordCred] = await Promise.all([
    getCredentialById(userId, data.email_credential_id),
    getCredentialById(userId, data.password_credential_id),
  ]);

  if (!emailCred) {
    throw new NonRetriableError(`Email credential not found: ${data.email_credential_id}`);
  }
  if (!passwordCred) {
    throw new NonRetriableError(`Password credential not found: ${data.password_credential_id}`);
  }

  const email = decrypt(emailCred.data);
  const appPassword = decrypt(passwordCred.data);

  const compile = (value: string) => handlebars.compile(value)(context);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: email,
      pass: appPassword,
    },
  });

  const info = await transporter.sendMail({
    from: email,
    to: compile(data.to),
    subject: compile(data.subject),
    text: compile(data.body),
  });

  return { messageId: info.messageId };
};
