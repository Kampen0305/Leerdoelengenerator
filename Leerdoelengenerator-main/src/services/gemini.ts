// src/services/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { LearningObjectiveContext } from "../types/context";

/**
 * Types
 */
export interface GeminiResponse {
  newObjective: string;
  rationale: string;
  activities: string[];
  assessments: string[];
  aiLiteracy: string;
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

let genAI: GoogleGenerativeAI | null = null;
if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

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
    ' "aiLiteracy": "Kernpunten (kritisch denken/ethiek/vaardigheden)"',
    "}"
  ].filter(Boolean).join("\n");
}

/**
 * Publieke API
 */

/** Snelle check of de Gemini API bruikbaar is (key + simpele call). */
export async function checkGeminiAvailable(): Promise<boolean> {
  if (!genAI) return false;
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
      assessments: Array.isArray(data.assessments) ? data.assessments.map(String) : [],
      aiLiteracy: String(data.aiLiteracy ?? "")
    };

    // Minimale validatie
    if (!safe.newObjective || safe.activities.length === 0 || !safe.aiLiteracy) {
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
  }
}

/**
 * Eventueel extra exporteren voor elders in de app.
 */
export const geminiService = {
  isAvailable: () => Boolean(genAI),
  generateAIReadyObjective,
};
