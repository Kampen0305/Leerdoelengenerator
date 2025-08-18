// src/services/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GeminiResponse {
  newObjective: string;
  rationale: string;
  activities: string[];
  assessments: string[];
}

interface LearningObjectiveContext {
  original: string;
  education: string;
  level: string;
  domain: string;
  assessment?: string;
  lane?: 'baan1' | 'baan2';
}

interface KDContext {
  title?: string;
  code?: string;
  relatedCompetencies?: Array<{ title: string }>;
  relatedWorkProcesses?: Array<{ title: string }>;
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const MODEL   = import.meta.env.VITE_GEMINI_MODEL   || 'gemini-1.5-flash';
const TIMEOUT_MS = 20000;

class GeminiService {
  private model: ReturnType<GoogleGenerativeAI['getGenerativeModel']> | null = null;

  constructor() {
    if (!API_KEY) return;
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      this.model = genAI.getGenerativeModel({
        model: MODEL,
        generationConfig: { responseMimeType: 'application/json' },
      });
    } catch {
      this.model = null;
    }
  }

  isAvailable() { return Boolean(this.model); }

  async generateAIReadyObjective(ctx: LearningObjectiveContext, kd?: KDContext): Promise<GeminiResponse> {
    if (!this.model) throw new Error('Gemini niet beschikbaar');

    const kdText = kd?.title ? `KD: ${kd.title}${kd.code ? ` (${kd.code})` : ''}` : '';
    const prompt = `Geef alleen geldige JSON met sleutels newObjective, rationale, activities, assessments.
Context: ${ctx.education} – ${ctx.level} – ${ctx.domain}. ${kdText}
Origineel: "${ctx.original}"`;

    const run = this.model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }]}],
      generationConfig: { responseMimeType: 'application/json' },
    });

    const withTimeout = new Promise((_r, rej) =>
      setTimeout(() => rej(new Error('timeout')), TIMEOUT_MS)
    );

    const result = await Promise.race([run, withTimeout]) as Awaited<typeof run>;
    const raw = result.response.text();
    const data = JSON.parse(raw);

    return {
      newObjective: data.newObjective,
      rationale: data.rationale,
      activities: Array.isArray(data.activities) ? data.activities : [],
      assessments: Array.isArray(data.assessments) ? data.assessments : [],
    };
  }
}

export const geminiService = new GeminiService();

