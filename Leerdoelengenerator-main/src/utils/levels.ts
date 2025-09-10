// Canonieke waarden die je app accepteert.
// Pas desgewenst aan.
export type Level =
  | "VSO"
  | "VO"
  | "MBO-1"
  | "MBO-2"
  | "MBO-3"
  | "MBO-4"
  | "HBO-Ad"
  | "HBO-Bachelor"
  | "HBO-Master"
  | "WO-Bachelor"
  | "WO-Master";

const CANONICAL: Level[] = [
  "VSO","VO",
  "MBO-1","MBO-2","MBO-3","MBO-4",
  "HBO-Ad","HBO-Bachelor","HBO-Master",
  "WO-Bachelor","WO-Master",
];

// Veelvoorkomende varianten/synoniemen → canoniek
const MAP: Record<string, Level> = {
  "vso": "VSO",
  "vo": "VO",
  "mbo": "MBO-4",           // kale “mbo” → kies default, pas aan indien gewenst
  "mbo-1": "MBO-1",
  "mbo1": "MBO-1",
  "mbo-2": "MBO-2",
  "mbo2": "MBO-2",
  "mbo-3": "MBO-3",
  "mbo3": "MBO-3",
  "mbo-4": "MBO-4",
  "mbo4": "MBO-4",
  "hbo": "HBO-Bachelor",
  "hbo-bachelor": "HBO-Bachelor",
  "hbo bachelor": "HBO-Bachelor",
  "bachelor": "HBO-Bachelor",
  "ad": "HBO-Ad",
  "hbo-ad": "HBO-Ad",
  "associate degree": "HBO-Ad",
  "hbo-master": "HBO-Master",
  "master": "HBO-Master",
  "wo": "WO-Bachelor",
  "wo-bachelor": "WO-Bachelor",
  "wo-master": "WO-Master",
};

export function normalizeLevel(input?: string | null): Level | null {
  if (!input) return null;
  const s = String(input).trim().toLowerCase();
  // exact match op canoniek?
  const exact = CANONICAL.find(c => c.toLowerCase() === s);
  if (exact) return exact;
  // via mapping?
  if (MAP[s]) return MAP[s];

  // heuristiek: vang patroon “mbo niveau X”
  const mboMatch = s.match(/mbo[\s-]*(niveau)?\s*([1-4])/);
  if (mboMatch) return (`MBO-${mboMatch[2]}` as Level);

  // heuristiek: “wo master/bachelor”
  if (/\bwo\b.*\bmaster\b/.test(s)) return "WO-Master";
  if (/\bwo\b.*\bbachelor\b/.test(s)) return "WO-Bachelor";

  return null;
}

// Verplichte resolver: probeert context te gebruiken en gooit anders een fout
export function resolveLevelStrict(opts: {
  raw?: string | null;
  opleidingstype?: string | null;      // bv. "mbo", "hbo", "wo", "vso", "vo"
  kdCode?: string | null;              // bv. "KD 25166" (mbo)
  fallback?: Level;                    // optioneel, maar liever niet gebruiken
}): Level {
  const tries: (string | null | undefined)[] = [
    opts.raw,
    opts.opleidingstype,
    opts.kdCode, // alleen voor heuristiek
  ];

  // 1) rechtstreekse/afgeleide normalisatie
  for (const t of tries) {
    const n = normalizeLevel(t ?? null);
    if (n) return n;
  }

  // 2) kdCode simple rule-of-thumb: “KD ” → mbo (pas desgewenst aan)
  if (opts.kdCode && /kd\s*\d+/i.test(opts.kdCode)) {
    return "MBO-4"; // kies jouw default; of leid af uit andere velden
  }

  // 3) expliciete fallback gebruiken als je dat echt wilt
  if (opts.fallback) return opts.fallback;

  // 4) hard error: dev ziet meteen waar het misgaat
  throw new Error(
    `Niveau onbekend en niet herleidbaar. Vul ‘niveau’ of ‘opleidingstype’ in (gekregen: raw="${opts.raw}", opleidingstype="${opts.opleidingstype}", kdCode="${opts.kdCode}")`
  );
}
