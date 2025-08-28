import { EducationLevel, GoalOrientation, SuggestionBundle } from '@/types/learning';

type Key = `${GoalOrientation}:${EducationLevel}`;
const base: Record<Key, SuggestionBundle> = {
  'kennis:MBO-3': {
    activities: [
      { title: '3–2–1 uitleg', description: 'Student noteert 3 kernbegrippen, 2 verbanden, 1 vraag en bespreekt die in duo’s.', duration: '20 min', why: 'Activeert voorkennis en begrip (kennisdoel).' },
      { title: 'Mini-lecture met check', description: 'Korte instructie gevolgd door 5 conceptvragen via Mentimeter/Forms.', duration: '25 min', why: 'Snelle formatieve check op kennisopbouw.' },
    ],
    assessments: [
      { title: 'Kennisquiz (open/gesloten)', description: 'Korte quiz met feedback, herkansbaar.', formative: true, why: 'Passend bij kennisdoelen; directe feedback.' }
    ]
  },
  'vaardigheid:MBO-4': {
    activities: [
      { title: 'Simulatie/rolspel', description: 'Oefen beroepshandeling in tweetallen met observatielijst.', duration: '45 min', why: 'Transfer naar beroepspraktijk (vaardigheidsdoel).' },
      { title: 'Stap-voor-stap demonstratie', description: 'Docent modelt handeling; studenten herhalen met peerfeedback.', duration: '40 min', why: 'Scaffolding en geleidelijke zelfstandigheid.' },
    ],
    assessments: [
      { title: 'Praktijkopdracht met rubric', description: 'Uitvoering van handeling met beoordelingscriteria.', summative: true, why: 'Observeerbare vaardigheid; valide beoordeling.' }
    ]
  },
  'attitude:MBO-2': {
    activities: [
      { title: 'Reflectie-drieluik', description: 'Wat ging goed? Wat beter? Volgende stap? Deel in kleine kring.', duration: '20 min', why: 'Maakt houding zichtbaar via reflectie.' },
      { title: 'Feedback-carrousel', description: 'Studenten geven elkaar waarderende feedback met 2 verbeterpunten.', duration: '25 min', why: 'Stimuleert professionele attitude en peer-leren.' },
    ],
    assessments: [
      { title: 'Reflectieverslag met bewijs', description: 'Korte reflectie met concrete voorbeelden en bewijsstukken.', formative: true, why: 'Attitude borg je via onderbouwde reflectie.' }
    ]
  },
  'kennis:VO-vwo': {
    activities: [
      { title: 'Concept mapping', description: 'Leerlingen leggen verbanden tussen begrippen in een schema.', duration: '30 min', why: 'Verdiept begrip door relaties te visualiseren.' },
      { title: 'Flitscollege', description: 'Docent geeft korte uitleg gevolgd door begripstoets via Kahoot.', duration: '20 min', why: 'Houdt aandacht vast en checkt kennis direct.' },
    ],
    assessments: [
      { title: 'Formatieve proef', description: 'Korte toets met bespreking in tweetallen.', formative: true, why: 'Biedt inzicht in begripsniveau.' }
    ]
  },
  'vaardigheid:HBO-ba': {
    activities: [
      { title: 'Case-based project', description: 'Werk in groepjes aan realistische casus met oplevering.', duration: '2 uur', why: 'Oefent beroepsvaardigheden in context.' },
      { title: 'Workshop met expert', description: 'Gastspreker demonstreert techniek; studenten oefenen direct.', duration: '90 min', why: 'Combineert theorie en praktijk.' },
    ],
    assessments: [
      { title: 'Praktijkproduct met peerreview', description: 'Ingeleverd product met feedback van medestudenten.', summative: true, why: 'Beoordeling op toepassen van vaardigheden.' }
    ]
  },
  'kennis:HBO-ma': {
    activities: [
      { title: 'Literatuurkritiek', description: 'Analyseer recent onderzoek en bespreek implicaties.', duration: '60 min', why: 'Versterkt onderzoeksgerichte kennis.' },
      { title: 'Expertpanel', description: 'Studenten bevragen vakexperts over complexe theorie.', duration: '45 min', why: 'Verbindt theorie met praktijkervaring.' },
    ],
    assessments: [
      { title: 'Essay met peerfeedback', description: 'Kritische beschouwing van theorie toegepast op casus.', summative: true, why: 'Toetst diep begrip en argumentatie.' }
    ]
  },
  'vaardigheid:VO-vmbo': {
    activities: [
      { title: 'Praktijksessie', description: 'Leerlingen voeren stap-voor-stap taak uit in praktijklokaal.', duration: '40 min', why: 'Hands-on leren past bij vmbo-leerlingen.' },
      { title: 'Begeleide oefening', description: 'Docent ondersteunt bij uitvoeren van vaardigheidsoefening.', duration: '30 min', why: 'Biedt structuur en vertrouwen.' },
    ],
    assessments: [
      { title: 'Praktijkobservatie', description: 'Docent observeert uitvoering met checklist.', formative: true, why: 'Directe feedback op vaardigheid.' }
    ]
  },
  'attitude:VO-havo': {
    activities: [
      { title: 'Debat over stelling', description: 'Leerlingen nemen positie in en beargumenteren.', duration: '30 min', why: 'Stimuleert kritische houding en respect.' },
      { title: 'Reflectieblog', description: 'Wekelijkse blog over eigen leerhouding.', duration: '20 min', why: 'Maakt ontwikkeling zichtbaar.' },
    ],
    assessments: [
      { title: 'Zelfevaluatieformulier', description: 'Leerling beoordeelt eigen inzet en groeipunten.', formative: true, why: 'Bevordert eigenaarschap van houding.' }
    ]
  },
  'kennis:WO-ba': {
    activities: [
      { title: 'Collegediscussie', description: 'Bespreek theorie in kleine groepen met stellingen.', duration: '30 min', why: 'Actieve verwerking van academische kennis.' },
      { title: 'Quiz met stembakjes', description: 'Meerkeuzevragen tijdens hoorcollege.', duration: '15 min', why: 'Real-time inzicht in kennisniveau.' },
    ],
    assessments: [
      { title: 'Korte paper', description: 'Analyse van theoretisch concept toegepast op casus.', summative: true, why: 'Toetst begrip en schrijfvaardigheid.' }
    ]
  },
  'vaardigheid:WO-ma': {
    activities: [
      { title: 'Onderzoeksatelier', description: 'Werk aan eigen onderzoek met begeleiding.', duration: '120 min', why: 'Ontwikkelt onderzoeksvaardigheden.' },
      { title: 'Peer coaching', description: 'Studenten geven elkaar feedback op methodologie.', duration: '45 min', why: 'Verbetert kwaliteit door collegiale toetsing.' },
    ],
    assessments: [
      { title: 'Onderzoeksverslag', description: 'Volledig verslag inclusief methodologische verantwoording.', summative: true, why: 'Beoordeelt toegepaste onderzoeksvaardigheden.' }
    ]
  },
  'attitude:VSO-vervolg': {
    activities: [
      { title: 'Samenwerkingsspel', description: 'Leerlingen lossen in groep een praktische uitdaging op.', duration: '30 min', why: 'Oefent sociale vaardigheden en houding.' },
      { title: 'Dagreflectie', description: 'Kort kringgesprek over wat goed ging en wat lastig was.', duration: '15 min', why: 'Vergroot zelfinzicht en respect.' },
    ],
    assessments: [
      { title: 'Portfolio-moment', description: 'Verzamel bewijs van samenwerking en reflectie.', formative: true, why: 'Laat groei in houding zien over tijd.' }
    ]
  },
  'kennis:VSO-arbeidsmarkt': {
    activities: [
      { title: 'Beroepenmemory', description: 'Leerlingen koppelen beroepen aan taken en eigenschappen.', duration: '25 min', why: 'Vergroot kennis van arbeidsmogelijkheden.' },
      { title: 'Gastles werkgever', description: 'Werkgever vertelt over vak; leerlingen stellen vragen.', duration: '30 min', why: 'Concretiseert arbeidsmarkt voor leerlingen.' },
    ],
    assessments: [
      { title: 'Mondelinge check', description: 'Korte vragenronde over beroepen en taken.', formative: true, why: 'Peilt begripsniveau informeel.' }
    ]
  },
  'vaardigheid:MBO-1': {
    activities: [
      { title: 'Stap-voor-stap instructie', description: 'Docent doet voor, student doet na met begeleiding.', duration: '30 min', why: 'Bouwt basisvaardigheid veilig op.' },
      { title: 'Klassikale oefening', description: 'Samen oefenen met directe feedback.', duration: '20 min', why: 'Versterkt correct uitvoeren van stappen.' },
    ],
    assessments: [
      { title: 'Beoordelingsgesprek', description: 'Korte evaluatie van uitgevoerde handeling.', formative: true, why: 'Stimuleert groei vanaf startniveau.' }
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
    assessments: [
      { title: 'Korte formatieve check', description: '3–5 vragen met feedback.', formative: true, why: 'Lage drempel, snel beeld.' }
    ]
  };
  return generic;
}

