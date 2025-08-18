import { describe, it, expect } from 'vitest';
import { objectiveSchema } from './validation';

describe('objectiveSchema', () => {
  it('valideert correcte data', () => {
    const result = objectiveSchema.safeParse({
      original: 'Doel',
      education: 'MBO',
      level: '3',
      domain: 'ICT',
      assessment: 'Exam'
    });
    expect(result.success).toBe(true);
  });

  it('toont fouten bij ontbrekende velden', () => {
    const result = objectiveSchema.safeParse({
      original: '',
      education: '',
      level: '',
      domain: '',
      assessment: ''
    });
    expect(result.success).toBe(false);
    const errors = result.error.flatten().fieldErrors;
    expect(errors.original?.[0]).toBe('Vul het leerdoel in.');
     expect(errors.education?.[0]).toBe('Kies MBO, HBO, WO of VO.');
    expect(errors.domain?.[0]).toBe('Vul het domein in.');
    expect(errors.assessment?.[0]).toBe('Vul de toetsing in.');
    expect(errors.level).toBeUndefined();
  });

  it('valideert onderwijssector', () => {
    const result = objectiveSchema.safeParse({
      original: 'Doel',
      education: 'VMBO' as any,
      level: '3',
      domain: 'ICT',
      assessment: 'Exam'
    });
    expect(result.success).toBe(false);
    expect(result.error.flatten().fieldErrors.education?.[0]).toBe('Kies MBO, HBO, WO of VO.');
  });

  it('vereist niveau voor mbo', () => {
    const result = objectiveSchema.safeParse({
      original: 'Doel',
      education: 'MBO',
      level: '',
      domain: 'ICT',
      assessment: 'Exam'
    });
    expect(result.success).toBe(false);
    expect(result.error.flatten().fieldErrors.level?.[0]).toBe('Vul het niveau in.');
  });

  it('accepteert hbo zonder niveau', () => {
    const result = objectiveSchema.safeParse({
      original: 'Doel',
      education: 'HBO',
      domain: 'ICT',
      assessment: 'Exam'
    });
    expect(result.success).toBe(true);
  });

  it('negeert niveau bij wo', () => {
    const result = objectiveSchema.safeParse({
      original: 'Doel',
      education: 'WO',
      level: '9',
      domain: 'ICT',
      assessment: 'Exam'
    });
    expect(result.success).toBe(true);
  });

  it('valideert VO met leerjaar', () => {
    const result = objectiveSchema.safeParse({
      original: 'Doel',
      education: 'VO',
      domain: 'Economie',
      assessment: 'Toets',
      voLevel: 'havo',
      voGrade: 4
    });
    expect(result.success).toBe(true);
  });

  it('controleert leerjaar bereik voor VO', () => {
    const result = objectiveSchema.safeParse({
      original: 'Doel',
      education: 'VO',
      domain: 'Economie',
      assessment: 'Toets',
      voLevel: 'vwo',
      voGrade: 7
    });
    expect(result.success).toBe(false);
    expect(result.error.flatten().fieldErrors.voGrade?.[0]).toBe('Leerjaar moet tussen 1 en 6 liggen.');
  });
});
