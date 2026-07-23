import { NonRetriableError } from "inngest";
import Groq from "groq-sdk";

import {
  groqAiSchema,
} from "@/features/editor/schemas/groq-ai-schema";

import handlebars from "@/features/nodes/lib/handlebar";
import { decrypt } from "@/lib/encrypt-decrypt";
import { getCredentialById } from "@/trpc/utils/get-credential-by-id";

export const executeGroqAiNode = async (
  userId: string,
  node_data: any,
  context: any = {},
) => {
  const name = node_data?.config?.name;

  if (!name) {
    throw new NonRetriableError("Groq AI node not configured");
  }

  const { data, error } = groqAiSchema.safeParse(node_data.user_data);

  if (error) {
    throw new NonRetriableError("Groq AI node is not configured properly");
  }

  const credential = await getCredentialById(userId, data.api_key);

  if (!credential) {
    throw new NonRetriableError(
      `Credential not found: ${data.api_key}`,
    );
  }

  const apiKey = decrypt(credential.data);

  const groq = new Groq({
    apiKey,
  });

  const compile = (value: string) =>
    handlebars.compile(value)(context);

  const systemPrompt = compile(data.system_prompt);
  const userPrompt = compile(data.user_prompt);

  try {
    const completion = await groq.chat.completions.create({
      model: data.model,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const output =
      completion.choices[0]?.message?.content ?? "";

    return {
      output,
      finish_reason: completion.choices[0]?.finish_reason,
    };
  } catch (err) {
    throw new NonRetriableError(
      err instanceof Error ? err.message : "Groq request failed",
    );
  }
};