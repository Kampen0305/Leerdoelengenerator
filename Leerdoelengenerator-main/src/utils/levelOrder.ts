export type LevelKey = 'WO' | 'HBO' | 'MBO' | 'VO' | 'VSO' | 'PO' | 'SO';

// Vaste rangorde: lager getal = hoger in de lijst
const ORDER: Record<LevelKey, number> = {
  WO: 0,
  HBO: 1,
  MBO: 2,
  VO: 3,
  VSO: 4,
  PO: 5,
  SO: 6,
};

// Probeert een niveau uit een string te halen (bv. "PO – DG: ..." of "mbo-sport" of "hbo-ict")
export function extractLevel(input: string): LevelKey | null {
  if (!input) return null;
  const s = input.toUpperCase();

  // Strikte checks eerst
  if (/\bWO\b/.test(s)) return 'WO';
  if (/\bHBO\b/.test(s)) return 'HBO';
  if (/\bMBO\b/.test(s)) return 'MBO';
  if (/\bVSO\b/.test(s)) return 'VSO';
  // Let op: "VO (onderbouw)" moet VO blijven
  if (/\bVO\b/.test(s)) return 'VO';
  if (/\bPO\b/.test(s)) return 'PO';
  if (/\bSO\b/.test(s)) return 'SO';

  // Veelgebruikte prefixes/slugs (zoals "mbo-ict")
  if (s.startsWith('WO-') || s.startsWith('WO ')) return 'WO';
  if (s.startsWith('HBO-') || s.startsWith('HBO ')) return 'HBO';
  if (s.startsWith('MBO-') || s.startsWith('MBO ')) return 'MBO';
  if (s.startsWith('VSO-') || s.startsWith('VSO ')) return 'VSO';
  if (s.startsWith('VO-')  || s.startsWith('VO '))  return 'VO';
  if (s.startsWith('PO-')  || s.startsWith('PO '))  return 'PO';
  if (s.startsWith('SO-')  || s.startsWith('SO '))  return 'SO';

  return null;
}

export function levelRank(input: string): number {
  const lvl = extractLevel(input);
  if (!lvl) return Number.POSITIVE_INFINITY; // Onbekend altijd onderaan
  return ORDER[lvl];
}

// Comparator om lijsten te sorteren
export function compareByLevel(a: string, b: string): number {
  const ra = levelRank(a);
  const rb = levelRank(b);
  if (ra !== rb) return ra - rb;
  // secondairy: alfabetisch, zodat items binnen hetzelfde niveau stabiel staan
  return a.localeCompare(b, 'nl');
}

