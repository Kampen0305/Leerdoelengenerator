// src/services/geminiService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

type Lane = 'baan1' | 'baan2';

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

export interface GeminiResponse {
  newObjective: string;
  rationale: string;
  activities: string[];
  assessments: string[];
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const MODEL   = import.meta.env.VITE_GEMINI_MODEL   || 'gemini-1.5-flash';
const TIMEOUT_MS = 20000;
const DEBUG = false;

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: ReturnType<GoogleGenerativeAI['getGenerativeModel']> | null = null;

  // optionele health flag
  private _healthy: boolean | null = null;

  constructor() {
    if (!API_KEY) {
      if (DEBUG) console.warn('Geen VITE_GEMINI_API_KEY gevonden.');
      return;
    }
    try {
      this.genAI = new GoogleGenerativeAI(API_KEY);
      this.model = this.genAI.getGenerativeModel({
        model: MODEL,
        generationConfig: { responseMimeType: 'application/json' },
      });
    } catch (err) {
      console.error('Gemini init fout:', err);
      this.genAI = null;
      this.model = null;
    }
  }

  isAvailable(): boolean {
    if (this._healthy === false) return false;
    return Boolean(this.model);
  }

  async healthCheck(): Promise<boolean> {
    if (!this.model) { this._healthy = false; return false; }
    try {
      const run = this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: 'ping' }]}],
        generationConfig: { responseMimeType: 'application/json' },
      });
      const withTimeout = new Promise((_r, rej) =>
        setTimeout(() => rej(new Error('Gemini timeout na ' + TIMEOUT_MS + ' ms')), TIMEOUT_MS)
      );
      await Promise.race([run, withTimeout]);
      this._healthy = true;
      return true;
    } catch {
      this._healthy = false;
      return false;
    }
  }

  async generateAIReadyObjective(
    context: LearningObjectiveContext,
    kdContext?: KDContext
  ): Promise<GeminiResponse> {
    if (!this.model) {
      throw new Error('Gemini API niet beschikbaar. Controleer VITE_GEMINI_API_KEY.');
    }
    const prompt = this.buildPrompt(context, kdContext);

    const run = this.model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
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
      this.validateShape(parsed);

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

  private validateShape(obj: any) {
    if (!obj || typeof obj !== 'object') throw new Error('Onverwacht AI-formaat.');
    if (!obj.newObjective || !obj.rationale || !Array.isArray(obj.activities) || !Array.isArray(obj.assessments)) {
      throw new Error('Incompleet AI-antwoord.');
    }
  }

  // >>>>>>>>>>>>>>>>>>>> HIER STAAT buildPrompt BINNEN DE CLASS <<<<<<<<<<<<<<<<<<<<
  private buildPrompt(context: LearningObjectiveContext, kdContext?: KDContext): string {
    const levelGuidance   = this.getLevelSpecificGuidance(context.education, context.level);
    const domainGuidance  = this.getDomainSpecificGuidance(context.domain);
    const nationalVision  = this.getNationalVisionGuidance();
    const languageGuidance= this.getLanguageAndComplexityGuidance(context.education, context.level);

    let kdText = '';
    if (kdContext?.title) {
      kdText = `
KWALIFICATIEDOSSIER CONTEXT:
- Titel: ${kdContext.title}
- Code: ${kdContext.code || 'Onbekend'}
${kdContext.relatedCompetencies?.length ? `- Gerelateerde competenties: ${kdContext.relatedCompetencies.map(c => c.title).join(', ')}` : ''}
${kdContext.relatedWorkProcesses?.length ? `- Gerelateerde werkprocessen: ${kdContext.relatedWorkProcesses.map(w => w.title).join(', ')}` : ''}
`;
    }

    const laneText =
      context.lane === 'baan2'
        ? 'MET AI (gratis tools; transparantie, bias-check, alternatief zonder betaalde tools).'
        : 'ZONDER AI (individuele bekwaamheid; transparantie over hulpmiddelen).';

    return `Je bent een expert in AI-bewust onderwijs in Nederland. 
Transformeer het volgende traditionele leerdoel naar een AI-ready leerdoel volgens:
- Het Referentiekader 2.0 (rechtvaardigheid, menselijkheid, autonomie)
- De Npuls handreikingen (AI in onderwijs)
- De landelijke visie op toetsing en examinering
- Richtlijnen voor taalniveau en toegankelijkheid

ORIGINEEL LEERDOEL: "${context.original}"

CONTEXT:
- Onderwijstype: ${context.education}
- Niveau: ${context.level}
- Beroepsdomein: ${context.domain}
- Toetsvorm: ${context.assessment || '-'}
- Two-lane: ${laneText}

${kdText}

TAAL EN COMPLEXITEIT:
${languageGuidance}

LANDELIJKE VISIE:
${nationalVision}

NIVEAU-SPECIFIEK:
${levelGuidance}

DOMEIN-SPECIFIEK:
${domainGuidance}

⚖️ KERNWAARDEN
1. Rechtvaardigheid → inclusief, eerlijk, bias vermijden
2. Menselijkheid → betekenisvol contact, menselijke blik blijft belangrijk
3. Autonomie → behoud van keuzevrijheid en menselijke controle

✅ OUTPUT (JSON):
{
  "newObjective": "Het AI-ready leerdoel, passend bij niveau, taal en richtlijnen",
  "rationale": "Korte uitleg waarom dit AI-ready is én hoe het aansluit bij rechtvaardigheid, menselijkheid, autonomie",
  "activities": [
    "Activiteit 1 (toegankelijk en inclusief)",
    "Activiteit 2 (kritisch en ethisch AI-gebruik)",
    "Activiteit 3 (transparantie en samenwerking)"
  ],
  "assessments": [
    "Toetsvorm 1 (authentiek en eerlijk)",
    "Toetsvorm 2 (proces en reflectie op AI-gebruik)"
  ]
}

BELANGRIJK:
- Gebruik duidelijke taal op het juiste niveau.
- Voeg in de rationale expliciet toe hoe de kernwaarden geborgd zijn.
- Geen onnodig ingewikkelde taal, tenzij niveau HBO/WO dit vereist.`;
  }

  // --- Richtlijnhelpers (compact gehouden; jouw langere teksten kunnen hier) ---
  private getLanguageAndComplexityGuidance(education: string, level: string): string {
    return `Gebruik taal passend bij ${education} ${level}; korte, duidelijke zinnen en leg vaktermen uit.`;
  }
  private getNationalVisionGuidance(): string {
    return `Toegankelijkheid, bias-bewustzijn, transparantie, menselijke autonomie, ethiek, inclusie.`;
  }
  private getLevelSpecificGuidance(education: string, level: string): string {
    return `Richtlijnen voor ${education} ${level}: pas complexiteit en zelfstandigheid aan het niveau aan.`;
  }
  private getDomainSpecificGuidance(domain: string): string {
    if (!domain) return 'Algemeen: kansengelijkheid, transparantie, bias-bewustzijn, privacy, menselijke autonomie.';
    const d = domain.toLowerCase();
    if (d.includes('zorg')) return 'Zorg/Verpleegkunde: privacy/AVG, patiëntveiligheid, bias, empathie.';
    if (d.includes('ict') || d.includes('software') || d.includes('techniek'))
      return 'ICT/Techniek: inclusief ontwerp, bias-preventie, uitlegbaarheid, security.';
    if (d.includes('marketing') || d.includes('communicatie'))
      return 'Marketing/Communicatie: transparantie, geen manipulatie, diversiteit, privacy.';
    if (d.includes('financ'))
      return 'Financiën: nauwkeurigheid, compliance, uitlegbaarheid, fair lending.';
    if (d.includes('onderwijs') || d.includes('pedagog'))
      return 'Onderwijs: leerling-centraal, bias-bewust, privacy, toegankelijkheid.';
    return 'Algemeen: kansengelijkheid, transparantie, bias-bewustzijn, privacy, menselijke autonomie.';
  }
}

export const geminiService = new GeminiService();
