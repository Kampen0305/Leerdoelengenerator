import data from '@/data/glossary.json';
import { GlossaryItem, GlossaryCategory } from '@/types/glossary';

export function getAll(): GlossaryItem[] { return data as GlossaryItem[]; }

export function filterGlossary(params: {
  q?: string;
  letter?: string;
  category?: GlossaryCategory | 'Alle';
}): GlossaryItem[] {
  let items = getAll();
  const { q, letter, category } = params;

  if (letter && letter !== 'Alle') {
    items = items.filter(i => i.term.toUpperCase().startsWith(letter.toUpperCase()));
  }
  if (category && category !== 'Alle') {
    items = items.filter(i => i.category === category);
  }
  if (q && q.trim()) {
    const t = q.toLowerCase();
    items = items.filter(i =>
      (i.term + ' ' + i.definition + ' ' + (i.alsoKnownAs ?? []).join(' '))
      .toLowerCase().includes(t)
    );
  }
  return items.sort((a,b)=> a.term.localeCompare(b.term, 'nl'));
}
