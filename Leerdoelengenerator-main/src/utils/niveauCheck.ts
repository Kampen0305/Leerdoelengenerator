export type BloomKey = 'remember'|'understand'|'apply'|'analyze'|'evaluate'|'create';

export const BLOOM_NL: Record<BloomKey, {nl: string; desc: string}> = {
  remember:   { nl: 'Onthouden',  desc: 'de student herinnert of benoemt basiskennis' },
  understand: { nl: 'Begrijpen',  desc: 'de student legt uit in eigen woorden of licht toe' },
  apply:      { nl: 'Toepassen',  desc: 'de student gebruikt kennis in een praktische situatie' },
  analyze:    { nl: 'Analyseren', desc: 'de student onderzoekt, vergelijkt of legt verbanden' },
  evaluate:   { nl: 'Evalueren',  desc: 'de student beoordeelt, beargumenteert of trekt conclusies' },
  create:     { nl: 'Creëren',    desc: 'de student ontwerpt, ontwikkelt of bedenkt iets nieuws' },
};

export const DUTCH_VERBS: Record<BloomKey, string[]> = {
  remember:   ['noemt','beschrijft','definieert','herkent'],
  understand: ['legt uit','licht toe','vat samen','interpreteert'],
  apply:      ['past toe','gebruikt','toepassen','hanteert'],
  analyze:    ['analyseert','vergelijkt','ordent','maakt onderscheid'],
  evaluate:   ['beoordeelt','onderbouwt','evalueert','kritiseert'],
  create:     ['ontwerpt','ontwikkelt','formuleert','creëert'],
};

export type LevelKey =
  | 'VSO:dagbesteding' | 'VSO:arbeidsmarktgericht' | 'VSO:vervolgonderwijs'
  | 'VO:vmbo-basis' | 'VO:vmbo-kader' | 'VO:vmbo-gemengde' | 'VO:vmbo-theoretische' | 'VO:havo' | 'VO:vwo'
  | 'MBO:1' | 'MBO:2' | 'MBO:3' | 'MBO:4'
  | 'HBO:AD' | 'HBO:Bachelor' | 'HBO:Master'
  | 'WO:Bachelor' | 'WO:Master';

export const expectedBloomBands: Record<LevelKey, BloomKey[]> = {
  // VSO
  'VSO:dagbesteding':        ['remember','understand'],
  'VSO:arbeidsmarktgericht': ['remember','understand','apply'],
  'VSO:vervolgonderwijs':    ['understand','apply','analyze'],

  // VO
  'VO:vmbo-basis':           ['remember','understand','apply'],
  'VO:vmbo-kader':           ['remember','understand','apply'],
  'VO:vmbo-gemengde':        ['understand','apply','analyze'],
  'VO:vmbo-theoretische':    ['understand','apply','analyze'],
  'VO:havo':                 ['apply','analyze','evaluate'],
  'VO:vwo':                  ['analyze','evaluate','create'],

  // MBO
  'MBO:1':                   ['remember','understand'],
  'MBO:2':                   ['remember','understand','apply'],
  'MBO:3':                   ['understand','apply','analyze'],
  'MBO:4':                   ['apply','analyze','evaluate'],

  // HBO
  'HBO:AD':                  ['apply','analyze'],
  'HBO:Bachelor':            ['analyze','evaluate','create'],
  'HBO:Master':              ['evaluate','create'],

  // WO
  'WO:Bachelor':             ['analyze','evaluate'],
  'WO:Master':               ['evaluate','create'],
};

const BLOOM_ORDER: BloomKey[] = ['remember','understand','apply','analyze','evaluate','create'];

export function nlJoin(arr: string[]): string {
  if (arr.length <= 1) return arr[0] ?? '';
  return `${arr.slice(0, -1).join(', ')} en ${arr[arr.length - 1]}`;
}

export function parseBloom(raw?: string): BloomKey[] {
  if (!raw) return [];
  const spaced = raw.replace(/(\p{Ll})(\p{Lu})/gu, '$1 $2');
  const tokens = spaced.toLowerCase().split(/[^\p{L}]+/u).filter(Boolean);
  const expanded = tokens.flatMap(t => t === 'rememberunderstand' ? ['remember','understand'] : t);
  const unique = Array.from(new Set(expanded));
  return unique.filter((t): t is BloomKey => (BLOOM_ORDER as string[]).includes(t));
}

