import { describe, expect, it } from 'vitest';
import { applyAiBaanRules } from '@/features/ai-banen/applyAiBaanRules';
import type { AiBaanSettings } from '@/lib/standards/types';

describe('applyAiBaanRules', () => {
  const section = { content: ['Werkvorm 1'] };
  it('Baan1 ⇒ géén Transp/Proces/Reflectie', () => {
    const settings: AiBaanSettings = { baan: 1, transparantie: false, procesbewijzen: false };
    const res = applyAiBaanRules(section, settings);
    expect(res.content.some((c) => /Transparantie/.test(c))).toBe(false);
  });

  it('Baan2 ⇒ wel Transp/Proces/Reflectie', () => {
    const settings: AiBaanSettings = { baan: 2, transparantie: true, procesbewijzen: true };
    const res = applyAiBaanRules(section, settings);
    expect(res.content.join(' ')).toMatch(/Transparantie/);
    expect(res.content.join(' ')).toMatch(/Procesbewijzen/);
    expect(res.content.join(' ')).toMatch(/Reflectie/);
  });
});
