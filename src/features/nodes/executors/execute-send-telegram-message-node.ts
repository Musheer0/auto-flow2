
import { telegramSendMessageSchema, TelegramSendMessageSchemaT } from "@/features/editor/schemas/send-telegram-message.schema";
import { NodeData } from "@/features/editor/types";
import { NonRetriableError } from "inngest";
import handlebars from "@/features/nodes/lib/handlebar";
import { getCredentialById } from "@/trpc/utils/get-credential-by-id";
import { decrypt } from "@/lib/encrypt-decrypt";

const credentialPre = "credential-";

export const executeTelegramSendMessageNode = async (
  userId: string,
  node_data:any,
  context: any = {}
) => {
  const name = node_data?.config?.name;

  if (!name) {
    throw new NonRetriableError("Telegram node not configured");
  }

  const { data, error } = telegramSendMessageSchema.safeParse(
    node_data.user_data
  );

  if (error) {
    throw new NonRetriableError("Node not configured properly");
  }
  const compile = (value: string) => handlebars.compile(value)(context);
  const credentialId = data.bot_token

  const credential = await getCredentialById(userId, credentialId);

  if (!credential) {
    throw new NonRetriableError(
      `Credential not found: ${credentialId}`
    );
  }

  const botToken = decrypt(credential.data);

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: compile(data.chat_id),
        text: compile(data.message),
      }),
    }
  );

  if (!response.ok) {
    throw new NonRetriableError(await response.text());
  }

  return await response.json();
};