export function detectDutchBloom(text: string): BloomKey[] {
  const found: BloomKey[] = [];
  const lower = text.toLowerCase();
  for (const key of BLOOM_ORDER) {
    for (const verb of DUTCH_VERBS[key]) {
      const re = new RegExp(`\\b${verb}\\b`, 'i');
      if (re.test(lower)) {
        found.push(key);
        break;
      }
    }
  }
  return Array.from(new Set(found));
}

export function formatBloomNl(keys: BloomKey[]): { label: string; desc: string } {
  const labels = keys.map(k => BLOOM_NL[k].nl);
  const descs = keys.map(k => BLOOM_NL[k].desc);
  return {
    label: `Niveau volgens Bloom: ${nlJoin(labels)}`,
    desc: `— ${nlJoin(descs)}`,
  };
}

export interface NiveauCheckResult {
  fit: 'passend' | 'te_hoog' | 'te_laag' | 'gemengd';
  detectedBlooms: BloomKey[];
  expectedBlooms: BloomKey[];
  messages: string[];
  autosuggest?: string;
  bloomLabelNl: string;
  bloomDescNl: string;
}

function bloomIndex(k: BloomKey): number {
  return BLOOM_ORDER.indexOf(k);
}

export function checkLevelFit(
  learningObjective: string,
  chosenLevel: LevelKey,
  modelBloom?: string
): NiveauCheckResult {
  const parsed = parseBloom(modelBloom);
  const heuristic = detectDutchBloom(learningObjective);
  const detected = Array.from(new Set([...parsed, ...heuristic]));
  const expected = expectedBloomBands[chosenLevel];

  let fit: NiveauCheckResult['fit'] = 'passend';
  if (detected.length === 0 || detected.every(b => expected.includes(b))) {
    fit = 'passend';
  } else if (detected.some(b => bloomIndex(b) > Math.max(...expected.map(bloomIndex)))) {
    fit = 'te_hoog';
  } else if (detected.every(b => bloomIndex(b) < Math.min(...expected.map(bloomIndex)))) {
    fit = 'te_laag';
  } else {
    fit = 'gemengd';
  }

  const messages: string[] = [];
  const wordCount = learningObjective.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount > 35) {
    messages.push('Leerdoel is te lang; formuleer compacter.');
  }

  const lowestVerb = DUTCH_VERBS[expected[0]][0];
  let startBloom: BloomKey | null = null;
  for (const key of BLOOM_ORDER) {
    for (const verb of DUTCH_VERBS[key]) {
      const re = new RegExp(`^\s*${verb}\\b`, 'i');
      if (re.test(learningObjective)) {
        startBloom = key;
        break;
      }
    }
    if (startBloom) break;
  }
  if (!startBloom || !expected.includes(startBloom)) {
    messages.push(`Begin met een passend, meetbaar werkwoord voor dit niveau (bv. '${lowestVerb}').`);
  }

  const hasCriteria = /\b(volgens|checklist|rubric|criteria|conform)\b/i.test(learningObjective);
  if (!hasCriteria) {
    messages.push("Noem een criterium/kwaliteit (bijv. 'volgens checklist/rubric').");
  }

  const hasAutonomy = /\b(zelfstandig|onder begeleiding|met instructie|met feedback)\b/i.test(learningObjective);
  if (!hasAutonomy) {
    messages.push('Noem mate van zelfstandigheid/begeleiding.');
  }

  const hasMeasure = /\b\d+\b|%|\b(?:uur|uren|minuten?|dagen?|weken?|maanden?|jaren?)\b/i.test(learningObjective);
  if (!hasMeasure) {
    messages.push('Maak het doel meetbaar (hoeveel/hoe goed/wanneer).');
  }

  if (fit !== 'passend') {
    const dir = fit === 'te_hoog' ? 'hoger' : fit === 'te_laag' ? 'lager' : 'hoger of lager';
    messages.push(`Denkniveau (Bloom) ligt ${dir} dan gebruikelijk voor ${chosenLevel}.`);
  }

  const bloomDisplay = formatBloomNl(detected.length > 0 ? detected : expected);

  return {
    fit,
    detectedBlooms: detected,
    expectedBlooms: expected,
    messages,
    autosuggest: `${lowestVerb} [taak] volgens [criterium], [meetbare norm], [zelfstandigheid].`,
    bloomLabelNl: bloomDisplay.label,
    bloomDescNl: bloomDisplay.desc,
  };
}
