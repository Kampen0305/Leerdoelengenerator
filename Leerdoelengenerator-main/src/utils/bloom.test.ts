import { describe, it, expect } from 'vitest';
import { formatBloom } from './bloom';

describe('formatBloom', () => {
  it('returns null for empty input', () => {
    expect(formatBloom('')).toBeNull();
  });

  it('formats single level', () => {
    const res = formatBloom('apply');
    expect(res).not.toBeNull();
    expect(res!.label).toBe('Niveau volgens Bloom: Toepassen');
    expect(res!.description).toContain('praktische situatie');
  });

  it('formats multiple levels', () => {
    const res = formatBloom('rememberUnderstand • apply');
    expect(res).not.toBeNull();
    expect(res!.label).toBe('Niveau volgens Bloom: Onthouden, Begrijpen en Toepassen');
  });

  it('handles various separators', () => {
    const res = formatBloom('Analyze;Evaluate');
    expect(res).not.toBeNull();
    expect(res!.label).toBe('Niveau volgens Bloom: Analyseren en Evalueren');
  });

  it('splits camelCase combos', () => {
    const res = formatBloom('REMEMBERUNDERSTAND');
    expect(res).not.toBeNull();
    expect(res!.label).toBe('Niveau volgens Bloom: Onthouden en Begrijpen');
  });
});
