// src/services/gemini.ts
import { askGeminiFlash } from "@/lib/gemini";
import type { LearningObjectiveContext } from "../types/context";
import { LEVEL_PROFILES, LevelKey } from "../domain/levelProfiles";
import { validateObjective } from "../utils/objectiveValidator";

/**
 * Types
 */
export interface GeminiResponse {
  newObjective: string;
  rationale: string;
  activities: string[];
  assessments: string[];
  aiLiteracy: string;
  bloom?: string;
}

export interface KDContext {
  title?: string;
  code?: string;
  relatedCompetencies?: Array<{ title: string }>;
  relatedWorkProcesses?: Array<{ title: string }>;
}

const GEMINI_ROUTE = "/api/gemini";
let lastAvailable = false;

/**
 * Klein hulpmiddel om KD-context leesbaar in de prompt te zetten
 */
function formatKD(kd?: KDContext): string {
  if (!kd) return "";
  const comp = kd.relatedCompetencies?.map(c => `- ${c.title}`).join("\n") || "- (geen)";
  const wp = kd.relatedWorkProcesses?.map(w => `- ${w.title}`).join("\n") || "- (geen)";
  return [
    "\nKD-context:",
    `KD titel: ${kd.title ?? "(onbekend)"}`,
    `KD code: ${kd.code ?? "(onbekend)"}`,
    `Gerelateerde competenties:\n${comp}`,
    `Gerelateerde werkprocessen:\n${wp}`
  ].join("\n");
}

export function buildPrompt(ctx: LearningObjectiveContext, kd?: KDContext): string {
  const laneLabel = ctx.lane === "baan2" ? "Baan 2" : "Baan 1";
  const kdBlock = kd ? formatKD(kd) : "";
  const isVO = ctx.education === "VO";
  const needsLearner = ctx.education === "VO" || ctx.education === "VSO";
  const contextLine = isVO
    ? `- Onderwijs: ${ctx.education} | VO-niveau: ${ctx.voLevel} | Leerjaar: ${ctx.voGrade} | Domein: ${ctx.domain} | Baan: ${laneLabel}`
    : ctx.education === "VSO"
      ? `- Sector: ${ctx.education} | Niveau: ${ctx.level} | Cluster: ${ctx.vsoCluster} | Domein: ${ctx.domain} | Baan: ${laneLabel}`
      : `- Sector: ${ctx.education} | Niveau: ${ctx.level} | Domein: ${ctx.domain} | Baan: ${laneLabel}`;
  const learnerLines = needsLearner
    ? [
      "Formuleer leerdoelen activerend en observeerbaar in correct Nederlands.",
      "Gebruik het woord 'leerling' in plaats van 'student'.",
      "Koppel waar passend aan toetbare criteria (formatief/summatief).",
    ]
    : [];
  const sectorLines =
    ctx.education === "VSO"
      ? [
        "Je schrijft leerdoelen voor het Voortgezet Speciaal Onderwijs (VSO).",
        "Houd rekening met handelingsgericht en passend onderwijs.",
        'Differentiatie per leerroute: ' + ctx.level + '.',
        'Cluster: ' + ctx.vsoCluster + '.',
        "Gebruik concrete, observeerbare gedragsindicatoren en realistische contexten.",
      ]
      : ctx.education === "HBO" && ctx.level === "Master"
        ? [
          "Je schrijft leeruitkomsten op HBO-masterniveau:",
          "- Kennisontwikkeling en onderzoekend vermogen",
          "- Kritische reflectie, innovatie en complex probleemoplossen",
          "- Professionele standaard, ethiek en evidence-informed handelen",
          "- Hoge mate van zelfstandigheid en leiderschap",
        ]
        : [];
  return [
    "Je bent een onderwijskundige assistent. Schrijf ALLES in natuurlijk Nederlands.",
    ...learnerLines,
    ...sectorLines,
    "Doel: herschrijf het oorspronkelijke leerdoel naar één SMART leerdoel, en lever: rationale, 3–5 leeractiviteiten, 2–4 toetsvormen met label [Baan 1] of [Baan 2].",
    "Kaders:",
    "- Constructive alignment; Two-Lane approach (Baan 1=besluitvormend, beperkte AI; Baan 2=ontwikkelingsgericht, AI toegestaan/verplicht).",
    "- AI-geletterdheid (AI-GO): benoem kort welke kennis/vaardigheden/ethiek aan bod komen.",
    "- Referentiekader 2.0: wees transparant en ethisch; geen persoonsgegevens; geen hallucinaties.",
    "Eisen:",
    "- 1 leerdoel, actief werkwoord + context + meetcriterium + condities + tijd.",
    "- Geen Engels.",
    "- Vermijd vage woorden (“optimaliseren”, “begrijpen”) zonder meetbare specificatie.",
    "Input:",
    `- Oorspronkelijk leerdoel: ${ctx.original}`,
    contextLine,
    kdBlock,
    "Output JSON:",
    "{",
    ' "newObjective": "...",',
    ' "rationale": "... (≤80 woorden)",',
    ' "activities": ["…","…","…"],',
    ' "assessments": ["[Baan X] …","…"],',
    ' "bloom": "apply",',
    ' "aiLiteracy": "Kernpunten (kritisch denken/ethiek/vaardigheden)"',
    "}"
  ].filter(Boolean).join("\n");
}

/**
 * Snelle check of de Gemini API bruikbaar is (key + simpele call).
 */
