import { describe, expect, it } from 'vitest';
import { loadKerndoelen } from '@/lib/standards';
import { mapKerndoel } from '@/features/kerndoelen/mappings/slo-funderend';
import { generateFromEindtermen } from '@/features/examenprogramma/generateFromEindtermen';
import type { AiBaanSettings } from '@/lib/standards/types';

describe('Smoke flows', () => {
  const settings: AiBaanSettings = { baan: 2, transparantie: true, procesbewijzen: true };

  it('VSO > Burgerschap > Baan 2 > export OK', () => {
    const data = loadKerndoelen('bg_funderend.v1.json');
    const kd = data.find((k) => k.sectors.includes('VSO'))!;
    const res = mapKerndoel(kd, settings);
    expect(res.C.content.join(' ')).toMatch(/Transparantie/);
  });

  it('VO > bovenbouw > eindtermen plakken > Baan 2 > export OK', () => {
    const res = generateFromEindtermen(
      { vak: 'Nederlands', niveau: 'havo', eindtermen: 'Schrijfvaardigheid' },
      settings
    );
    expect(res.C.content.join(' ')).toMatch(/Transparantie/);
  });
});
