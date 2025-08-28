import { describe, it, expect } from 'vitest';
import { generateTwoLaneOutput } from '../lib/twoLane';
import type { LearningObjectiveContext } from '../types/context';

describe('Two-Lane generator', () => {
  it('Baan 1 zet AI-gebruik op beperkt en bevat geen transparantie-eisen', () => {
    const ctx: LearningObjectiveContext = {
      original: 'eenvoudige wondverzorging uitvoeren bij een gesimuleerde cliënt, conform richtlijnen',
      education: 'MBO',
      level: 'Niveau 2',
      domain: 'Zorg',
      lane: 'baan1',
    } as any; // overige velden zijn niet relevant voor deze test
    const out = generateTwoLaneOutput(ctx);
    expect(out.aiUsage).toBe('beperkt');
    expect(out.objective).toContain('zonder AI');
    expect(out.verification.length).toBe(0);
    expect(out.rubric).toContain('Kerntaak/vaardigheid');
  });

  it('Baan 2 genereert transparantie-eisen en staat AI toe', () => {
    const ctx: LearningObjectiveContext = {
      original: 'eenvoudige wondverzorging uitvoeren bij een gesimuleerde cliënt, conform richtlijnen',
      education: 'MBO',
      level: 'Niveau 2',
      domain: 'Zorg',
      lane: 'baan2',
    } as any;
    const out = generateTwoLaneOutput(ctx);
    expect(out.aiUsage).toBe('toegestaan');
    expect(out.objective).toContain('met doelmatig en verantwoord gebruik van AI');
    expect(out.verification.length).toBeGreaterThan(0);
    expect(out.rubric).toContain('AI-geletterdheid (keuze, promptkwaliteit, evaluatie)');
  });

  it('Business-domein met verplicht AI-gebruik vermeldt verplicht in doel', () => {
    const ctx: LearningObjectiveContext = {
      original: 'een financieel plan opstellen voor een start-up',
      education: 'HBO',
      level: 'Bachelor',
      domain: 'Business',
      lane: 'baan2',
      ai_usage: 'verplicht',
    } as any;
    const out = generateTwoLaneOutput(ctx);
    expect(out.aiUsage).toBe('verplicht');
    expect(out.objective).toContain('verplicht');
    expect(out.verification.length).toBeGreaterThan(0);
  });

  it('ICT-domein in Baan 1 houdt AI buiten de toets', () => {
    const ctx: LearningObjectiveContext = {
      original: 'een netwerkconfiguratie implementeren volgens specificaties',
      education: 'MBO',
      level: 'Niveau 4',
      domain: 'ICT',
      lane: 'baan1',
    } as any;
    const out = generateTwoLaneOutput(ctx);
    expect(out.objective).toContain('zonder AI');
    expect(out.aiUsage).toBe('beperkt');
  });
});
