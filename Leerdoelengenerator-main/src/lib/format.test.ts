import { describe, it, expect } from 'vitest';
import { enforceDutchAndSMART } from './format';

describe('enforceDutchAndSMART', () => {
  it('voegt waarschuwingen toe bij Engels en vult lijsten aan', () => {
    const longText = Array(100).fill('woord').join(' ');
    const result = enforceDutchAndSMART({
      newObjective: 'The student improve',
      rationale: longText,
      activities: ['activity 1', 'activity 2'],
      assessments: ['assessment 1'],
      aiLiteracy: ''
    });

    expect(result.warnings).toContain('Niet alle tekst is in het Nederlands.');
    expect(result.warnings).toContain('Rationale ingekort tot 80 woorden.');
    expect(result.warnings).toContain('Aantal leeractiviteiten buiten 3–5.');
    expect(result.warnings).toContain('Aantal toetsvormen buiten 2–4.');
    expect(result.warnings).toContain('AI-geletterdheid indicatoren ontbreken.');

    expect(result.activities).toHaveLength(3);
    expect(result.activities[2]).toBe('N.t.b.');
    expect(result.assessments).toHaveLength(2);
    expect(result.assessments[0]).toMatch(/^Baan 1:/);
    expect(result.rationale.split(/\s+/).length).toBe(80);
    expect(result.aiLiteracyFocus).toEqual(['kritisch denken', 'ethiek']);
    expect(result.smart.badge).toBe('❌');
    expect(result.smart.issues.length).toBeGreaterThan(0);
  });

  it('accepteert correct SMART-doel zonder waarschuwingen', () => {
    const result = enforceDutchAndSMART({
      newObjective: 'De student kan binnen 2 weken een oplossing maken met 80% score wanneer hij TDD toepast',
      rationale: 'korte uitleg',
      activities: ['activiteit 1', 'activiteit 2', 'activiteit 3'],
      assessments: ['toets 1', 'toets 2'],
      aiLiteracy: 'kritisch denken en ethiek'
    }, 'baan2');

    expect(result.smart.badge).toBe('✅');
    expect(result.smart.issues).toHaveLength(0);
    expect(result.warnings).toHaveLength(0);
    expect(result.assessments[0]).toMatch(/^Baan 2:/);
    expect(result.activities).toHaveLength(3);
    expect(result.assessments).toHaveLength(2);
    expect(result.aiLiteracyFocus).toHaveLength(0);
  });
});

