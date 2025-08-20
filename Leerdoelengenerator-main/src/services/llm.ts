import type { KDContext, GeminiResponse } from "./gemini";
import type { LearningObjectiveContext } from "../types/context";
import { geminiService } from "./gemini";
import { enforceDutchAndSMART, PostProcessedResponse } from "../lib/format";

/**
 * Probeer eenvoudige JSON-fouten te herstellen. Strip bijvoorbeeld
 * codeblokken en losse komma's. Geeft een gerepareerde string terug of null.
 */
function tryFixJson(raw: string): string | null {
  try {
    JSON.parse(raw);
    return raw;
  } catch {
    try {
      const cleaned = raw
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/, "")
        .replace(/,\s*}/g, "}")
        .replace(/,\s*]/g, "]")
        .trim();
      JSON.parse(cleaned);
      return cleaned;
    } catch {
      return null;
    }
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("TIMEOUT")), ms)
    ),
  ]);
}

/**
 * Wrapper rond het LLM dat de rauwe modelrespons normaliseert.
 */
export async function generateNormalizedObjective(
  ctx: LearningObjectiveContext,
  kd?: KDContext
): Promise<PostProcessedResponse> {
  let autoFixed = false;
  let raw: GeminiResponse | string;
  try {
    raw = await withTimeout(
      geminiService.generateAIReadyObjective(ctx, kd),
      15000
    );
  } catch (err: any) {
    if (err?.message === "TIMEOUT") {
      throw new Error("Probeer korter origineel leerdoel");
    }
    throw err;
  }

  let data: GeminiResponse;
  if (typeof raw === "string") {
    try {
      data = JSON.parse(raw);
    } catch {
      const fixed = tryFixJson(raw);
      if (!fixed) {
        throw new Error("Model produceerde ongeldige JSON");
      }
      data = JSON.parse(fixed);
      autoFixed = true;
    }
  } else {
    data = raw;
  }

  const processed = enforceDutchAndSMART(data, ctx.lane ?? "baan1");
  if (autoFixed) {
    processed.warnings.unshift("Automatisch hersteld");
  }
  if (ctx.education === "VO" || ctx.education === "VSO") {
    const repl = (txt: string) =>
      txt.replace(/studenten?/gi, (m) => (m.toLowerCase().endsWith("en") ? "leerlingen" : "leerling"));
    processed.newObjective = repl(processed.newObjective);
    processed.rationale = repl(processed.rationale);
    processed.activities = processed.activities.map(repl);
    processed.assessments = processed.assessments.map(repl);
    processed.aiLiteracy = repl(processed.aiLiteracy);
  }
  return processed;
}

export const llmService = { generateNormalizedObjective };
