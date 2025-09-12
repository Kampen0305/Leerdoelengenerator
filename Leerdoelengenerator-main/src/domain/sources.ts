import { OnderwijsSector } from './niveau';

export type BaseDoc = {
  id: string;
  title: string;
  source: 'SLO' | 'Npuls';
  year?: number;
};

const SLO_BURGER_DIGI: BaseDoc = {
  id: 'slo_burgerschap_digitaal_2025',
  title: 'SLO — Definitieve conceptkerndoelen: burgerschap & digitale geletterdheid (2025)',
  source: 'SLO',
  year: 2025,
};

const NPULS_AIGO: BaseDoc = {
  id: 'npuls_aigo_2025',
  title: 'Npuls — AI-GO! Raamwerk AI-geletterdheid (2025)',
  source: 'Npuls',
  year: 2025,
};

const NPULS_HANDREIKING_TOETSING: BaseDoc = {
  id: 'npuls_handreiking_toetsing_ai_2025',
  title: 'Npuls — Toetsing & examinering in het tijdperk van AI (Handreiking 1, 2025)',
  source: 'Npuls',
  year: 2025,
};

const NPULS_REFERENTIEKADER: BaseDoc = {
  id: 'npuls_referentiekader_2_0_2025',
  title: 'Npuls — Referentiekader 2.0: verantwoord gebruik studiedata & AI (2025)',
  source: 'Npuls',
  year: 2025,
};

export function getSourcesForSector(sector: OnderwijsSector): BaseDoc[] {
  switch (sector) {
    case 'PO':
    case 'SO':
    case 'VSO':
    case 'VO':
      return [SLO_BURGER_DIGI];
    case 'MBO':
    case 'HBO':
    case 'WO':
      return [NPULS_AIGO, NPULS_HANDREIKING_TOETSING, NPULS_REFERENTIEKADER];
    default: {
      const neverSector: never = sector;
      throw new Error(`Onbekende sector: ${(neverSector as any) ?? 'undefined'}`);
    }
  }
}

/** Handig hulpfunctietje om context aan je generator te geven */
export function buildGenerationContext(input: {
  sector: OnderwijsSector;
  programSubtype?: string;
}) {
  const { sector, programSubtype } = input;
  // Lazy import om circulaire deps te vermijden
  const { getNiveauBadge } = require('./niveau') as typeof import('./niveau');
  const badge = getNiveauBadge(sector, programSubtype);
  const sources = getSourcesForSector(sector);
  return { badge, sources };
}
