import type { AiBaanSettings } from '../../lib/standards/types';
import { applyAiBaanRules } from '../ai-banen/applyAiBaanRules';
import { track } from '../../services/telemetry';

export interface EindtermInput {
  vak: string;
  niveau: 'havo' | 'vwo';
  cohort?: string;
  eindtermen: string;
}

export interface Section {
  title: string;
  content: string[];
}

export interface VoBovenbouwOutput {
  A: Section; // Eindterm-bron
  B: Section; // Didactische leeruitkomsten
  C: Section; // Werkvormen
  D: Section; // Beoordeling
  E: Section; // Waarden/Privacy
}

export function generateFromEindtermen(
  input: EindtermInput,
  settings: AiBaanSettings
): VoBovenbouwOutput {
  const sectionA: Section = {
    title: 'Eindterm-bron',
    content: input.eindtermen.split(/\n+/).filter((l) => l.trim().length > 0),
  };

  const sectionB: Section = {
    title: 'Didactische leeruitkomsten',
    content: [],
  };

  let sectionC: Section = { title: 'Werkvormen', content: [] };
  sectionC = applyAiBaanRules(sectionC, settings);

  const sectionD: Section = {
    title: 'Beoordeling',
    content: ['CE/SE-koppeling', 'Observatiepunten', 'Verantwoording + procesbewijs'],
  };

  const sectionE: Section = {
    title: 'Waarden/Privacy',
    content: ['Rechtvaardigheid, menselijkheid en autonomie; raadpleeg instellingsbeleid.'],
  };

  const output = { A: sectionA, B: sectionB, C: sectionC, D: sectionD, E: sectionE };
  track('bovenbouw_output_generated');
  return output;
}
