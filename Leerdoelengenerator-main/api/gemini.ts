/* eslint-env node */
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface GeminiResponse {
  newObjective: string;
  rationale: string;
  activities: string[];
  assessments: string[];
}

export interface LearningObjectiveContext {
  original: string;
  education: string;
  level: string;
  domain: string;
  assessment?: string;
  lane?: "baan1" | "baan2";
}

export interface KDContext {
  title?: string;
  code?: string;
  relatedCompetencies?: Array<{ title: string }>;
  relatedWorkProcesses?: Array<{ title: string }>;
}

const API_KEY = process.env.VITE_GEMINI_API_KEY || "";
const MODEL_NAME = "gemini-1.5-flash";
const genAI = new GoogleGenerativeAI(API_KEY);

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

function formatKD(kd?: KDContext): string {
  if (!kd) return "Geen KD-context aangeleverd.";
  const comp = kd.relatedCompetencies?.map(c => `- ${c.title}`).join("\n") || "- (geen)";
  const wp = kd.relatedWorkProcesses?.map(w => `- ${w.title}`).join("\n") || "- (geen)";
  return [
    `KD titel: ${kd.title ?? "(onbekend)"}`,
    `KD code: ${kd.code ?? "(onbekend)"}`,
    `Gerelateerde competenties:\n${comp}`,
    `Gerelateerde werkprocessen:\n${wp}`
  ].join("\n");
}

const SYSTEM_INSTRUCTION = [
  "Je bent een onderwijsassistent voor MBO-docenten.",
  "Je herschrijft of concretiseert leerdoelen zodat ze SMART, uitvoerbaar en toetsbaar zijn.",
  "Gebruik heldere, korte zinnen. Vermijd jargon.",
  "Schrijf in het Nederlands."
].join(" ");

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

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: "Antwoord uitsluitend met: OK" }]}],
        generationConfig: { temperature: 0.1, maxOutputTokens: 8 }
      });
      const txt = result.response.text().trim().toUpperCase();
      res.status(200).json({ ok: txt.includes("OK") });
    } catch (e) {
      console.error("[gemini] Beschikbaarheidscheck faalde:", e);
      res.status(500).json({ ok: false });
    }
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { ctx, kd } = req.body || {};
  const prompt = buildPrompt(ctx as LearningObjectiveContext, kd as KDContext);

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }]}],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 800
      }
    });

    const raw = (result.response?.text?.() ?? "").trim();
    if (!raw) {
      throw new Error("Lege respons van model.");
    }

    let data: any;
    try {
      data = JSON.parse(raw);
    } catch {
      const cleaned = raw
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/, "")
        .trim();
      data = JSON.parse(cleaned);
    }

    const safe: GeminiResponse = {
      newObjective: String(data.newObjective ?? ""),
      rationale: String(data.rationale ?? ""),
      activities: Array.isArray(data.activities) ? data.activities.map(String) : [],
      assessments: Array.isArray(data.assessments) ? data.assessments.map(String) : []
    };

    if (!safe.newObjective || safe.activities.length === 0) {
      throw new Error("Onvolledige JSON-respons ontvangen van model.");
    }

    res.status(200).json(safe);
  } catch (err: any) {
    const msg =
      err?.message?.includes("Invalid JSON payload received")
        ? "Fout in API-aanroep: controleer de meegestuurde velden."
        : err?.message || String(err);
    console.error("[gemini] generateAIReadyObjective error:", err);
    res.status(500).json({ error: msg });
  }
}

