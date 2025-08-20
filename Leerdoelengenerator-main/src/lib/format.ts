import { normalizeObjective } from "./nlGoals";

export interface SMARTCheck {
  badge: "✅" | "❌";
  issues: string[];
}

export interface PostProcessedResponse {
  newObjective: string;
  rationale: string;
  activities: string[];
  assessments: string[];
  aiLiteracy: string;
  bloom?: string;
  aiLiteracyFocus: string[];
  smart: SMARTCheck;
  warnings: string[];
}

/**
 * Enforce Dutch language and SMART criteria on a model response.
 * Also adds Baan labels to assessments and injects a section on AI literacy
 * (kritisch denken, ethiek). Inspired by Npuls Two-Lane approach and AI-GO checklists.
 */
export function enforceDutchAndSMART(
  res: {
    newObjective: string;
    rationale: string;
    activities: string[];
    assessments: string[];
    aiLiteracy?: string;
    bloom?: string;
  },
  lane: "baan1" | "baan2" = "baan1"
): PostProcessedResponse {
  const warnings: string[] = [];

  // Basic language normalisation: replace some common English terms
  const replaceEnglish = (txt: string): string => {
    return txt
      .replace(/\bgoal\b/gi, "doel")
      .replace(/\bactivity\b/gi, "activiteit")
      .replace(/\bassessment\b/gi, "toets")
      .replace(/\bstudent\b/gi, "student");
  };

  const newObjective = normalizeObjective(replaceEnglish(res.newObjective.trim()));
  let rationale = replaceEnglish(res.rationale.trim());
  let activities = res.activities.map(a => replaceEnglish(a.trim())).filter(Boolean);
  let assessments = res.assessments.map(a => replaceEnglish(a.trim())).filter(Boolean);
  const aiLiteracy = replaceEnglish(res.aiLiteracy?.trim() || "");
  const bloom = res.bloom?.trim();

  const englishPattern = /\b(the|and|with|without|to|for|on)\b/i;
  if (englishPattern.test([newObjective, rationale, activities.join(" "), assessments.join(" "), aiLiteracy].join(" "))) {
    warnings.push("Niet alle tekst is in het Nederlands.");
  }

  // SMART checks
  const issues: string[] = [];
  if (!/\bkan\b/i.test(newObjective)) issues.push("Geen actief werkwoord.");
  if (!/\b(in|binnen)\b/i.test(newObjective)) issues.push("Geen context.");
  if (!/(\d+\s*(%|keer)?|minstens|maximaal|criterium|score|cijfer)/i.test(newObjective)) {
    issues.push("Geen meetcriterium.");
  }
  if (!/\b(als|wanneer|mits|onder)\b/i.test(newObjective)) issues.push("Geen condities.");

  const improvement = /\b(optimaliseer|optimaliseren|verbeter|verbeteren)\b/i;
  if (improvement.test(newObjective) && !/(\d+\s*(%|keer)?|criterium|score|cijfer)/i.test(newObjective)) {
    issues.push("Verbeteren/optimaliseren zonder meetcriterium.");
  }

  const smartBadge: "✅" | "❌" = issues.length === 0 ? "✅" : "❌";

  // Rationale <= 80 words
  const wordList = rationale.split(/\s+/);
  if (wordList.length > 80) {
    rationale = wordList.slice(0, 80).join(" ");
    warnings.push("Rationale ingekort tot 80 woorden.");
  }

  // Ensure 3-5 activities
  if (activities.length < 3 || activities.length > 5) {
    warnings.push("Aantal leeractiviteiten buiten 3–5.");
  }
  activities = activities.slice(0, 5);
  while (activities.length < 3) activities.push("N.t.b.");

  // Ensure 2-4 assessments with lane labels
  if (assessments.length < 2 || assessments.length > 4) {
    warnings.push("Aantal toetsvormen buiten 2–4.");
  }
  assessments = assessments.slice(0, 4).map(a => {
    if (/baan\s*[12]/i.test(a)) return a.replace(/^(Baan\s*[12]\s*:?)\s*/i, (m) => m.trim() + ": ");
    return `${lane === "baan2" ? "Baan 2" : "Baan 1"}: ${a}`;
  });
  while (assessments.length < 2) {
    assessments.push(`${lane === "baan2" ? "Baan 2" : "Baan 1"}: N.t.b.`);
  }

  // AI literacy indicators
  const allText = [newObjective, ...activities, ...assessments, aiLiteracy].join(" ").toLowerCase();
  const indicators = ["kritisch denken", "ethiek"];
  const missingIndicators = indicators.filter(ind => !allText.includes(ind));
  const aiLiteracyFocus = missingIndicators;
  if (missingIndicators.length > 0) {
    warnings.push("AI-geletterdheid indicatoren ontbreken.");
  }

  return {
    newObjective,
    rationale,
    activities,
    assessments,
    aiLiteracy,
    bloom,
    aiLiteracyFocus,
    smart: { badge: smartBadge, issues },
    warnings,
  };
}

export default enforceDutchAndSMART;
