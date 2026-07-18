import { z } from "zod";

export const methods = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
] as const;

export const keyValueSchema = z.object({
  key: z.string(),
  value: z.string(),
});

export const httpRequestSchema = z.object({
  url: z.url("Enter a valid URL, including https://"),
  method: z.enum(methods),
  headers: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
    })
  ),
  body: z.string(),
});

export type HttpRequestFormSchemaT = z.infer<typeof httpRequestSchema>;