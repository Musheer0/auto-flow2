import { z, type ZodObject, type ZodType } from "zod";
import type { NodeType } from "@/generated/prisma/enums";
import { httpRequestSchema } from "../schemas/http-form.schema";
import { sendEmailSchema } from "../schemas/send-email.schema";
import { sendDiscordMessageSchema } from "../schemas/send-discord-message.schema";
import { telegramSendMessageSchema } from "../schemas/send-telegram-message.schema";
import { groqAiSchema } from "../schemas/groq-ai-schema";
import { YoutubePubSubSchema } from "../schemas/youtube-pubsubhubhub-schema";
export const NodeSchemas: Record<NodeType, ZodObject | null> = {
    MANUAL_TRIGGER: null,
    HTTP_REQUEST: httpRequestSchema,
    SEND_TELEGRAM_MESSAGE: telegramSendMessageSchema,
    SEND_EMAIL: sendEmailSchema,
    SEND_DISCORD_MESSAGE: sendDiscordMessageSchema,
    WEBHOOK: null,
    GROQ_AI:groqAiSchema,
    PUBSUBHUBBUB:YoutubePubSubSchema,
    GOOGLE_FORMS:null
};

function unwrap(schema: ZodType): ZodType {
  while (
    schema instanceof z.ZodOptional ||
    schema instanceof z.ZodNullable ||
    schema instanceof z.ZodDefault
  ) {
    schema = schema.unwrap() as z.ZodType;
  }

  return schema;
}

function describeField(schema: ZodType): string {
  schema = unwrap(schema);

  if (schema instanceof z.ZodString) return "string";

  if (schema instanceof z.ZodNumber) return "number";

  if (schema instanceof z.ZodBoolean) return "boolean";

  if (schema instanceof z.ZodArray) return "array";

  if (schema instanceof z.ZodObject) return "object";

  if (schema instanceof z.ZodEnum) {
    return `enum (${schema.options.join(" | ")})`;
  }

  return "unknown";
}

export function generateSchemaDocs(
  schemas: Record<string, ZodObject | null>
) {
  return Object.entries(schemas)
    .map(([type, schema]) => {
      if (!schema) {
        return `### ${type}

user_data:
{}
`;
      }

      const fields = Object.entries(schema.shape)
        .map(([key, value]) => `- ${key}: ${describeField(value)}`)
        .join("\n");

      return `### ${type}

Fields:
${fields}
`;
    })
    .join("\n");
}
export const schemaPrompt = generateSchemaDocs(NodeSchemas)