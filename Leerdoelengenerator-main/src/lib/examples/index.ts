import { allVoorbeeldcases, VoorbeeldCase, Sector } from '@/data/examples/allExamples';

export type { VoorbeeldCase, Sector };

const sectorOrder: Sector[] = ['WO', 'HBO', 'MBO', 'VO', 'VSO', 'PO', 'SO'];
const sectorRank = sectorOrder.reduce<Record<Sector, number>>((acc, s, i) => {
  acc[s] = i;
  return acc;
}, {} as Record<Sector, number>);

export function getAllVoorbeeldcases(): VoorbeeldCase[] {
  return [...allVoorbeeldcases].sort(
    (a, b) => sectorRank[a.sector] - sectorRank[b.sector]
  );
}

export function getCasesBySector(sector?: Sector | null): VoorbeeldCase[] {
  if (!sector) return getAllVoorbeeldcases();
  return allVoorbeeldcases
    .filter((c) => c.sector === sector)
    .sort((a, b) => sectorRank[a.sector] - sectorRank[b.sector]);
}

export function getSectorCounts() {
  return allVoorbeeldcases.reduce<Record<string, number>>((acc, c) => {
    acc[c.sector] = (acc[c.sector] ?? 0) + 1;
    return acc;
  }, {});
}

