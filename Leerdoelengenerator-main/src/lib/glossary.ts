import base from '@/data/begrippen.json';
import kerndoelen from '@/data/begrippen.kerndoelen.json';
import type { Begrip } from '@/types/glossary';

export function getAllBegrippen(): Begrip[] {
  // Merge by slug, kerndoelen mag bestaande NIET overschrijven
  const map = new Map<string, Begrip>();
  [...(base as Begrip[]), ...(kerndoelen as Begrip[])].forEach(b => {
    if (!map.has(b.slug)) map.set(b.slug, b);
  });
  return Array.from(map.values()).sort((a, b) => a.titel.localeCompare(b.titel, 'nl'));
}

export function getBegripMap(): Record<string, Begrip> {
  return getAllBegrippen().reduce((acc, b) => {
    acc[b.titel.toLowerCase()] = b;
    acc[b.slug] = b;
    return acc;
  }, {} as Record<string, Begrip>);
}
