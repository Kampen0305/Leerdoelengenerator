import { describe, it, expect } from 'vitest';
import { enforceDutchAndSMART } from './format';

describe('enforceDutchAndSMART', () => {
  it('adds prefix when missing', () => {
    const res = enforceDutchAndSMART('Schrijft een verslag');
    expect(res).toBe('De student kan schrijft een verslag.');
  });

  it('keeps prefix if present', () => {
    const res = enforceDutchAndSMART('De student kan plannen.');
    expect(res).toBe('De student kan plannen.');
  });

  it('trims whitespace and adds period', () => {
    const res = enforceDutchAndSMART('  plannen een project  ');
    expect(res).toBe('De student kan plannen een project.');
  });

  it('lowercases first letter after prefix', () => {
    const res = enforceDutchAndSMART('Ontwerpen een website');
    expect(res).toBe('De student kan ontwerpen een website.');
  });
});
