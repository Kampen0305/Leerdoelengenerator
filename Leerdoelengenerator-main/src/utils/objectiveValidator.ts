// src/utils/objectiveValidator.ts
import { LEVEL_PROFILES, LevelKey } from "../domain/levelProfiles";

export type ValidationIssue =
  | "VERB_NOT_ALLOWED_FOR_LEVEL"
  | "MISSING_CONTEXT"
  | "MISSING_CRITERIA"
  | "MISSING_AUTONOMY"
  | "TOO_SHORT"
  | "TOO_LONG";

export type ValidationResult = {
  ok: boolean;
  issues: { code: ValidationIssue; message: string }[];
};

const startsWithVerb = (text: string, allowedVerbs: string[]) => {
  const firstWord = text.trim().split(/\s+/)[0]?.toLowerCase();
  return allowedVerbs.some(v => v.toLowerCase() === firstWord);
};

export function validateObjective(text: string, level: LevelKey): ValidationResult {
  const t = text.trim();
  const profile = LEVEL_PROFILES[level];

  const allAllowedVerbs = [
    ...profile.verbBands.rememberUnderstand,
    ...profile.verbBands.apply,
    ...profile.verbBands.analyze,
    ...profile.verbBands.evaluate,
    ...profile.verbBands.create,
  ].filter(v => v !== "--");

  const issues: ValidationResult["issues"] = [];

  if (t.split(/\s+/).length < profile.lengthGuideline.minWords) {
    issues.push({ code: "TOO_SHORT", message: "Leerdoel is te kort voor dit niveau." });
  }
  if (t.split(/\s+/).length > profile.lengthGuideline.maxWords) {
    issues.push({ code: "TOO_LONG", message: "Leerdoel is te lang; formuleer compacter." });
  }
  if (!startsWithVerb(t, allAllowedVerbs)) {
    issues.push({
      code: "VERB_NOT_ALLOWED_FOR_LEVEL",
      message: "Begin met een passend, meetbaar werkwoord voor dit niveau.",
    });
  }
  const hasContext =
    /\b(in|binnen|op|tijdens)\b/i.test(t) || profile.contextHints.some(h => t.toLowerCase().includes(h.split(" ")[0]));
  if (!hasContext) {
    issues.push({ code: "MISSING_CONTEXT", message: "Voeg een context/voorwaarde toe (bijv. 'in de werkplaats')." });
  }
  const hasCriteria = /\b(volgens|conform|op basis van|gebaseerd op|met behulp van)\b/i.test(t);
  if (!hasCriteria) {
    issues.push({ code: "MISSING_CRITERIA", message: "Noem een criterium/kwaliteit (bijv. 'volgens checklist')." });
  }
  const hasAutonomy = /\b(onder begeleiding|met beperkte begeleiding|zelfstandig|toenemende zelfstandigheid)\b/i.test(t);
  if (!hasAutonomy) {
    issues.push({ code: "MISSING_AUTONOMY", message: "Noem mate van zelfstandigheid/begeleiding." });
  }

  return { ok: issues.length === 0, issues };
}

