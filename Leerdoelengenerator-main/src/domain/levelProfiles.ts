// src/domain/levelProfiles.ts
export type LevelKey =
  | "VO-vmbo-bbkb"
  | "VO-vmbo-gtl"
  | "VO-havo"
  | "VO-vwo"
  | "VSO-vervolgonderwijs"
  | "VSO-arbeidsmarkt"
  | "VSO-dagbesteding"
  | "MBO-1"
  | "MBO-2"
  | "MBO-3"
  | "MBO-4"
  | "HBO-AD"
  | "HBO-Bachelor"
  | "HBO-Master"
  | "WO-Bachelor"
  | "WO-Master";

export type LevelProfile = {
  label: string;
  verbBands: {
    rememberUnderstand: string[];
    apply: string[];
    analyze: string[];
    evaluate: string[];
    create: string[];
  };
  // Toegestane/voorkeurs-banden per niveau (Bloom-range)
  allowedBands: Array<keyof LevelProfile["verbBands"]>;
  autonomyPhrases: string[];   // zelfstandigheid / begeleiding
  contextHints: string[];      // typische contexten
  criteriaMarkers: string[];   // "volgens", "conform", "op basis van", ...
  lengthGuideline: { minWords: number; maxWords: number };
  examples: string[];          // 1–2 voorbeeldleerdoelen, NL
};

