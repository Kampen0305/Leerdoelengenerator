import { describe, it, expect } from 'vitest';
import { buildPrompt } from './gemini';
import type { LearningObjectiveContext } from '../types/context';

describe('buildPrompt', () => {
  const base: Omit<LearningObjectiveContext, 'education' | 'level'> = {
    original: 'Oefenleerdoel',
    domain: 'Zorg',
    assessment: 'Toets',
  } as any;

  it('voegt VSO-richtlijnen toe', () => {
    const ctx: LearningObjectiveContext = {
      ...base,
      education: 'VSO',
      level: 'Arbeidsmarktgerichte route',
      domain: 'Zorg',
    } as any;
    const prompt = buildPrompt(ctx);
    expect(prompt).toContain('Voortgezet Speciaal Onderwijs (VSO)');
    expect(prompt).toContain('Differentiatie per leerroute: Arbeidsmarktgerichte route');
  });

  it('voegt HBO master-richtlijnen toe', () => {
    const ctx: LearningObjectiveContext = {
      ...base,
      education: 'HBO',
      level: 'Master',
      domain: 'ICT',
    } as any;
    const prompt = buildPrompt(ctx);
    expect(prompt).toContain('HBO-masterniveau');
    expect(prompt).toContain('onderzoekend vermogen');
  });
});
