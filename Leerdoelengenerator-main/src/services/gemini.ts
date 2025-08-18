// src/services/gemini.ts
import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai';

export interface GeminiResponse {
  newObjective: string;
  rationale: string;
  activities: string[];
  assessments: string[];
  autonomieTerms?: string[]; // optioneel, krijgt altijd een array-fallback
}

export interface LearningObjectiveContext {
  original: string;
  education: string;
  level: string;
  domain: string;
  assessment?: string;
  lane?: 'baan1' | 'baan2';
}

export interface KDContext {
  title?: string;
  code?: string;
  relatedCompetencies?: Array<{ title: string }>;
  relatedWorkProcesses?: Array<{ title: string }>;
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash';
const TIMEOUT_MS = 20_000;

/** Maakt JSON van modeltekst, ook als het in ```json ... ``` staat of er rommel omheen zit. */
function toJson(text: string): any {
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const m = cleaned.match(/\{[\s\S]*\}$/);
    if (!m) throw new Error('Kon JSON niet parsen uit modelrespons.');
    return JSON.parse(m[0]);
  }
}

class GeminiService {
  private model: GenerativeModel | null = null;

  constructor() {
    if (!API_KEY) return;
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
    if (!this.model) throw new Error('Gemini niet beschikbaar (API-key/init).');

    const kdText = kd?.title ? `KD: ${kd.title}${kd.code ? ` (${kd.code})` : ''}` : '';

    const prompt =
      `Geef ALLEEN een geldig JSON-object met exact deze sleutels:\n` +
      `newObjective (string), rationale (string), activities (array<string>), assessments (array<string>), autonomieTerms (array<string>, optioneel).\n` +
      `GEEN uitleg of tekst buiten het JSON-object.\n\n` +
      `Context: onderwijs=${ctx.education}; niveau=${ctx.level}; domein=${ctx.domain}. ${kdText}\n` +
      (ctx.assessment ? `Toetsing: ${ctx.assessment}\n` : '') +
      (ctx.lane ? `Variant: ${ctx.lane}\n` : '') +
      `Origineel leerdoel: "${ctx.original}"`;

    // Belangrijk: GEEN generationConfig meegeven → voorkomt jouw 400-fout.
    const run = this.model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    // Timeout guard
    const timeout = new Promise<never>((_, rej) =>
      setTimeout(() => rej(new Error('timeout')), TIMEOUT_MS)
    );

    const result = await Promise.race([run, timeout]);
    const raw = (result as Awaited<typeof run>).response.text();
    const data = toJson(raw);

    // Robuuste defaults → UI crasht nooit op undefined
    return {
      newObjective: typeof data.newObjective === 'string' ? data.newObjective : '',
      rationale: typeof data.rationale === 'string' ? data.rationale : '',
      activities: Array.isArray(data.activities)
        ? data.activities.filter((x: any) => typeof x === 'string')
        : [],
      assessments: Array.isArray(data.assessments)
        ? data.assessments.filter((x: any) => typeof x === 'string')
        : [],
      autonomieTerms: Array.isArray(data.autonomieTerms)
        ? data.autonomieTerms.filter((x: any) => typeof x === 'string')
        : [],
    };
  }
}

export const geminiService = new GeminiService();
