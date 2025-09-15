// --- COPY START ---
// File: src/core/education/scope-and-sources.ts

// 1) Types & constants
export type Sector = 'PO' | 'SO' | 'VSO' | 'VO' | 'MBO' | 'HBO' | 'WO';
export type Lane = 1 | 2; // Npuls two-lane (werkt alleen voor beroepsonderwijs, maar is niet verplicht in funderend)

export type EducationCategory = 'FUNDEREND' | 'BEROEPSONDERWIJS';

export interface SourceRef {
  id: string;
  title: string;
  publisher?: string;
  year?: string;
  url?: string; // optioneel; kan naar interne docs / viewer wijzen
}

export interface SourceBundle {
  category: EducationCategory;
  label: string; // korte badge in de UI
  longLabel: string; // volledige zin voor in de output
  sources: SourceRef[];
}

export interface GeneratorContext {
  sector: Sector;
  lane?: Lane; // alleen relevant bij MBO/HBO/WO
  domain?: 'BURGERSCHAP' | 'DG' | 'ALGEMEEN';
  prompt?: string;
}

// 2) Categorie-afleiding
export function toCategory(sector: Sector): EducationCategory {
  switch (sector) {
    case 'PO':
    case 'SO':
    case 'VSO':
    case 'VO':
      return 'FUNDEREND';
    case 'MBO':
    case 'HBO':
    case 'WO':
      return 'BEROEPSONDERWIJS';
  }
}

// 3) Bronbundels (pas URLs gerust aan jouw routes of file-viewer aan)
const FUNDEREND_SOURCES: SourceBundle = {
  category: 'FUNDEREND',
  label: 'Kerndoelen (SLO)',
  longLabel:
    'Gebaseerd op de SLO-kerndoelen (2025) voor het funderend onderwijs.',
  sources: [
    {
      id: 'slo-kerndoelen-burgerschap-dg-2025',
      title:
        'Definitieve conceptkerndoelen Burgerschap & Digitale Geletterdheid (SLO, 2025)',
      publisher: 'SLO',
      year: '2025',
      url: '/docs/slo/kerndoelen-burgerschap-dg-2025.pdf',
    },
    // Voeg indien gewenst ook NL en Rekenen/Wiskunde toe als jouw generator die domeinen gebruikt
  ],
};

const BEROEP_SOURCES: SourceBundle = {
  category: 'BEROEPSONDERWIJS',
  label: 'Npuls (AI & Toetsing)',
  longLabel:
    'Gebaseerd op de Npuls-visie op AI-bewuste toetsing en handreikingen (incl. AI-GO en Referentiekader studiedata & AI).',
  sources: [
    {
      id: 'npuls-visie-toetsing-ai-2025',
      title:
        'Visie op toetsing en examinering in het tijdperk van AI (Npuls, 2025)',
      publisher: 'Npuls',
      year: '2025',
      url: 'https://npuls.nl/kennisbank/visie-op-toetsing-examinering-en-ai-handreikingen',
    },
    {
      id: 'npuls-handreiking-1',
      title: 'Handreiking 1: Toetsing en examinering in het tijdperk van AI',
      publisher: 'Npuls',
      year: '2025',
      url: 'https://npuls.nl/kennisbank/visie-op-toetsing-examinering-en-ai-handreikingen',
    },
    {
      id: 'npuls-handreiking-2',
      title: 'Handreiking 2',
      publisher: 'Npuls',
      year: '2025',
      url: '/docs/npuls/handreiking-2.pdf',
    },
    {
      id: 'npuls-handreiking-3',
      title: 'Handreiking 3',
      publisher: 'Npuls',
      year: '2025',
      url: '/docs/npuls/handreiking-3.pdf',
    },
    {
      id: 'npuls-handreiking-4',
      title: 'Handreiking 4',
      publisher: 'Npuls',
      year: '2025',
      url: '/docs/npuls/handreiking-4.pdf',
    },
    {
      id: 'npuls-aigo-2025',
      title: 'AI-GO! Raamwerk AI-geletterdheid (Npuls, 2025)',
      publisher: 'Npuls',
      year: '2025',
      url: 'https://npuls.nl/kennisbank/ai-go-een-raamwerk-voor-ai-geletterdheid-in-het-onderwijs',
    },
    {
      id: 'npuls-referentiekader-2.0-2025',
      title: 'Referentiekader 2.0 Verantwoord gebruik studiedata & AI (Npuls)',
      publisher: 'Npuls',
      year: '2025',
      url: 'https://npuls.nl/kennisbank/referentiekader-2-0-verantwoord-gebruik-van-studiedata-en-ai',
    },
  ],
};

// 4) Bundelresolutie
export function resolveSourceBundle(sector: Sector): SourceBundle {
  return toCategory(sector) === 'FUNDEREND'
    ? FUNDEREND_SOURCES
    : BEROEP_SOURCES;
}

// 5) Veiligheidscheck tegen “HBO bij PO”
export function assertSectorOutputConsistency(
  inputSector: Sector,
  outputSectorLabel: Sector | 'FUNDEREND' | 'BEROEPSONDERWIJS'
) {
  const cat = toCategory(inputSector);
  if (outputSectorLabel === 'FUNDEREND' || outputSectorLabel === 'BEROEPSONDERWIJS') {
    // Labelt op categorie-niveau, check alleen categorie
    const mapped =
      outputSectorLabel === 'FUNDEREND' ? 'FUNDEREND' : 'BEROEPSONDERWIJS';
    if (mapped !== cat) {
      throw new Error(
        `Ongeldige outputlabel-categorie: verwacht ${cat}, maar kreeg ${mapped}.`
      );
    }
    return;
  }
  // Labelt op sectorniveau, dan moet het exact matchen
  if (inputSector !== outputSectorLabel) {
    throw new Error(
      `Ongeldige outputlabel-sector: verwacht ${inputSector}, maar kreeg ${outputSectorLabel}.`
    );
  }
}

