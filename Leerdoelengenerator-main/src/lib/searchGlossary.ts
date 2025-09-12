import { getAllBegrippen } from '@/lib/glossary';
import type { Begrip, BegripCategorie } from '@/types/glossary';

export function filterGlossary(params: {
  q?: string;
  letter?: string;
  category?: BegripCategorie | 'Alle';
}): Begrip[] {
  let items = getAllBegrippen();
  const { q, letter, category } = params;

  if (letter && letter !== 'Alle') {
    items = items.filter(i => i.titel.toUpperCase().startsWith(letter.toUpperCase()));
  }
  if (category && category !== 'Alle') {
    items = items.filter(i => i.categorie === category);
  }
  if (q && q.trim()) {
    const t = q.toLowerCase();
    items = items.filter(i =>
      (i.titel + ' ' + i.definitie).toLowerCase().includes(t)
    );
  }
  return items.sort((a, b) => a.titel.localeCompare(b.titel, 'nl'));
}
