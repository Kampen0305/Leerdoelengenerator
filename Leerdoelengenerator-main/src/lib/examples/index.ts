import type { Sector } from '@/lib/standards/types';
import base from '@/data/examples/voorbeeldcases.funderend+wo.v1.json';
import mbo from '@/data/examples/voorbeeldcases.mbo.v1.json';
import hbo from '@/data/examples/voorbeeldcases.hbo.v1.json';

export interface VoorbeeldCase {
  id: string; // slug, uniek
  titel: string;
  sector: Sector;
  leergebied?: 'BURGERSCHAP' | 'DG' | 'ALGEMEEN';
  korteBeschrijving: string;
  baan: 1 | 2;
  inputs: string[];
  expected: string[];
}

export const allVoorbeeldcases: VoorbeeldCase[] = [...mbo, ...hbo, ...base];

export function getCasesBySector(sector: Sector) {
  return allVoorbeeldcases.filter((c) => c.sector === sector);
}