// 6) UI-badge helper (optioneel)
export function categoryBadge(sector: Sector): { text: string; tone: 'green' | 'blue' } {
  const cat = toCategory(sector);
  return cat === 'FUNDEREND'
    ? { text: 'Funderend onderwijs', tone: 'green' }
    : { text: 'Beroepsonderwijs', tone: 'blue' };
}

// 7) Output-annotatie (zet onder elk leerdoel)
export function annotateWithSources(
  sector: Sector,
  lines: string[],
  opts?: { showList?: boolean; showLane?: boolean; lane?: Lane }
): string {
  const bundle = resolveSourceBundle(sector);
  const laneInfo =
    opts?.showLane && toCategory(sector) === 'BEROEPSONDERWIJS' && opts?.lane
      ? ` | Npuls two-lane: baan ${opts.lane}`
      : '';
  const header = `\n\n—\n[${bundle.label}] ${bundle.longLabel}${laneInfo}`;
  const list =
    opts?.showList !== false
      ? `\nBronnen:\n${bundle.sources
          .map(
            (s, i) =>
              ` ${i + 1}. ${s.title}${s.publisher ? ` — ${s.publisher}` : ''}${
                s.year ? ` (${s.year})` : ''
              }`
          )
          .join('\n')}`
      : '';
  return [...lines, header + list].join('\n');
}

// 8) Voorbeeld-generator (plug dit in jouw bestaande flow)
export interface GeneratedGoal {
  sector: Sector;
  category: EducationCategory;
  title: string;
  goalText: string; // het leerdoel zelf
  meta: {
    label: string; // 'Funderend onderwijs' of 'Beroepsonderwijs'
    lane?: Lane;
    sources: SourceRef[];
  };
  annotated: string; // goalText + bronvermelding
}

export function generateLearningGoal(ctx: GeneratorContext): GeneratedGoal {
  const category = toCategory(ctx.sector);
  const bundle = resolveSourceBundle(ctx.sector);

  // VOORKOM BUG: input-sector en output-label moeten lijnrecht overeenkomen.
  // We labelen hier op CATEGORIE-niveau (duidelijk en niet foutgevoelig).
  assertSectorOutputConsistency(ctx.sector, category === 'FUNDEREND' ? 'FUNDEREND' : 'BEROEPSONDERWIJS');

  // (Hier plug je jouw eigen LLM-prompting in. Voor demo genereren we een placeholder.)
  const title =
    category === 'FUNDEREND'
      ? 'Leerdoel (funderend) — Digitale geletterdheid: informatievaardigheden'
      : 'Leeruitkomst (beroepsonderwijs) — AI-bewuste beroepsopdracht';

  const goalBody =
    category === 'FUNDEREND'
      ? [
          'De leerling kan, met passende begeleiding, digitale informatie gericht zoeken, beoordelen op betrouwbaarheid en de bevindingen ordelijk presenteren, passend bij doel en publiek.',
          'Criteria (voorbeeld): zoekstrategie benoemd; bronvermelding aanwezig; onderscheid feit/mening; eenvoudige reflectie op betrouwbaarheid.'
        ]
      : [
          'De student kan in een realistische beroepscontext AI-tools doelgericht en verantwoord inzetten voor analyse/creatie, en onderbouwt beslissingen met aandacht voor validiteit, ethiek en toetsintegriteit.',
          'Criteria (voorbeeld): transparante verantwoording van AI-gebruik; reflectie op bias/risico’s; aantoonbare eigen bijdrage; keuze voor toetsvorm ondersteunt authenticiteit.'
        ];

  const label =
    category === 'FUNDEREND' ? 'Funderend onderwijs' : 'Beroepsonderwijs';

  const annotated = annotateWithSources(
    ctx.sector,
    [title, '', ...goalBody],
    {
      showList: true,
      showLane: category === 'BEROEPSONDERWIJS',
      lane: ctx.lane,
    }
  );

  return {
    sector: ctx.sector,
    category,
    title,
    goalText: [title, '', ...goalBody].join('\n'),
    meta: { label, lane: ctx.lane, sources: bundle.sources },
    annotated,
  };
}

// 9) Eenvoudige tests (kun je draaien met vitest/jest)
export function __selfTest__() {
  // Case 1: PO moet funderend zijn, en mag nooit HBO-label krijgen
  const po = generateLearningGoal({ sector: 'PO' });
  if (po.category !== 'FUNDEREND') throw new Error('PO niet als FUNDEREND geclassificeerd');
  if (!po.annotated.includes('SLO-kerndoelen')) throw new Error('SLO-verwijzing ontbreekt bij PO');

  // Case 2: MBO moet beroepsonderwijs zijn en toont Npuls-kaders
  const mbo = generateLearningGoal({ sector: 'MBO', lane: 2 });
  if (mbo.category !== 'BEROEPSONDERWIJS') throw new Error('MBO niet als BEROEPS geclassificeerd');
  if (!mbo.annotated.includes('Npuls-visie')) throw new Error('Npuls-verwijzing ontbreekt bij MBO');
  if (!mbo.annotated.includes('baan 2')) throw new Error('Lane-informatie ontbreekt bij MBO');

  // Case 3: Hard fail wanneer iemand verkeerd labelt (simulatie)
  let threw = false;
  try {
    assertSectorOutputConsistency('PO', 'HBO' as Sector);
  } catch {
    threw = true;
  }
  if (!threw) throw new Error('Mismatch PO→HBO is niet geblokkeerd');
}

// --- COPY END ---
