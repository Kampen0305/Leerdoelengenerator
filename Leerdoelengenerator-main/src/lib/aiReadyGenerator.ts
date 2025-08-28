import { BLOOM_RULES } from "./bloomRules";
import { laneFor } from "./laneRules";
import { trackAiReadyGoal } from "./ga";
import type {
  AiReadyGoalRequest,
  AiReadyGoalResponse,
  BloomLevel,
} from "@/types/learningGoals";

function inferBloomByRules(
  text: string
): { level: BloomLevel; verb: string; matched: string[] } | null {
  for (const group of BLOOM_RULES) {
    for (const re of group.verbs) {
      const m = text.match(re);
      if (m) return { level: group.level, verb: m[0], matched: [`verb:${re}`] };
    }
  }
  return null;
}

// Optioneel: LLM fallback (indien beschikbaar in je stack). Anders default op "apply".
async function llmInferBloom(_text: string): Promise<BloomLevel> {
  // Pseudocode: vervang door jouw LLM-call
  // const out = await llm.classifyBloom(text)
  // return out.level as BloomLevel
  return "apply";
}

function normalizeTimeframe(days?: number): string {
  const d = days && days > 0 ? days : 10;
  return d === 1 ? "binnen 1 dag" : `binnen ${d} dagen`;
}

function defaultMinWords(raw: string, hinted?: number): number {
  if (typeof hinted === "number") return hinted;
  // heuristiek: schrijf/verslag/essay → 300
  return /schrijf|verslag|betoog|essay/i.test(raw) ? 300 : 0;
}

export async function generateAiReadyGoal(
  req: AiReadyGoalRequest
): Promise<AiReadyGoalResponse> {
  const raw = (req.rawGoal || "").trim();
  if (!raw) throw new Error("Geen leerdoel opgegeven.");

  const ruleGuess = inferBloomByRules(raw);
  const bloom: BloomLevel = ruleGuess?.level ?? (await llmInferBloom(raw));
  const lane = laneFor(bloom);

  const timeframe = normalizeTimeframe(req.timeframeDays);
  const minWords = defaultMinWords(raw, req.minWords);
  const context = req.context ? ` (${req.context})` : "";
  const domain = req.domain ? ` in de context ${req.domain}` : "";

  // Templates (compact, meetbaar, criterium, (on)afhankelijkheid, AI-statement)
  let aiReadyGoal = "";
  let aiStatement = "";
  const rubric: string[] = [];
  const warnings: string[] = [];

  const criteriaSuffix =
    minWords > 0 ? `, minimaal ${minWords} woorden` : "";
  const timeframeSuffix = `, ${timeframe}`;

  if (lane === "baan1") {
    aiReadyGoal =
      `Kan zelfstandig ${raw
        .replace(/^de student kan\s*/i, "")
        .replace(/^een\s*/i, "")}${domain}` +
      `${criteriaSuffix}${timeframeSuffix}, zonder inzet van AI.`;

    aiStatement =
      "AI-gebruik is bij dit leerdoel niet toegestaan (baan 1). De student toont individuele beheersing aan " +
      "zonder AI-ondersteuning.";

    rubric.push(
      "Start met passend werkwoord voor het niveau",
      "Uitvoering zonder AI (bewijs van zelfstandige beheersing)",
      "Voldoende kwaliteit conform checklist/criteria",
      timeframe.includes("dag")
        ? "Binnen gestelde tijd voltooid"
        : "Binnen afgesproken periode voltooid"
    );
  } else {
    aiReadyGoal =
      `Kan met ondersteuning van AI ${raw
        .replace(/^de student kan\s*/i, "")
        .replace(/^een\s*/i, "")}${domain}` +
      `${criteriaSuffix}${timeframeSuffix}, inclusief verantwoording van AI-inzet en eigen keuzes.`;

    aiStatement =
      "AI-gebruik is toegestaan en gewenst (baan 2). De student documenteert prompts, versies en " +
      "beoordeelt AI-output kritisch op juistheid, bias en toepasbaarheid.";

    rubric.push(
      "Transparante inzet van AI (prompts/iteraties gelogd)",
      "Kritische beoordeling van AI-output (juistheid/bias)",
      "Eigen analyse, keuzes en aanpassingen aantoonbaar",
      "Productkwaliteit conform checklist/criteria",
      timeframe.includes("dag")
        ? "Binnen gestelde tijd voltooid"
        : "Binnen afgesproken periode voltooid"
    );
  }

  // Kwaliteitswaarschuwingen (kort & krachtig)
  if (aiReadyGoal.length > 360) warnings.push("Leerdoel is lang; formuleer compacter.");
  if (!/^Kan\b/i.test(aiReadyGoal))
    warnings.push("Begin met 'Kan' + werkwoord (meetbaar).");
  if (!/AI/.test(aiStatement))
    warnings.push("Noem expliciet de rol van AI in het statement.");

  const response: AiReadyGoalResponse = {
    bloom,
    lane,
    aiReadyGoal,
    aiStatement,
    rubricCriteria: rubric,
    warnings,
    trace: {
      verb: ruleGuess?.verb ?? "LLM",
      matchedRules: ruleGuess?.matched ?? ["fallback:llm"],
      usedLLM: !ruleGuess,
    },
  };

  trackAiReadyGoal(bloom, lane, !ruleGuess);

  return response;
}

