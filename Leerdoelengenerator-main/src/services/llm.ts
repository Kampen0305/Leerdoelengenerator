import type { LearningObjectiveContext, KDContext, GeminiResponse } from "./gemini";
import { geminiService } from "./gemini";
import { enforceDutchAndSMART, PostProcessedResponse } from "../lib/format";

/**
 * Wrapper rond het LLM dat de rauwe modelrespons normaliseert.
 */
export async function generateNormalizedObjective(
  ctx: LearningObjectiveContext,
  kd?: KDContext
): Promise<PostProcessedResponse> {
  const raw: GeminiResponse = await geminiService.generateAIReadyObjective(ctx, kd);
  return enforceDutchAndSMART(raw, ctx.lane ?? "baan1");
}

export const llmService = { generateNormalizedObjective };
