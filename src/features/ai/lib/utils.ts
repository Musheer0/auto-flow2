import { LanguageModelUsage } from "ai";



export function getTokensUsed(usage: LanguageModelUsage): number {
  if (!usage) return 0;

  return (
    usage.totalTokens ??
    (usage.inputTokens ?? 0) + (usage.outputTokens ?? 0)
  );
}