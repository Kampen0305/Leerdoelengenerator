export interface Toetsvorm {
  id: string;
  naam: string;
  beschrijving?: string;
  categorieen: ToetsCategorie[];
  baan?: "Baan 1" | "Baan 2" | "Beide"; // Npuls Two-Lane
  validiteitFocus?: "Hoog" | "Midden" | "Laag";
  betrouwbaarheidFocus?: "Hoog" | "Midden" | "Laag";
}

export const ALLE_CATEGORIEEN = [
  "Mondeling",
  "Schriftelijk",
  "Praktijk/Authentiek",
  "Proces/Portfolio",
  "Digitaal/Geautomatiseerd",
  "Peer/Co-assessment",
  "Product-opdracht",
  "Performance assessment",
  "Portfolio",
  "Mondelinge toets",
  "Schriftelijke toets",
] as const;

export type ToetsCategorie = (typeof ALLE_CATEGORIEEN)[number];

// 🎯 Voorbeeldset — vervang/uitbreid met jouw eigen lijst
export const TOETSVORMEN: Toetsvorm[] = [
  {
    id: "mondeling-examen",
    naam: "Mondeling examen",
    beschrijving:
      "Individuele mondelinge bevraging met doorvragen op begrip en toepassing.",
    categorieen: ["Mondeling"],
    baan: "Baan 1",
    validiteitFocus: "Hoog",
    betrouwbaarheidFocus: "Midden",
  },
  {
    id: "presentatie",
    naam: "Presentatie (individueel of groep)",
    beschrijving:
      "Student presenteert resultaten, met vragenronde voor verantwoording.",
    categorieen: ["Mondeling", "Praktijk/Authentiek"],
    baan: "Beide",
    validiteitFocus: "Hoog",
    betrouwbaarheidFocus: "Midden",
  },
  {
    id: "essay",
    naam: "Essay / Verslag",
    beschrijving:
      "Schriftelijke uitwerking met nadruk op redenering, bronnen en structuur.",
    categorieen: ["Schriftelijk"],
    baan: "Baan 1",
    validiteitFocus: "Midden",
    betrouwbaarheidFocus: "Midden",
  },
  {
    id: "praktijktoets",
    naam: "Praktijktoets / Proeve van Bekwaamheid",
    beschrijving:
      "Authentieke beroepsopdracht in een realistische setting (stage/werkplek/simulatie).",
    categorieen: ["Praktijk/Authentiek"],
    baan: "Beide",
    validiteitFocus: "Hoog",
    betrouwbaarheidFocus: "Midden",
  },
  {
    id: "portfolio",
    naam: "Portfolio met reflectie/logboek",
    beschrijving:
      "Doorlopende verzameling van bewijsstukken met reflecties en feedback.",
    categorieen: ["Proces/Portfolio"],
    baan: "Beide",
    validiteitFocus: "Hoog",
    betrouwbaarheidFocus: "Midden",
  },
  {
    id: "digitaal-auto",
    naam: "Digitaal (automatisch nakijken)",
    beschrijving:
      "MC/gesloten vragen met automatische scoring en item-analyse.",
    categorieen: ["Digitaal/Geautomatiseerd"],
    baan: "Baan 1",
    validiteitFocus: "Midden",
    betrouwbaarheidFocus: "Hoog",
  },
  {
    id: "peer-assessment",
    naam: "Peer assessment",
    beschrijving:
      "Studenten beoordelen elkaars werk aan de hand van heldere criteria/rubrics.",
    categorieen: ["Peer/Co-assessment", "Proces/Portfolio"],
    baan: "Baan 2",
    validiteitFocus: "Midden",
    betrouwbaarheidFocus: "Midden",
  },
  {
    id: "acties",
    naam: "Acties",
    categorieen: ["Product-opdracht"],
  },
  {
    id: "beroepsproducten-stageplek",
    naam: "Beroepsproducten stageplek",
    categorieen: ["Product-opdracht"],
  },
  {
    id: "beroepsproduct",
    naam: "Beroepsproduct",
    categorieen: ["Product-opdracht"],
  },
  {
    id: "casestudies",
    naam: "Casestudies",
    categorieen: ["Schriftelijke toets"],
  },
  {
    id: "cognitive-interview-csi",
    naam: "CSI (Cognitive Interview CSI)",
    categorieen: ["Performance assessment"],
  },
  {
    id: "diagnostisch",
    naam: "Diagnostisch",
    categorieen: ["Product-opdracht"],
  },
  {
    id: "eindproduct",
    naam: "Eindproduct",
    categorieen: ["Product-opdracht"],
  },
  {
    id: "essay-schriftelijke-toets",
    naam: "Essay",
    categorieen: ["Schriftelijke toets"],
  },
  {
    id: "examen-performance",
    naam: "Examen",
    categorieen: ["Performance assessment"],
  },
  {
    id: "feedback-performance",
    naam: "Feedback",
    categorieen: ["Performance assessment"],
  },
  {
    id: "formative-performance-assessment",
    naam: "Formative Performance assessment (FPA)",
    categorieen: ["Performance assessment"],
  },
  {
    id: "gespreksassessment",
    naam: "Gespreksassessment",
    categorieen: ["Performance assessment"],
  },
  {
    id: "individuele-performance-assessment",
    naam: "Individuele Performance assessment (IPA)",
    categorieen: ["Performance assessment"],
  },
  {
    id: "interview-performance",
    naam: "Interview",
    categorieen: ["Performance assessment"],
  },
  {
    id: "mondelinge-toets",
    naam: "Mondelinge toets",
    categorieen: ["Mondelinge toets"],
  },
  {
    id: "peer-performance-assessment",
    naam: "Peer Performance assessment (PPA)",
    categorieen: ["Performance assessment"],
  },
  {
    id: "portfolio-toetsvorm",
    naam: "Portfolio",
    categorieen: ["Portfolio"],
  },
  {
    id: "praktijk-performance-assessment",
    naam: "Praktijk Performance assessment (PPA)",
    categorieen: ["Performance assessment"],
  },
  {
    id: "proeve-van-bekwaamheid",
    naam: "Proeve van Bekwaamheid",
    categorieen: ["Performance assessment"],
  },
  {
    id: "project-product-opdracht",
    naam: "Project",
    categorieen: ["Product-opdracht"],
  },
  {
    id: "reflectie-product-opdracht",
    naam: "Reflectie",
    categorieen: ["Product-opdracht"],
  },
  {
    id: "reflectie-opdracht",
    naam: "Reflectie-opdracht",
    categorieen: ["Product-opdracht"],
  },
  {
    id: "rollenspellen",
    naam: "Rollenspellen",
    categorieen: ["Performance assessment"],
  },
  {
    id: "spreektoetsen",
    naam: "Spreektoetsen",
    categorieen: ["Performance assessment"],
  },
  {
    id: "stakeholders-performance-assessment",
    naam: "Stakeholders Performance assessment (SPA)",
    categorieen: ["Performance assessment"],
  },
  {
    id: "taaltoetsen",
    naam: "Taaltoetsen",
    categorieen: ["Schriftelijke toets"],
  },
  {
    id: "toetsgesprekken-mondeling",
    naam: "Toetsgesprekken (mondeling)",
    categorieen: ["Mondelinge toets"],
  },
  {
    id: "toetsmateriaal",
    naam: "Toetsmateriaal",
    categorieen: ["Product-opdracht"],
  },
  {
    id: "toetsvorm",
    naam: "Toetsvorm",
    categorieen: ["Product-opdracht"],
  },
  {
    id: "verslag-product-opdracht",
    naam: "Verslag",
    categorieen: ["Product-opdracht"],
  },
  {
    id: "voortgangstoets",
    naam: "Voortgangstoets",
    categorieen: ["Product-opdracht"],
  },
  {
    id: "samtoets",
    naam: "SamenToets",
    categorieen: ["Product-opdracht"],
  },
  {
    id: "vorm-in-overleg",
    naam: "Vorm in overleg met student(en)",
    categorieen: ["Product-opdracht"],
  },
];
