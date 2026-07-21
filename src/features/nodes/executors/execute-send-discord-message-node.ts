import { NonRetriableError } from "inngest";
import { sendDiscordMessageSchema } from "@/features/editor/schemas/send-discord-message.schema";
import handlebars from "@/features/nodes/lib/handlebar";
import { decrypt } from "@/lib/encrypt-decrypt";
import { getCredentialById } from "@/trpc/utils/get-credential-by-id";

export const executeSendDiscordMessageNode = async (
  userId: string,
  node_data: any,
  context: any = {},
) => {
  const name = node_data?.config?.name;

  if (!name) {
    throw new NonRetriableError("Send Discord message node not configured");
  }

  const { data, error } = sendDiscordMessageSchema.safeParse(
    node_data.user_data,
  );

  if (error) {
    throw new NonRetriableError("Node not configured properly");
  }

  const credential = await getCredentialById(
    userId,
    data.webhook_credential_id,
  );

  if (!credential) {
    throw new NonRetriableError(
      `Credential not found: ${data.webhook_credential_id}`,
    );
  }

  const webhookUrl = decrypt(credential.data);

  const compile = (value: string) => handlebars.compile(value)(context);

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: compile(data.message) }),
  });

  if (!response.ok) {
    throw new NonRetriableError(
      `Discord webhook failed: ${response.status} ${response.statusText}`,
    );
  }

  return { success: true };
};
