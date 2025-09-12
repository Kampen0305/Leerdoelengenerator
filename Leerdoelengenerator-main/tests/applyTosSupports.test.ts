import { describe, expect, it } from 'vitest';
import { applyTosSupports } from '@/features/tos/applyTosSupports';
import type { TosSupport } from '@/lib/standards/types';

describe('applyTosSupports', () => {
  it('officiële bron blijft onaangeroerd', () => {
    const input = { text: 'Officiële tekst' };
    const tos: TosSupport = {
      spraakNaarTekst: false,
      taalvereenvoudiging: 'uit',
      visueleHints: false,
      woordenschatBank: false,
      leesniveau: 'A1',
    };
    const res = applyTosSupports(input, tos);
    expect(res.text).toBe('Officiële tekst');
  });
});
