import { EducationLevel, GoalOrientation, SuggestionBundle, AssessmentSuggestion } from '@/types/learning';
import { TOETSVORMEN } from '@/data/toetsvormen';

const TOETSVORM_INDEX = new Map(TOETSVORMEN.map(item => [item.id, item]));

function assessmentFromToetsvorm(
  id: string,
  why: string,
  flags: Pick<AssessmentSuggestion, 'formative' | 'summative'> = {},
): AssessmentSuggestion {
  const item = TOETSVORM_INDEX.get(id);
  return {
    title: item?.naam ?? id,
    description: item?.beschrijving ?? 'Zie toetsvormenbibliotheek voor details.',
    why,
    ...flags,
  };
}

type Key = `${GoalOrientation}:${EducationLevel}`;
const base: Record<Key, SuggestionBundle> = {
  'kennis:MBO-3': {
    activities: [
      { title: '3–2–1 uitleg', description: 'Student noteert 3 kernbegrippen, 2 verbanden, 1 vraag en bespreekt die in duo’s.', duration: '20 min', why: 'Activeert voorkennis en begrip (kennisdoel).' },
      { title: 'Mini-lecture met check', description: 'Korte instructie gevolgd door 5 conceptvragen via Mentimeter/Forms.', duration: '25 min', why: 'Snelle formatieve check op kennisopbouw.' },
    ],
    assessments: [
      assessmentFromToetsvorm(
        'gesloten-items',
        'Checkt kernbegrippen snel met directe feedback; passend bij kennisdoelen op MBO-3.',
        { formative: true }
      ),
    ]
  },
  'vaardigheid:MBO-4': {
    activities: [
      { title: 'Simulatie/rolspel', description: 'Oefen beroepshandeling in tweetallen met observatielijst.', duration: '45 min', why: 'Transfer naar beroepspraktijk (vaardigheidsdoel).' },
      { title: 'Stap-voor-stap demonstratie', description: 'Docent modelt handeling; studenten herhalen met peerfeedback.', duration: '40 min', why: 'Scaffolding en geleidelijke zelfstandigheid.' },
    ],
    assessments: [
      assessmentFromToetsvorm(
        'praktijktoets',
        'Laat de student de beroepshandeling uitvoeren met objectieve rubric; sluit aan bij vaardigheidsdoelen op MBO-4.',
        { summative: true }
      ),
    ]
  },
  'attitude:MBO-2': {
    activities: [
      { title: 'Reflectie-drieluik', description: 'Wat ging goed? Wat beter? Volgende stap? Deel in kleine kring.', duration: '20 min', why: 'Maakt houding zichtbaar via reflectie.' },
      { title: 'Feedback-carrousel', description: 'Studenten geven elkaar waarderende feedback met 2 verbeterpunten.', duration: '25 min', why: 'Stimuleert professionele attitude en peer-leren.' },
    ],
    assessments: [
      assessmentFromToetsvorm(
        'reflectie',
        'Maakt ontwikkeling in houding zichtbaar via onderbouwde reflectie en bewijsstukken.',
        { formative: true }
      ),
    ]
  },
  'kennis:VO-vwo': {
    activities: [
      { title: 'Concept mapping', description: 'Leerlingen leggen verbanden tussen begrippen in een schema.', duration: '30 min', why: 'Verdiept begrip door relaties te visualiseren.' },
      { title: 'Flitscollege', description: 'Docent geeft korte uitleg gevolgd door begripstoets via Kahoot.', duration: '20 min', why: 'Houdt aandacht vast en checkt kennis direct.' },
    ],
    assessments: [
      assessmentFromToetsvorm(
        'open-vragen-toets',
        'Stimuleert verdiepend denken met open vragen; biedt formatieve feedback voor VWO-leerlingen.',
        { formative: true }
      ),
    ]
  },
  'vaardigheid:HBO-ba': {
    activities: [
      { title: 'Case-based project', description: 'Werk in groepjes aan realistische casus met oplevering.', duration: '2 uur', why: 'Oefent beroepsvaardigheden in context.' },
      { title: 'Workshop met expert', description: 'Gastspreker demonstreert techniek; studenten oefenen direct.', duration: '90 min', why: 'Combineert theorie en praktijk.' },
    ],
    assessments: [
      assessmentFromToetsvorm(
        'project',
        'Koppelt product en proces aan beroepscriteria; passend bij HBO-bachelorvaardigheden.',
        { summative: true }
      ),
    ]
  },
  'kennis:HBO-ma': {
    activities: [
      { title: 'Literatuurkritiek', description: 'Analyseer recent onderzoek en bespreek implicaties.', duration: '60 min', why: 'Versterkt onderzoeksgerichte kennis.' },
      { title: 'Expertpanel', description: 'Studenten bevragen vakexperts over complexe theorie.', duration: '45 min', why: 'Verbindt theorie met praktijkervaring.' },
    ],
    assessments: [
      assessmentFromToetsvorm(
        'paper',
        'Daagt uit tot diepgaande analyse met academische argumentatie; past bij HBO-masterniveau.',
        { summative: true }
      ),
    ]
  },
  'vaardigheid:VO-vmbo': {
    activities: [
      { title: 'Praktijksessie', description: 'Leerlingen voeren stap-voor-stap taak uit in praktijklokaal.', duration: '40 min', why: 'Hands-on leren past bij vmbo-leerlingen.' },
      { title: 'Begeleide oefening', description: 'Docent ondersteunt bij uitvoeren van vaardigheidsoefening.', duration: '30 min', why: 'Biedt structuur en vertrouwen.' },
    ],
    assessments: [
      assessmentFromToetsvorm(
        'vaardighedentoets',
        'Observeert directe uitvoering van de vaardigheid met concrete beoordelingscriteria.',
        { formative: true }
      ),
    ]
  },
  'attitude:VO-havo': {
    activities: [
      { title: 'Debat over stelling', description: 'Leerlingen nemen positie in en beargumenteren.', duration: '30 min', why: 'Stimuleert kritische houding en respect.' },
      { title: 'Reflectieblog', description: 'Wekelijkse blog over eigen leerhouding.', duration: '20 min', why: 'Maakt ontwikkeling zichtbaar.' },
    ],
    assessments: [
      assessmentFromToetsvorm(
        'reflectiegesprek',
        'Gespreksvorm maakt houding en eigen verantwoordelijkheid expliciet.',
        { formative: true }
      ),
    ]
  },
  'kennis:WO-ba': {
    activities: [
      { title: 'Collegediscussie', description: 'Bespreek theorie in kleine groepen met stellingen.', duration: '30 min', why: 'Actieve verwerking van academische kennis.' },
      { title: 'Quiz met stembakjes', description: 'Meerkeuzevragen tijdens hoorcollege.', duration: '15 min', why: 'Real-time inzicht in kennisniveau.' },
    ],
    assessments: [
      assessmentFromToetsvorm(
        'essay',
        'Laat studenten theoretische kennis analyseren en beargumenteren in academische vorm.',
        { summative: true }
      ),
    ]
  },
  'vaardigheid:WO-ma': {
    activities: [
      { title: 'Onderzoeksatelier', description: 'Werk aan eigen onderzoek met begeleiding.', duration: '120 min', why: 'Ontwikkelt onderzoeksvaardigheden.' },
      { title: 'Peer coaching', description: 'Studenten geven elkaar feedback op methodologie.', duration: '45 min', why: 'Verbetert kwaliteit door collegiale toetsing.' },
    ],
    assessments: [
      assessmentFromToetsvorm(
        'onderzoek',
        'Verplicht tot methodisch verantwoorde toepassing van onderzoek en reflectie op keuzes.',
        { summative: true }
      ),
    ]
  },
  'attitude:VSO-vervolg': {
    activities: [
      { title: 'Samenwerkingsspel', description: 'Leerlingen lossen in groep een praktische uitdaging op.', duration: '30 min', why: 'Oefent sociale vaardigheden en houding.' },
      { title: 'Dagreflectie', description: 'Kort kringgesprek over wat goed ging en wat lastig was.', duration: '15 min', why: 'Vergroot zelfinzicht en respect.' },
    ],
    assessments: [
      assessmentFromToetsvorm(
        'portfolio-ontwikkel',
        'Bundelt bewijzen van houding en samenwerking; goed voor dialoog met VSO-leerlingen.',
        { formative: true }
      ),
    ]
  },
  'kennis:VSO-arbeidsmarkt': {
    activities: [
      { title: 'Beroepenmemory', description: 'Leerlingen koppelen beroepen aan taken en eigenschappen.', duration: '25 min', why: 'Vergroot kennis van arbeidsmogelijkheden.' },
      { title: 'Gastles werkgever', description: 'Werkgever vertelt over vak; leerlingen stellen vragen.', duration: '30 min', why: 'Concretiseert arbeidsmarkt voor leerlingen.' },
    ],
    assessments: [
      assessmentFromToetsvorm(
        'eindgesprek',
        'Korte mondelinge check op kennis over beroepen in vertrouwde setting.',
        { formative: true }
      ),
    ]
  },
  'vaardigheid:MBO-1': {
    activities: [
      { title: 'Stap-voor-stap instructie', description: 'Docent doet voor, student doet na met begeleiding.', duration: '30 min', why: 'Bouwt basisvaardigheid veilig op.' },
      { title: 'Klassikale oefening', description: 'Samen oefenen met directe feedback.', duration: '20 min', why: 'Versterkt correct uitvoeren van stappen.' },
    ],
    assessments: [
      assessmentFromToetsvorm(
        'observatie',
        'Geeft directe feedback op uitgevoerde handelingen; sluit aan bij startende mbo-studenten.',
        { formative: true }
      ),
    ]
  }
};

