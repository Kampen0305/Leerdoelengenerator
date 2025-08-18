import { describe, it, expect } from 'vitest';
import { geminiResponseSchema } from './validation';

describe('geminiResponseSchema', () => {
  it('validates a correct object', () => {
    const data = {
      newObjective: 'Leerdoel',
      rationale: 'Omdat het moet',
      activities: ['activiteit'],
      assessments: ['toets']
    };
    const parsed = geminiResponseSchema.parse(data);
    expect(parsed).toEqual(data);
  });

  it('requires newObjective', () => {
    const result = geminiResponseSchema.safeParse({
      rationale: 'Reden',
      activities: ['activiteit']
    });
    expect(result.success).toBe(false);
  });

  it('requires non-empty activities', () => {
    const result = geminiResponseSchema.safeParse({
      newObjective: 'Doel',
      rationale: 'Reden',
      activities: []
    });
    expect(result.success).toBe(false);
  });

  it('defaults assessments to empty array', () => {
    const parsed = geminiResponseSchema.parse({
      newObjective: 'Doel',
      rationale: 'Reden',
      activities: ['activiteit']
    });
    expect(parsed.assessments).toEqual([]);
  });
});
