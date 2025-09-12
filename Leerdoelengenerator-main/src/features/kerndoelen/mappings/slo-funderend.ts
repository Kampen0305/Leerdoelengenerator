import type { AiBaanSettings, Kerndoel } from '../../../lib/standards/types';
import { applyAiBaanRules } from '../../ai-banen/applyAiBaanRules';
import { track } from '../../../services/telemetry';

export interface Section {
  title: string;
  content: string[];
}

export interface FunderendOutput {
  A: Section; // Officiële kerndoelen
  B: Section; // Didactische leerdoelen
  C: Section; // Werkvormen
  D: Section; // Differentiatie & TOS
  E: Section; // Bewijsvormen
}

export function mapKerndoel(
  kerndoel: Kerndoel,
  settings: AiBaanSettings
): FunderendOutput {
  const sectionA: Section = {
    title: 'Officiële kerndoelen',
    content: [
      kerndoel.kernzin,
      ...kerndoel.subdoelen.map((s) => `${s.code}: ${s.tekst}`),
    ],
  };

  const sectionB: Section = {
    title: 'Didactische leerdoelen',
    content: [],
  };

  let sectionC: Section = {
    title: 'Werkvormen',
    content: [],
  };
  sectionC = applyAiBaanRules(sectionC, settings);

  const sectionD: Section = {
    title: 'Differentiatie & TOS',
    content: [],
  };

  const sectionE: Section = {
    title: 'Bewijsvormen',
    content: ['Observatie', 'Product + logboek', 'Gesprek'],
  };

  const output = { A: sectionA, B: sectionB, C: sectionC, D: sectionD, E: sectionE };
  track('funderend_output_generated');
  return output;
}
