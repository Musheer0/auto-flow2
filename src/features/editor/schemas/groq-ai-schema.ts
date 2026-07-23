import z from "zod";
import Groq from 'groq-sdk'
export const GROQ_MODELS = {
  GPT_OSS_20B: "openai/gpt-oss-20b",
  GPT_OSS_120B: "openai/gpt-oss-120b",
  COMPOUND_BETA: "compound-beta",
  COMPOUND_BETA_MINI: "compound-beta-mini",
  GEMMA2_9B_IT: "gemma2-9b-it",
  LLAMA_3_1_8B_INSTANT: "llama-3.1-8b-instant",
  LLAMA_3_3_70B_VERSATILE: "llama-3.3-70b-versatile",
  LLAMA_4_MAVERICK: "meta-llama/llama-4-maverick-17b-128e-instruct",
  LLAMA_4_SCOUT: "meta-llama/llama-4-scout-17b-16e-instruct",
  LLAMA_GUARD_4_12B: "meta-llama/llama-guard-4-12b",
  KIMI_K2: "moonshotai/kimi-k2-instruct",
  QWEN3_32B: "qwen/qwen3-32b",
  QWEN3_6_27B: "qwen/qwen3.6-27b",
} as const;

export type GroqModel = (typeof GROQ_MODELS)[keyof typeof GROQ_MODELS]
export const groqAiSchema = z.object({
    api_key: z.string(),
    system_prompt:z.string(),
    user_prompt:z.string(),
    model :z.enum(GROQ_MODELS)
})