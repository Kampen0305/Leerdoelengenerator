// src/services/gemini.ts
import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai';

/**
 * Publieke response-shape die je UI kan gebruiken.
 * Extra veld 'autonomieTerms' is optioneel en krijgt altijd een array (fallback),
 * zodat je nooit 'is not defined' errors krijgt.
 */
export interface GeminiResponse {
  newObjective: string;
  rationale: string;
  activities: string[];
  assessments: string[];
  autonomieTerms?: string[];
}

export interface LearningObjectiveContext {
  original: string;          // oorspronkelijk leerdoel of wens
  education: string;         // mbo/hbo/vo etc.
  level: string;             // niveau / leerjaar
  domain: string;            // vak/domein
  assessment?: string;       // evt. toetsvorm
  lane?: 'baan1' | 'baan2';  // interne variant, optioneel
}

export interface KDContext {
  title?: string;
  code?: string;
  relatedCompetencies?: Array<{ title: string }>;
  relatedWorkProcesses?: Array<{ title: string }>;
}

// Env & defaults
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash';
const TIMEOUT_MS = 20_000;

/**
 * Kleine helper om JSON die soms tussen ```json ... ``` staat te schonen.
 */
function cleanModelTextToJson(text: string): any {
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // fallback: pak het laatste JSON-object in de string
    const m = cleaned.match(/\{[\s\S]*\}$/);
    if (!m) throw new Error('Kon JSON niet parsen uit modelrespons.');
    return JSON.parse(m[0]);
  }
}

/**
 * Service rondom Google Generative AI (Gemini).
 * - Initialisatie faalt nooit hard; isAvailable() vertelt of de modelclient er is.
 * - generateAIReadyObjective dwingt JSON af via response_mime_type (snake_case!)
 */
class GeminiService {
  private model: GenerativeModel | null = null;

  constructor() {
    if (!API_KEY) return; // laat service bestaan maar "uit"
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      this.model = genAI.getGenerativeModel({ model: MODEL });
    } catch {
      this.model = null;
    }
  }

  public isAvailable(): boolean {
    return Boolean(this.model);
  }

  public async generateAIReadyObjective(
    ctx: LearningObjectiveContext,
    kd?: KDContext
  ): Promise<GeminiResponse> {
    if (!this.model) throw new Error('Gemini niet beschikbaar (geen API-key of init-fout).');

    const kdText = kd?.title ? `KD: ${kd.title}${kd.code ? ` (${kd.code})` : ''}` : '';
    const prompt =
      `Geef ALLEEN geldige JSON met exact deze sleutels:\n` +
      `newObjective (string), rationale (string), activities (array van strings), assessments (array van strings), autonomieTerms (array van strings, optioneel).\n` +
      `Context: onderwijs=${ctx.education}; niveau=${ctx.level}; domein=${ctx.domain}. ${kdText}\n` +
      (ctx.assessment ? `Toetsing: ${ctx.assessment}\n` : '') +
      (ctx.lane ? `Variant: ${ctx.lane}\n` : '') +
      `Origineel leerdoel: "${ctx.original}"`;

    // Call met snake_case response_mime_type om 400-fouten te voorkomen
    const runPromise = this.model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { response_mime_type: 'application/json' },
    });

    // Timeout guard
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS)
    );

    const result = await Promise.race([runPromise, timeoutPromise]);
    const raw = (result as Awaited<typeof runPromise>).response.text();

    const data = cleanModelTextToJson(raw);

    // Robuuste defaults zodat de UI nooit crasht
    return {
      newObjective: typeof data.newObjective === 'string' ? data.newObjective : '',
      rationale: typeof data.rationale === 'string' ? data.rationale : '',
      activities: Array.isArray(data.activities) ? data.activities.filter((x: any) => typeof x === 'string') : [],
      assessments: Array.isArray(data.assessments) ? data.assessments.filter((x: any) => typeof x === 'string') : [],
      autonomieTerms: Array.isArray(data.autonomieTerms)
        ? data.autonomieTerms.filter((x: any) => typeof x === 'string')
        : [],
    };
  }
}

export const geminiService = new GeminiService();
