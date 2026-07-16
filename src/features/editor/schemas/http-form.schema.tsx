import { z } from "zod";
export const httpMethodSchema = z.enum([
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
]);

export const keyValueSchema = z.object({
  key: z.string(),
  value: z.string(),
});

export const httpRequestSchema = z.object({
  url: z.url("Please enter a valid URL"),
  method: httpMethodSchema.default("GET"),
  headers: z.array(keyValueSchema).default([]),
  query: z.array(keyValueSchema).default([]),
  body: z.string().default(""),
});

export type HttpRequestFormSchemaT = z.infer<typeof httpRequestSchema>;