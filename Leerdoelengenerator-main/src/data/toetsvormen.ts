export type ToetsCategorie =
  | "Mondeling"
  | "Schriftelijk"
  | "Praktijk/Authentiek"
  | "Proces/Portfolio"
  | "Digitaal/Geautomatiseerd"
  | "Peer/Co-assessment";

export interface Toetsvorm {
  id: string;
  naam: string;
  beschrijving?: string;
  categorieen: ToetsCategorie[];
  baan?: "Baan 1" | "Baan 2" | "Beide"; // Npuls Two-Lane
  validiteitFocus?: "Hoog" | "Midden" | "Laag";
  betrouwbaarheidFocus?: "Hoog" | "Midden" | "Laag";
}

export const ALLE_CATEGORIEEN: ToetsCategorie[] = [
  "Mondeling",
  "Schriftelijk",
  "Praktijk/Authentiek",
  "Proces/Portfolio",
  "Digitaal/Geautomatiseerd",
  "Peer/Co-assessment",
];

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
];
