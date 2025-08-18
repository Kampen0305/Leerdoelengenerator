import { GoogleGenerativeAI } from '@google/generative-ai';

type Lane = 'baan1' | 'baan2';

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
  lane?: Lane;
}

interface KDContext {
  title?: string;
  code?: string;
  relatedCompetencies?: Array<{ title: string; description?: string }>;
  relatedWorkProcesses?: Array<{ title: string; description?: string }>;
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const MODEL   = import.meta.env.VITE_GEMINI_MODEL   || 'gemini-1.5-flash';
const TIMEOUT_MS = 20000;

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: ReturnType<GoogleGenerativeAI['getGenerativeModel']> | null = null;

  constructor() {
    if (!API_KEY) return;
    try {
      this.genAI = new GoogleGenerativeAI(API_KEY);
      this.model = this.genAI.getGenerativeModel({
        model: MODEL,
        generationConfig: { responseMimeType: 'application/json' },
      });
    } catch {
      this.genAI = null;
      this.model = null;
    }
  }

  isAvailable(): boolean {
    return Boolean(this.model);
  }

  async generateAIReadyObjective(
    context: LearningObjectiveContext,
    kdContext?: KDContext
  ): Promise<GeminiResponse> {
    if (!this.model) throw new Error('Gemini API niet beschikbaar. Controleer VITE_GEMINI_API_KEY.');
    const prompt = this.buildPrompt(context, kdContext);

    const run = this.model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }]}],
      generationConfig: { responseMimeType: 'application/json' },
    });

    const withTimeout = new Promise((_r, rej) =>
      setTimeout(() => rej(new Error('Gemini timeout na ' + TIMEOUT_MS + ' ms')), TIMEOUT_MS)
    );

    try {
      const result = await Promise.race([run, withTimeout]) as Awaited<typeof run>;
      const response = await result.response;
      const raw = response.text();
      const parsed = JSON.parse(raw);

      if (
        !parsed ||
        typeof parsed !== 'object' ||
        !parsed.newObjective ||
        !parsed.rationale ||
        !Array.isArray(parsed.activities) ||
        !Array.isArray(parsed.assessments)
      ) {
        throw new Error('Incompleet AI-antwoord.');
      }

      return {
        newObjective: parsed.newObjective,
        rationale: parsed.rationale,
        activities: parsed.activities,
        assessments: parsed.assessments,
      };
    } catch (err: any) {
      throw new Error(
        String(err?.message || err).includes('timeout')
          ? 'AI-antwoord duurde te lang. Probeer opnieuw (of gebruik de fallback).'
          : `Fout bij AI-generatie: ${err?.message || err}`
      );
    }
  }

  // ---- BELANGRIJK: deze methode staat BINNEN de class ----
  private buildPrompt(context: LearningObjectiveContext, kd?: KDContext): string {
    const laneText =
      context.lane === 'baan2'
        ? 'MET AI (gratis tools; transparantie, bias-check, alternatief zonder betaalde tools).'
        : 'ZONDER AI (individuele bekwaamheid; transparantie over hulpmiddelen).';

    const kdLines: string[] = [];
    if (kd?.title) kdLines.push(`- KD titel: ${kd.title}`);
    if (kd?.code) kdLines.push(`- KD code: ${kd.code}`);
    if (kd?.relatedCompetencies?.length) kdLines.push(`- Competenties: ${kd.relatedCompetencies.map(c => c.title).join('; ')}`);
    if (kd?.relatedWorkProcesses?.length) kdLines.push(`- Werkprocessen: ${kd.relatedWorkProcesses.map(w => w.title).join('; ')}`);

    return [
      'Je bent een NL onderwijskundige. Zet het leerdoel om naar AI-ready volgens Referentiekader 2.0 (rechtvaardigheid, menselijkheid, autonomie) en Npuls-handreikingen.',
      `Context: ${context.education} – ${context.level} – ${context.domain}`,
      `Toetsvorm: ${context.assessment || '-'}`,
      `Two-lane: ${laneText}`,
      ...(kdLines.length ? ['KD-context:', ...kdLines] : []),
      '',
      'Geef ANTWOORD ALLEEN als geldige JSON met exact deze sleutels:',
      `{
  "newObjective": "string",
  "rationale": "string",
  "activities": ["string","string","string"],
  "assessments": ["string","string","string"]
}`,
      '',
      'ORIGINEEL LEERDOEL:',
      context.original,
    ].join('\n');
  }
}

export const geminiService = new GeminiService();
