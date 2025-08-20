export const vagueVerbMap: Record<string, string> = {
  "begrijpt": "verklaart",
  "begrijpen": "verklaren",
  "weet": "beschrijft",
  "weten": "beschrijven",
  "kent": "beschrijft",
  "kennen": "beschrijven",
  "leert": "oefent",
  "leren": "oefenen"
};

/**
 * Normalize a Dutch learning objective so it matches common conventions:
 * - Replace vague verbs with observable alternatives
 * - Ensure context ("in [situatie]") and criterion ("volgens [criterium]")
 *   placeholders when missing
 */
export function normalizeObjective(text: string): string {
  if (!text) return "";
  let result = text.trim();

  // Replace vague verbs
  for (const [vague, observable] of Object.entries(vagueVerbMap)) {
    const rx = new RegExp(`\\b${vague}\\b`, "i");
    if (rx.test(result)) {
      result = result.replace(rx, observable);
      break;
    }
  }

  // Check context presence
  const hasContext = /\b(in|binnen)\b/i.test(result);
  if (!hasContext) {
    result = `${result} in [situatie]`;
  }

  // Check criterion presence (numbers, percentage, criterium, volgens)
  const hasCriterion = /(\d+\s*(%|keer)?|criterium|score|cijfer|volgens)/i.test(result);
  if (!hasCriterion) {
    result = `${result} volgens [criterium]`;
  }

  return result.trim();
}

export default normalizeObjective;
