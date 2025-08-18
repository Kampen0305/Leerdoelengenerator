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
let available = false;

const API_PATH = "/api/gemini";

/**
 * Checkt of de serverless functie bereikbaar is en de sleutel werkt.
 */
export async function checkAvailability(): Promise<boolean> {
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
  const res = await fetch(API_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ctx, kd })
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return (await res.json()) as GeminiResponse;
}

export const geminiService = {
  checkAvailability,
  isAvailable,
  generateAIReadyObjective
};

