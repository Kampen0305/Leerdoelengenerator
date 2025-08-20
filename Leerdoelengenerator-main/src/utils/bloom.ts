export type BloomKey = 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';

const MAP: Record<BloomKey, { nl: string; desc: string }> = {
  remember: { nl: 'Onthouden', desc: 'de student herinnert of benoemt basiskennis' },
  understand: { nl: 'Begrijpen', desc: 'de student legt uit in eigen woorden of licht toe' },
  apply: { nl: 'Toepassen', desc: 'de student gebruikt kennis in een praktische situatie' },
  analyze: { nl: 'Analyseren', desc: 'de student onderzoekt, vergelijkt of legt verbanden' },
  evaluate: { nl: 'Evalueren', desc: 'de student beoordeelt, beargumenteert of trekt conclusies' },
  create: { nl: 'Creëren', desc: 'de student ontwerpt, ontwikkelt of bedenkt iets nieuws' },
};

function join(items: string[]): string {
  if (items.length <= 1) return items[0];
  return `${items.slice(0, -1).join(', ')} en ${items.slice(-1)[0]}`;
}

export function formatBloom(raw?: string): { label: string; description: string } | null {
  if (!raw) return null;

  const spaced = raw.replace(/([a-z])([A-Z])/g, '$1 $2');
  const tokens = spaced.toLowerCase().split(/[^\p{L}]+/u).filter(Boolean);

  const expanded = tokens.flatMap(t =>
    t.includes('rememberunderstand') ? ['remember', 'understand'] : t
  );

  const keys = Array.from(new Set(expanded)).filter((k): k is BloomKey => k in MAP);
  if (keys.length === 0) return null;

  const labels = keys.map(k => MAP[k].nl);
  const descs = keys.map(k => MAP[k].desc);

  return {
    label: `Niveau volgens Bloom: ${join(labels)}`,
    description: `${join(descs)}.`,
  };
}

export default formatBloom;