export const LEVEL_PROFILES: Record<LevelKey, LevelProfile> = {
  "VO-vmbo-bbkb": {
    label: "VO – vmbo bb/kb",
    verbBands: {
      rememberUnderstand: ["benoemt", "herkent", "beschrijft", "uitlegt", "toelicht"],
      apply: ["past toe", "voert uit", "gebruikt", "maakt", "stelt op (basis)"],
      analyze: ["ordent", "vergelijk kort"],
      evaluate: ["beoordeelt eenvoudig"],
      create: ["maakt (eenvoudig product)"],
    },
    allowedBands: ["rememberUnderstand", "apply"],
    autonomyPhrases: ["onder begeleiding", "met duidelijke instructie"],
    contextHints: ["in de praktijkles", "met standaardmateriaal", "volgens stappenplan"],
    criteriaMarkers: ["volgens", "conform", "op basis van"],
    lengthGuideline: { minWords: 18, maxWords: 38 },
    examples: [
      "Voert een eenvoudige meting uit in het practicumlokaal, met standaardinstrumenten, conform het stappenplan, onder begeleiding."
    ],
  },
  "VO-vmbo-gtl": {
    label: "VO – vmbo gtl",
    verbBands: {
      rememberUnderstand: ["verklaart", "licht toe"],
      apply: ["past toe", "voert uit", "maakt"],
      analyze: ["analyseert eenvoudig", "interpreteert"],
      evaluate: ["onderbouwt keuze (kort)"],
      create: ["ontwerpt (basis)"],
    },
    allowedBands: ["rememberUnderstand", "apply", "analyze"],
    autonomyPhrases: ["met beperkte begeleiding"],
    contextHints: ["aan de hand van voorbeelden", "binnen de lescontext"],
    criteriaMarkers: ["volgens", "met behulp van", "op basis van"],
    lengthGuideline: { minWords: 20, maxWords: 40 },
    examples: [
      "Past een rekenregel toe bij contextopgaven, aan de hand van voorbeeldopgaven, volgens de klassennorm, met beperkte begeleiding."
    ],
  },
  "VO-havo": {
    label: "VO – havo",
    verbBands: {
      rememberUnderstand: ["verklaart", "licht toe"],
      apply: ["past toe", "modelleert (basis)"],
      analyze: ["analyseert", "interpreteert", "vergelijkt"],
      evaluate: ["beoordeelt", "onderbouwt"],
      create: ["ontwerpt (eenvoudig)"],
    },
    allowedBands: ["apply", "analyze", "evaluate"],
    autonomyPhrases: ["met enige zelfstandigheid"],
    contextHints: ["in realistische contexten", "met beperkte bronnen"],
    criteriaMarkers: ["volgens", "conform", "op basis van"],
    lengthGuideline: { minWords: 22, maxWords: 42 },
    examples: [
      "Analyseert de betrouwbaarheid van twee nieuwsbronnen over een actueel onderwerp, op basis van vastgestelde criteria, met enige zelfstandigheid."
    ],
  },
  "VO-vwo": {
    label: "VO – vwo",
    verbBands: {
      rememberUnderstand: ["verklaart"],
      apply: ["past toe", "modelleert"],
      analyze: ["analyseert", "interpreteert diepgaand"],
      evaluate: ["evalueert", "onderbouwt met argumenten"],
      create: ["ontwerpt (onderbouwd)"],
    },
    allowedBands: ["analyze", "evaluate", "create"],
    autonomyPhrases: ["zelfstandig"],
    contextHints: ["conceptueel", "met brononderzoek"],
    criteriaMarkers: ["volgens", "gebaseerd op", "met verantwoording"],
    lengthGuideline: { minWords: 24, maxWords: 46 },
    examples: [
      "Evalueert een wetenschappelijke claim door twee bronnen kritisch te vergelijken, met expliciete argumentatie en verantwoording, zelfstandig."
    ],
  },
  "VSO-vervolgonderwijs": {
    label: "VSO – vervolgonderwijsroute",
    verbBands: {
      rememberUnderstand: ["benoemt", "beschrijft", "verklaart kort"],
      apply: ["past toe", "oefent", "voert uit"],
      analyze: ["ordent"],
      evaluate: ["geeft eenvoudige terugkoppeling"],
      create: ["--"],
    },
    allowedBands: ["rememberUnderstand", "apply"],
    autonomyPhrases: ["met veel begeleiding"],
    contextHints: ["in de klas", "tijdens de les", "met ondersteuning"],
    criteriaMarkers: ["volgens", "met behulp van"],
    lengthGuideline: { minWords: 16, maxWords: 36 },
    examples: [
      "Past een rekenstrategie toe in de klas, met behulp van voorbeeldopgaven, volgens het stappenplan, met veel begeleiding.",
    ],
  },
  "VSO-arbeidsmarkt": {
    label: "VSO – arbeidsmarktgerichte route",
    verbBands: {
      rememberUnderstand: ["benoemt", "herkent", "beschrijft kort"],
      apply: ["voert uit", "past toe", "helpt bij"],
      analyze: ["controleert eenvoudig"],
      evaluate: ["geeft terugkoppeling eenvoudig"],
      create: ["--"],
    },
    allowedBands: ["rememberUnderstand", "apply"],
    autonomyPhrases: ["onder begeleiding", "met ondersteuning"],
    contextHints: ["op de werkplek", "tijdens een praktijkopdracht"],
    criteriaMarkers: ["volgens", "conform", "op basis van"],
    lengthGuideline: { minWords: 16, maxWords: 36 },
    examples: [
      "Voert een eenvoudige logistieke taak uit op de werkplek, met standaardhulpmiddelen, volgens instructies, onder begeleiding.",
    ],
  },
  "VSO-dagbesteding": {
    label: "VSO – dagbestedingsroute",
    verbBands: {
      rememberUnderstand: ["benoemt", "herkent", "neemt deel"],
      apply: ["voert uit (eenvoudig)", "oefent mee"],
      analyze: ["--"],
      evaluate: ["--"],
      create: ["--"],
    },
    allowedBands: ["rememberUnderstand", "apply"],
    autonomyPhrases: ["onder begeleiding"],
    contextHints: ["in de dagbestedingsruimte", "tijdens een activiteit"],
    criteriaMarkers: ["volgens", "met begeleiding", "aan de hand van"],
    lengthGuideline: { minWords: 14, maxWords: 30 },
    examples: [
      "Neemt deel aan een creatieve activiteit in de dagbestedingsruimte, met aangepast materiaal, volgens een eenvoudig plan, onder begeleiding.",
    ],
  },
  "MBO-1": {
    label: "MBO 1 – Assistent",
    verbBands: {
      rememberUnderstand: ["benoemt", "beschrijft"],
      apply: ["voert uit", "helpt bij", "assisteert"],
      analyze: ["controleert (basis)"],
      evaluate: ["meldt afwijkingen"],
      create: ["--"],
    },
    allowedBands: ["rememberUnderstand", "apply"],
    autonomyPhrases: ["onder directe begeleiding"],
    contextHints: ["in voorspelbare situaties", "volgens instructie"],
    criteriaMarkers: ["volgens", "conform"],
    lengthGuideline: { minWords: 18, maxWords: 38 },
    examples: [
      "Assisteert bij het voorbereiden van materialen op de werkplek, volgens de veiligheidsinstructies, onder directe begeleiding."
    ],
  },
  "MBO-2": {
    label: "MBO 2 – Basisberoeps",
    verbBands: {
      rememberUnderstand: ["beschrijft", "licht toe"],
      apply: ["voert uit", "past toe", "gebruikt"],
      analyze: ["controleert", "signaleert"],
      evaluate: ["rapporteert (kort)"],
      create: ["assembleert (eenvoudig)"],
    },
    allowedBands: ["apply", "rememberUnderstand"],
    autonomyPhrases: ["onder begeleiding"],
    contextHints: ["in bekende routinetaken", "met standaardgereedschap"],
    criteriaMarkers: ["volgens", "conform", "aan de hand van"],
    lengthGuideline: { minWords: 20, maxWords: 40 },
    examples: [
      "Voert een basisonderhoudsbeurt uit aan een fiets in de werkplaats, met standaardgereedschap, volgens checklist en ARBO‑richtlijnen, onder begeleiding."
    ],
  },
  "MBO-3": {
    label: "MBO 3 – Vakopleiding",
    verbBands: {
      rememberUnderstand: ["verklaart (kort)"],
      apply: ["voert uit", "past toe", "stemt af"],
      analyze: ["analyseert (werkproces)", "interpreteert"],
      evaluate: ["beoordeelt (eenvoudig)"],
      create: ["optimaliseert (kleinschalig)"],
    },
    allowedBands: ["apply", "analyze"],
    autonomyPhrases: ["met beperkte begeleiding"],
    contextHints: ["in wisselende praktijksituaties"],
    criteriaMarkers: ["volgens", "met inachtneming van"],
    lengthGuideline: { minWords: 22, maxWords: 42 },
    examples: [
      "Analyseert klantvraag en stemt werkzaamheden af binnen de salon, met inachtneming van hygiëneprotocollen, met beperkte begeleiding."
    ],
  },
  "MBO-4": {
    label: "MBO 4 – Middenkader",
    verbBands: {
      rememberUnderstand: ["licht toe"],
      apply: ["plant", "realiseert", "implementeert"],
      analyze: ["analyseert", "diagnosticeert"],
      evaluate: ["evalueert", "verantwoort"],
      create: ["ontwerpt (praktisch)", "verbeterd (proces)"],
    },
    allowedBands: ["analyze", "evaluate", "create"],
    autonomyPhrases: ["zelfstandig", "met verantwoordelijkheid"],
    contextHints: ["in onvoorspelbare situaties", "met klantcontact"],
    criteriaMarkers: ["conform", "volgens", "op basis van"],
    lengthGuideline: { minWords: 24, maxWords: 46 },
    examples: [
      "Ontwerpt en plant een klein verbeterproject op de werkvloer, op basis van data‑analyse, conform kwaliteitsrichtlijnen, en verantwoordt keuzes in een kort verslag, zelfstandig."
    ],
  },
  "HBO-AD": {
    label: "HBO Associate degree",
    verbBands: {
      rememberUnderstand: ["verklaart (basis)"],
      apply: ["past toe", "implementeert (beperkt)"],
      analyze: ["analyseert (taakgericht)"],
      evaluate: ["beoordeelt (gericht)"],
      create: ["ontwerpt (eenvoudig)"],
    },
    allowedBands: ["apply", "analyze", "evaluate"],
    autonomyPhrases: ["toenemende zelfstandigheid"],
    contextHints: ["beroepsproducten in beperkte complexiteit"],
    criteriaMarkers: ["volgens", "met verantwoording"],
    lengthGuideline: { minWords: 24, maxWords: 48 },
    examples: [
      "Implementeert een basisdashboard voor een team, op basis van requirements, volgens huisstijlrichtlijnen, en verantwoordt keuzes beknopt, met toenemende zelfstandigheid."
    ],
  },
  "HBO-Bachelor": {
    label: "HBO Bachelor",
    verbBands: {
      rememberUnderstand: ["verklaart"],
      apply: ["ontwerpt", "realiseert", "implementeert"],
      analyze: ["analyseert", "onderbouwt"],
      evaluate: ["evalueert", "verantwoort"],
      create: ["ontwikkelt", "iterateert"],
    },
    allowedBands: ["analyze", "evaluate", "create"],
    autonomyPhrases: ["zelfstandig binnen beroepscontext"],
    contextHints: ["met praktijkgericht onderzoek", "co-creatie met stakeholders"],
    criteriaMarkers: ["volgens", "gebaseerd op", "met onderbouwing"],
    lengthGuideline: { minWords: 26, maxWords: 52 },
    examples: [
      "Ontwerpt en valideert een low‑fidelity prototype voor een studentportaal, gebaseerd op drie gebruikersinterviews, volgens heuristieken van Nielsen, en verantwoordt ontwerpkeuzes in een reflectieverslag, zelfstandig."
    ],
  },
  "HBO-Master": {
    label: "HBO Master",
    verbBands: {
      rememberUnderstand: ["conceptualiseert (kort)"],
      apply: ["implementeert (geavanceerd)"],
      analyze: ["analyseert complex", "synthesiseert"],
      evaluate: ["evalueert (geavanceerd)", "verantwoort evidence‑based"],
      create: ["ontwerpt (innovatie)", "ontwikkelt (interventie)"],
    },
    allowedBands: ["analyze", "evaluate", "create"],
    autonomyPhrases: ["zelfstandig, onderzoekend, leidinggevend aan verandering"],
    contextHints: ["complexe beroepspraktijk", "evidence‑based"],
    criteriaMarkers: ["gebaseerd op", "conform", "volgens"],
    lengthGuideline: { minWords: 28, maxWords: 56 },
    examples: [
      "Ontwikkelt en evalueert een evidence‑based interventie voor teamleren, gebaseerd op literatuurreview en praktijkdata, conform ethische richtlijnen, en verantwoordt methodologische keuzes uitvoerig, zelfstandig."
    ],
  },
  "WO-Bachelor": {
    label: "WO – Bachelor",
    verbBands: {
      rememberUnderstand: ["verklaart (theoretisch)"],
      apply: ["past theorie toe"],
      analyze: ["analyseert kritisch", "interpreteert"],
      evaluate: ["evalueert", "argumenteert"],
      create: ["ontwerpt (beperkt onderzoek)"],
    },
    allowedBands: ["analyze", "evaluate"],
    autonomyPhrases: ["zelfstandig, academische werkwijze"],
    contextHints: ["theoretische kaders", "bronanalyse"],
    criteriaMarkers: ["gebaseerd op", "volgens", "met verantwoording"],
    lengthGuideline: { minWords: 26, maxWords: 52 },
    examples: [
      "Analyseert een wetenschappelijk artikel met behulp van een beoordelingskader, en verantwoordt bevindingen met correcte bronvermelding, zelfstandig."
    ],
  },
  "WO-Master": {
    label: "WO – Master",
    verbBands: {
      rememberUnderstand: ["conceptualiseert"],
      apply: ["past geavanceerde methoden toe"],
      analyze: ["analyseert diepgaand", "synthesiseert"],
      evaluate: ["evalueert kritisch", "beoordeelt methodologisch"],
      create: ["ontwerpt onderzoek", "ontwikkelt model"],
    },
    allowedBands: ["analyze", "evaluate", "create"],
    autonomyPhrases: ["hoogste mate van zelfstandigheid"],
    contextHints: ["origineel onderzoek", "publiceerbare kwaliteit"],
    criteriaMarkers: ["conform", "volgens", "gebaseerd op"],
    lengthGuideline: { minWords: 28, maxWords: 58 },
    examples: [
      "Ontwerpt en evalueert een experimentele opzet om hypothesen te toetsen, conform open‑science principes, met volledige methodologische verantwoording, zelfstandig."
    ],
  },
};

