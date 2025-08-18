// src/services/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Types
 */
export interface GeminiResponse {
  newObjective: string;
  rationale: string;
  activities: string[];
  assessments: string[];
}

export interface LearningObjectiveContext {
  original: string;               // Origineel leerdoel / opdracht
  education: string;              // bv. "MBO"
  level: string;                  // bv. "niveau 3"
  domain: string;                 // vak/sector
  assessment?: string;            // (optioneel) toetsvorm
  lane?: "baan1" | "baan2";       // workflow-variant
}

export interface KDContext {
  title?: string;
  code?: string;
  relatedCompetencies?: Array<{ title: string }>;
  relatedWorkProcesses?: Array<{ title: string }>;
}

/**
 * Config
 */
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
if (!API_KEY) {
  // Niet crashen, maar wel duidelijke waarschuwing
  // (bouw blijft werken; runtime logs vertellen wat er mist)
  console.warn("[gemini] VITE_GEMINI_API_KEY ontbreekt.");
}

const MODEL_NAME = "gemini-1.5-flash"; // snel en goedkoop; desgewenst: "gemini-1.5-pro"

const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Vocabulaire/termunen die elders in de app worden gebruikt.
 * (Voorkomt ReferenceError: autonomieTerms is not defined)
 */
const autonomieTerms = [
  "zelfstandig", "eigen regie", "zelf keuzes maken", "initiatief nemen",
  "plannen en organiseren", "verantwoordelijkheid nemen"
];

const samenwerkTerms = [
  "samenwerken", "communiceren", "afstemmen", "feedback geven en ontvangen"
];

const reflectieTerms = [
  "reflecteren", "leerdoelen bijstellen", "eigen handelen evalueren"
];

/**
 * Klein hulpmiddel om KD-context leesbaar in de prompt te zetten
 */
function formatKD(kd?: KDContext): string {
  if (!kd) return "Geen KD-context aangeleverd.";
  const comp = kd.relatedCompetencies?.map(c => `- ${c.title}`).join("\n") || "- (geen)";
  const wp   = kd.relatedWorkProcesses?.map(w => `- ${w.title}`).join("\n") || "- (geen)";
  return [
    `KD titel: ${kd.title ?? "(onbekend)"}`,
    `KD code: ${kd.code ?? "(onbekend)"}`,
    `Gerelateerde competenties:\n${comp}`,
    `Gerelateerde werkprocessen:\n${wp}`
  ].join("\n");
}

/**
 * System-instructie
 */
const SYSTEM_INSTRUCTION = [
  "Je bent een onderwijsassistent voor MBO-docenten.",
  "Je herschrijft of concretiseert leerdoelen zodat ze SMART, uitvoerbaar en toetsbaar zijn.",
  "Gebruik heldere, korte zinnen. Vermijd jargon.",
  "Schrijf in het Nederlands."
].join(" ");

/**
 * JSON schema dat we van het model terug verwachten
 */
const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    newObjective: { type: "string", description: "Het verbeterde/concrete leerdoel in 1 zin." },
    rationale:    { type: "string", description: "Waarom dit leerdoel zo is geformuleerd." },
    activities:   { type: "array", items: { type: "string" }, description: "3–6 les/leeractiviteiten." },
    assessments:  { type: "array", items: { type: "string" }, description: "2–4 toets- of beoordelingssuggesties." }
  },
  required: ["newObjective", "rationale", "activities", "assessments"]
} as const;

/**
 * Bouwt de prompt op basis van context + KD-gegevens
 */
function buildPrompt(ctx: LearningObjectiveContext, kd?: KDContext): string {
  const laneLine =
    ctx.lane === "baan2"
      ? "Focus extra op authentic assessment en praktijknabij toetsen."
      : "Houd het compact en direct toepasbaar in de lespraktijk.";

  return [
    `SYSTEEM: ${SYSTEM_INSTRUCTION}`,
    "",
    `Onderwijs: ${ctx.education}, niveau: ${ctx.level}, domein: ${ctx.domain}.`,
    laneLine,
    "",
    "Beschikbare terminologie (ter inspiratie, niet verplicht):",
    `- Autonomie: ${autonomieTerms.join(", ")}`,
    `- Samenwerken: ${samenwerkTerms.join(", ")}`,
    `- Reflectie: ${reflectieTerms.join(", ")}`,
    "",
    "KD-context:",
    formatKD(kd),
    "",
    "Origineel leerdoel/opdracht:",
    ctx.original,
    "",
    "Gevraagde output: JSON met de sleutels newObjective, rationale, activities, assessments.",
    "Vermijd extra tekst buiten de JSON."
  ].join("\n");
}

/**
 * Publieke API
 */

/** Snelle check of de Gemini API bruikbaar is (key + simpele call). */
export async function checkGeminiAvailable(): Promise<boolean> {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const res = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: "Antwoord uitsluitend met: OK" }]}],
      generationConfig: { temperature: 0.1, maxOutputTokens: 8 }
    });
    const txt = res.response.text().trim();
    return txt.toUpperCase().includes("OK");
  } catch (e) {
    console.error("[gemini] Beschikbaarheidscheck faalde:", e);
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
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const prompt = buildPrompt(ctx, kd);

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }]}],
      // Belangrijk: GEEN responseMimeType gebruiken (geeft 400 bij sommige endpoints/SDK's)
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 800
      },
      // Forceer JSON-structuur via schema (betrouwbaarder dan 'responseMimeType')
      responseSchema: RESPONSE_SCHEMA as any
    });

    // Bij responseSchema levert de SDK nog steeds tekst terug; meestal is dat al geldige JSON
    const raw = (result.response?.text?.() ?? "").trim();

    if (!raw) {
      throw new Error("Lege respons van model.");
    }

    // Probeer te parsen; als het mislukt, toon een zinvolle fout
    let data: any;
    try {
      data = JSON.parse(raw);
    } catch {
      // Soms geeft het model codeblokken – strip die eerst
      const cleaned = raw
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/, "")
        .trim();

      data = JSON.parse(cleaned);
    }

    // Type-narrowing + defaults
    const safe: GeminiResponse = {
      newObjective: String(data.newObjective ?? ""),
      rationale: String(data.rationale ?? ""),
      activities: Array.isArray(data.activities) ? data.activities.map(String) : [],
      assessments: Array.isArray(data.assessments) ? data.assessments.map(String) : []
    };

    // Minimale validatie
    if (!safe.newObjective || safe.activities.length === 0) {
      throw new Error("Onvolledige JSON-respons ontvangen van model.");
    }

    return safe;
  } catch (err: any) {
    // Duidelijke foutmeldingen voor in je UI/logs
    const msg =
      err?.message?.includes("Invalid JSON payload received")
        ? "Fout in API-aanroep: controleer de meegestuurde velden (responseMimeType niet gebruiken)."
        : err?.message || String(err);

    console.error("[gemini] generateAIReadyObjective error:", err);
    throw new Error(msg);
  }
}

/**
 * Eventueel extra exporteren voor elders in de app.
 */
export const Terms = {
  autonomieTerms,
  samenwerkTerms,
  reflectieTerms
};
