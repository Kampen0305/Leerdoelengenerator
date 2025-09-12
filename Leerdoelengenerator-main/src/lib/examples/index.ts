import { allVoorbeeldcases, VoorbeeldCase, Sector } from '@/data/examples/allExamples';

export type { VoorbeeldCase, Sector };

export function getAllVoorbeeldcases(): VoorbeeldCase[] {
  return allVoorbeeldcases;
}

export function getCasesBySector(sector?: Sector|null): VoorbeeldCase[] {
  if (!sector) return allVoorbeeldcases;
  return allVoorbeeldcases.filter(c => c.sector === sector);
}

export function getSectorCounts() {
  return allVoorbeeldcases.reduce<Record<string, number>>((acc, c) => {
    acc[c.sector] = (acc[c.sector] ?? 0) + 1;
    return acc;
  }, {});
}

