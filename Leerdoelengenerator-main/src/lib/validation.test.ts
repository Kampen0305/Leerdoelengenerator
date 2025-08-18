import { describe, it, expect } from 'vitest';
import { objectiveSchema } from './validation';

describe('objectiveSchema', () => {
  it('valideert correcte data', () => {
    const result = objectiveSchema.safeParse({
      original: 'Doel',
      sector: 'mbo',
      level: '3',
      domain: 'ICT',
      assessment: 'Exam'
    });
    expect(result.success).toBe(true);
  });

  it('toont fouten bij ontbrekende velden', () => {
    const result = objectiveSchema.safeParse({
      original: '',
      sector: '',
      level: '',
      domain: '',
      assessment: ''
    });
    expect(result.success).toBe(false);
    const errors = result.error.flatten().fieldErrors;
    expect(errors.original?.[0]).toBe('Vul het leerdoel in.');
    expect(errors.sector?.[0]).toBe('Kies mbo, hbo of wo.');
    expect(errors.level?.[0]).toBe('Vul het niveau in.');
    expect(errors.domain?.[0]).toBe('Vul het domein in.');
    expect(errors.assessment?.[0]).toBe('Vul de toetsing in.');
  });

  it('valideert onderwijssector', () => {
    const result = objectiveSchema.safeParse({
      original: 'Doel',
      sector: 'vmbo',
      level: '3',
      domain: 'ICT',
      assessment: 'Exam'
    });
    expect(result.success).toBe(false);
    expect(result.error.flatten().fieldErrors.sector?.[0]).toBe('Kies mbo, hbo of wo.');
  });

  it('controleert mbo niveau', () => {
    const result = objectiveSchema.safeParse({
      original: 'Doel',
      sector: 'mbo',
      level: '5',
      domain: 'ICT',
      assessment: 'Exam'
    });
    expect(result.success).toBe(false);
    expect(result.error.flatten().fieldErrors.level?.[0]).toBe('Kies niveau 2, 3 of 4.');
  });

  it('accepteert niveaus buiten mbo', () => {
    const result = objectiveSchema.safeParse({
      original: 'Doel',
      sector: 'hbo',
      level: 'Bachelor',
      domain: 'ICT',
      assessment: 'Exam'
    });
    expect(result.success).toBe(true);
  });
});
