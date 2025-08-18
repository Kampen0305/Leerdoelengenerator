// src/services/gemini.ts

/**
 * Types gedeeld tussen client en server.
 */
export interface GeminiResponse {
  newObjective: string;
  rationale: string;
  activities: string[];
  assessments: string[];
}

export interface LearningObjectiveContext {
  original: string; // Origineel leerdoel / opdracht
  education: string; // bv. "MBO"
  level: string; // bv. "niveau 3"
  domain: string; // vak/sector
  assessment?: string; // (optioneel) toetsvorm
  lane?: "baan1" | "baan2"; // workflow-variant
}

export interface KDContext {
  title?: string;
  code?: string;
  relatedCompetencies?: Array<{ title: string }>;
  relatedWorkProcesses?: Array<{ title: string }>;
}

/**
 * Interne status voor beschikbaarheidscheck.
 */
codex/migrate-@google/generative-ai-to-serverless-function
let available = false;

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
if (!API_KEY) {
  // Niet crashen, maar wel duidelijke waarschuwing
  // (bouw blijft werken; runtime logs vertellen wat er mist)
  console.warn("[gemini] VITE_GEMINI_API_KEY ontbreekt.");
}

const MODEL_NAME = "gemini-1.5-flash"; // snel en goedkoop; desgewenst: "gemini-1.5-pro"

let genAI: GoogleGenerativeAI | null = null;
if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

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
const FIXED_SYSTEM_PROMPT =
  "Formuleer leerdoelen altijd in correct Nederlands, volgens de richtlijnen van constructive alignment en de Bloom-taxonomie. Gebruik de structuur: 'De student kan + [werkwoord uit Bloom] + [concreet gedrag] + [in een context] + [criterium voor succes]'. De leerdoelen moeten observeerbaar, toetsbaar en passend bij het niveau (mbo, hbo of wo) zijn. Houd de leerdoelen kort, concreet en eenduidig.";

const SYSTEM_INSTRUCTION = [
  FIXED_SYSTEM_PROMPT,
  "Je bent een onderwijsassistent voor MBO-docenten.",
  "Je herschrijft of concretiseert leerdoelen zodat ze SMART, uitvoerbaar en toetsbaar zijn.",
  "Gebruik heldere, korte zinnen. Vermijd jargon.",
  "Schrijf in het Nederlands."
].join(" ");


/**
 * Bouwt de prompt op basis van context + KD-gegevens
 */
function buildPrompt(ctx: LearningObjectiveContext, kd?: KDContext): string {
  const laneLine =
    ctx.lane === "baan2"
      ? "Focus extra op authentic assessment en praktijknabij toetsen."
      : "Houd het compact en direct toepasbaar in de lespraktijk.";
 main

const API_PATH = "/api/gemini";

/**
 * Checkt of de serverless functie bereikbaar is en de sleutel werkt.
 */
 codex/migrate-@google/generative-ai-to-serverless-function
export async function checkAvailability(): Promise<boolean> {


/** Snelle check of de Gemini API bruikbaar is (key + simpele call). */
export async function checkGeminiAvailable(): Promise<boolean> {
  if (!genAI) return false;
 main
  try {
    const res = await fetch(API_PATH);
    if (!res.ok) return (available = false);
    const data = (await res.json()) as { ok: boolean };
    available = Boolean(data.ok);
  } catch (e) {
    console.error("[gemini] Beschikbaarheidscheck faalde:", e);
    available = false;
  }
  return available;
}

/** Retourneert de laatst bekende beschikbaarheidsstatus. */
export function isAvailable(): boolean {
  return available;
}

/**
 * Roept de serverless functie aan om een AI-ready leerdoel te genereren.
 */
export async function generateAIReadyObjective(
  ctx: LearningObjectiveContext,
  kd?: KDContext
): Promise<GeminiResponse> {
 codex/migrate-@google/generative-ai-to-serverless-function
  const res = await fetch(API_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ctx, kd })
  });

  if (!res.ok) {
    throw new Error(await res.text());

  if (!genAI) {
    return Promise.reject(new Error("Gemini API key ontbreekt."));
  }
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const prompt = buildPrompt(ctx, kd);

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }]}],
      // Belangrijk: GEEN responseMimeType gebruiken (geeft 400 bij sommige endpoints/SDK's)
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 800
      }
    });

    // De SDK geeft tekst terug; we vragen via de prompt om JSON
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
        ? "Fout in API-aanroep: controleer de meegestuurde velden."
        : err?.message || String(err);

    console.error("[gemini] generateAIReadyObjective error:", err);
    throw new Error(msg);
 main
  }

  return (await res.json()) as GeminiResponse;
}

export const geminiService = {
  checkAvailability,
  isAvailable,
  generateAIReadyObjective
};

 codex/migrate-@google/generative-ai-to-serverless-function

export const geminiService = {
  isAvailable: () => Boolean(genAI),
  generateAIReadyObjective,
};
 main
