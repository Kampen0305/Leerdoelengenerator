import { describe, expect, it } from 'vitest';
import { loadKerndoelen } from '@/lib/standards';
import { mapKerndoel } from '@/features/kerndoelen/mappings/slo-funderend';
import { generateFromEindtermen } from '@/features/examenprogramma/generateFromEindtermen';
import type { AiBaanSettings } from '@/lib/standards/types';

const settings: AiBaanSettings = { baan: 2, transparantie: true, procesbewijzen: true };

describe('Integration flows', () => {
  it('Case A: VO onderbouw DG baan2', () => {
    const data = loadKerndoelen('dg_funderend.v1.json');
    const kd = data[0];
    const res = mapKerndoel(kd, settings);
    expect(res.A.content[0]).toBe(kd.kernzin);
    expect(res.C.content.join(' ')).toMatch(/Transparantie/);
  });

  it('Case B: VO bovenbouw eindterm baan2', () => {
    const res = generateFromEindtermen(
      {
        vak: 'Nederlands',
        niveau: 'havo',
        eindtermen: 'De kandidaat kan argumenten analyseren.'
      },
      settings
    );
    expect(res.A.content[0]).toBe('De kandidaat kan argumenten analyseren.');
    expect(res.C.content.join(' ')).toMatch(/Transparantie/);
    expect(res.E.content.join(' ')).toMatch(/autonomie/);
  });
});