export async function checkGeminiAvailable(): Promise<boolean> {
  try {
    const text = await askGeminiFlash("Antwoord uitsluitend met: OK");
    const ok = text.trim().toUpperCase().includes("OK");
    if (ok) {
      lastAvailable = true;
      console.info("[AI-check] Gemini online via route:", GEMINI_ROUTE);
    } else {
      lastAvailable = false;
    }
    return ok;
  } catch (e) {
    console.error("[gemini] Beschikbaarheidscheck faalde:", e);
    lastAvailable = false;
    return false;
  }
}

/**
 * Hoofdfunctie: genereer een AI-ready leerdoel en bijbehorende activiteiten/toetsing.
 */
export async function generateAIReadyObjective(
  ctx: LearningObjectiveContext,
  kd?: KDContext
): Promise<GeminiResponse> {
  const prompt = buildPrompt(ctx, kd);

  try {
    const responseText = await askGeminiFlash(prompt);
    const raw = responseText.trim();

    if (!raw) {
      throw new Error("Lege respons van model.");
    }

    let data: any;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      console.error("[Gemini] JSON Parse Error. Raw response:", raw);
      const cleaned = raw
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/, "")
        .trim();

      try {
        data = JSON.parse(cleaned);
      } catch (e2) {
        console.error("[Gemini] Cleaned JSON Parse Error:", e2);
        throw new Error("Kon JSON niet parsen. Mogelijk afgekapt.");
      }
    }

    const safe: GeminiResponse = {
      newObjective: String(data.newObjective ?? ""),
      rationale: String(data.rationale ?? ""),
      activities: Array.isArray(data.activities) ? data.activities.map(String) : [],
      assessments: Array.isArray(data.assessments) ? data.assessments.map(String) : [],
      aiLiteracy: String(data.aiLiteracy ?? ""),
      bloom: data.bloom ? String(data.bloom) : undefined
    };

    if (!safe.newObjective || safe.activities.length === 0 || !safe.aiLiteracy) {
      throw new Error("Onvolledige JSON-respons ontvangen van model.");
    }

    lastAvailable = true;
    return safe;
  } catch (err: any) {
    lastAvailable = false;
    const msg =
      err?.message?.includes("Invalid JSON payload received")
        ? "Fout in API-aanroep: controleer de meegestuurde velden."
        : err?.message || String(err);

    console.error("[gemini] generateAIReadyObjective error:", err);
    throw new Error(msg);
  }
}

export async function generateObjective(ctx: {
  original: string;
  education: string;
  levelKey: LevelKey;
  domain: string;
  productOrProcess?: string;
}) {
  const profile = LEVEL_PROFILES[ctx.levelKey];

  const strictRules = `
TAAL & FORMAT:
- Schrijf in natuurlijk, professioneel Nederlands.
- Begin met een meetbaar actie-werkwoord dat is toegestaan voor het niveau.
- Structureer als: [werkwoord] + [taak/inhoud] + [context/voorwaarden] + [criteria/kwaliteit] + [mate van zelfstandigheid] + [beoordeling].
- 1 zin, zonder opsommingstekens. Houd lengte ~${profile.lengthGuideline.minWords}–${profile.lengthGuideline.maxWords} woorden.

NIVEAU & COMPLEXITEIT:
- Toegestane werkwoord-banden: ${profile.allowedBands.join(", ")}.
- Voorbeelden (niet kopiëren, wel als stijlreferentie): ${profile.examples.join(" | ")}

CRITERIA:
- Gebruik criteriamarkers zoals: ${profile.criteriaMarkers.join(", ")}.
- Noem expliciet zelfstandigheid/begeleiding: ${profile.autonomyPhrases.join(", ")}.
`;

  const allowedVerbs = [
    ...profile.verbBands.rememberUnderstand,
    ...profile.verbBands.apply,
    ...profile.verbBands.analyze,
    ...profile.verbBands.evaluate,
    ...profile.verbBands.create,
  ].filter(v => v !== "--");

  const system = `Je bent een onderwijsontwerper. Maak leerdoelen die passen bij ${profile.label}.`;
  const user = `
Origineel leerdoel: "${ctx.original}"
Niveau: ${profile.label}
Vak/domein: ${ctx.domain}
Product/proces: ${ctx.productOrProcess ?? "n.v.t."}

Beschikbare werkwoorden voor dit niveau (begin hiermee): ${allowedVerbs.join(", ")}

${strictRules}
Genereer precies 1 leerdoel.`;

  const trimmedUser = user.trim();
  const basePrompt = `${system}\n\n${trimmedUser}`;

  try {
    let result = (await askGeminiFlash(basePrompt)).trim().replace(/\s+/g, " ");
    let check = validateObjective(result, ctx.levelKey);
    if (!check.ok) {
      const fixPrompt = `
Herzie het leerdoel zodat alle issues opgelost zijn:
Issues: ${check.issues.map(i => i.message).join("; ")}
Houd je strikt aan de niveauprofiel-regels en begin met een toegestaan werkwoord.
Genereer precies 1 leerdoel.`;
      const revisedPrompt = `${system}\n\n${trimmedUser}\n\n${fixPrompt}`;
      const revised = await askGeminiFlash(revisedPrompt);
      result = revised.trim().replace(/\s+/g, " ");
    }
    lastAvailable = true;
    return result;
  } catch (err) {
    lastAvailable = false;
    throw err;
  }
}

export const geminiService = {
  isAvailable: () => lastAvailable,
  generateAIReadyObjective,
};