export function getSuggestions(
  orientation: GoalOrientation,
  level: EducationLevel
): SuggestionBundle {
  const key = `${orientation}:${level}` as Key;
  if (base[key]) return base[key];
  const generic: SuggestionBundle = {
    activities: [
      { title: 'Think-Pair-Share', description: 'Eerst individueel, dan duo, dan klassikaal delen.', why: 'Generiek inzetbaar en activerend.' }
    ],
    assessments: [pickFallbackAssessment(orientation, level)]
  };
  return generic;
}

function pickFallbackAssessment(orientation: GoalOrientation, level: EducationLevel): AssessmentSuggestion {
  const sector = describeEducationLevel(level);
  switch (orientation) {
    case 'kennis':
      return assessmentFromToetsvorm(
        'kennistoets',
        `Meet kernkennis snel en betrouwbaar in ${sector}; geeft ruimte voor gerichte feedback.`,
        { formative: true }
      );
    case 'vaardigheid':
      return assessmentFromToetsvorm(
        'skillstoets',
        `Laat studenten de vaardigheid demonstreren in ${sector} met directe observatie.`,
        { summative: true }
      );
    case 'attitude':
    default:
      return assessmentFromToetsvorm(
        'portfolio-assessment',
        `Maakt groei in houding zichtbaar over tijd met bewijsmateriaal passend bij ${sector}.`,
        { formative: true }
      );
  }
}

function describeEducationLevel(level: EducationLevel): string {
  if (level.startsWith('VO')) return 'het voortgezet onderwijs';
  if (level.startsWith('VSO')) return 'het voortgezet speciaal onderwijs';
  if (level.startsWith('MBO')) return 'het mbo';
  if (level.startsWith('HBO')) return 'het hbo';
  if (level.startsWith('WO')) return 'de universiteit';
  return 'dit onderwijsniveau';
}

