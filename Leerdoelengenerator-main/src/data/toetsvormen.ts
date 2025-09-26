const TOETS_CATEGORIEEN = [
  "Performance assessment",
  "Product-opdracht",
  "Schriftelijke toets",
] as const;

export type ToetsCategorie = (typeof TOETS_CATEGORIEEN)[number];

export interface Toetsvorm {
  id: string;
  naam: string;
  beschrijving?: string;
  categorieen: ToetsCategorie[];
  baan?: "Baan 1" | "Baan 2" | "Beide"; // Npuls Two-Lane
  validiteitFocus?: "Hoog" | "Midden" | "Laag";
  betrouwbaarheidFocus?: "Hoog" | "Midden" | "Laag";
}

type RawToetsvorm = {
  naam: string;
  categorie: ToetsCategorie;
  beschrijving?: string;
};

const RAW_TOETSVORMEN: RawToetsvorm[] = [
  { naam: "Advies", categorie: "Product-opdracht" },
  { naam: "Beroepshandelingen stageplek", categorie: "Product-opdracht" },
  { naam: "Beroepsproduct", categorie: "Product-opdracht" },
  { naam: "Beroepsproduct", categorie: "Performance assessment" },
  { naam: "Casustoets", categorie: "Schriftelijke toets" },
  { naam: "Criteriumgericht interview (CGI)", categorie: "Performance assessment" },
  { naam: "Demonstratie", categorie: "Performance assessment" },
  { naam: "Eindgesprek", categorie: "Product-opdracht" },
  { naam: "Eindproduct", categorie: "Product-opdracht" },
  { naam: "Essay", categorie: "Schriftelijke toets" },
  { naam: "Experiment", categorie: "Performance assessment" },
  { naam: "Game", categorie: "Performance assessment" },
  { naam: "Gedragsassessment", categorie: "Performance assessment" },
  { naam: "Geschreven beroepsproduct", categorie: "Schriftelijke toets" },
  { naam: "Gesloten items (selected response)", categorie: "Schriftelijke toets" },
  { naam: "Half-open vragen toets", categorie: "Schriftelijke toets" },
  { naam: "Invul", categorie: "Schriftelijke toets" },
  { naam: "Kennisclip", categorie: "Product-opdracht" },
  { naam: "Kennistoets", categorie: "Schriftelijke toets" },
  { naam: "Kort antwoord", categorie: "Schriftelijke toets" },
  { naam: "Luistertoets", categorie: "Schriftelijke toets" },
  { naam: "Matching", categorie: "Schriftelijke toets" },
  { naam: "Meerkeuze", categorie: "Schriftelijke toets" },
  { naam: "Observatie", categorie: "Performance assessment" },
  { naam: "Onderzoek", categorie: "Product-opdracht" },
  { naam: "Ontwerp", categorie: "Product-opdracht" },
  { naam: "Open book toets", categorie: "Schriftelijke toets" },
  { naam: "Open items (constructed response)", categorie: "Schriftelijke toets" },
  { naam: "Open-vragen toets", categorie: "Schriftelijke toets" },
  { naam: "Paper", categorie: "Product-opdracht" },
  { naam: "Pitch", categorie: "Performance assessment" },
  { naam: "Plan van aanpak/werkplan", categorie: "Product-opdracht" },
  { naam: "Portfolio - ontwikkel", categorie: "Product-opdracht" },
  { naam: "Portfolio - product", categorie: "Product-opdracht" },
  { naam: "Portfolio assessment", categorie: "Performance assessment" },
  { naam: "Posterpresentatie", categorie: "Performance assessment" },
  { naam: "Practicumtoets", categorie: "Performance assessment" },
  { naam: "Praktijktoets", categorie: "Performance assessment" },
  { naam: "Presentatie", categorie: "Performance assessment" },
  { naam: "Proces", categorie: "Product-opdracht" },
  { naam: "Product", categorie: "Product-opdracht" },
  { naam: "Project", categorie: "Product-opdracht" },
  { naam: "Rapport", categorie: "Product-opdracht" },
  { naam: "Reflectie", categorie: "Product-opdracht" },
  { naam: "Reflectiegesprek", categorie: "Product-opdracht" },
  { naam: "Resultaatformulier", categorie: "Product-opdracht" },
  { naam: "Rollenspel", categorie: "Performance assessment" },
  { naam: "Script-Concordance-Test (SCT)", categorie: "Schriftelijke toets" },
  { naam: "Simulatie", categorie: "Performance assessment" },
  { naam: "Simulatie-patient-toets", categorie: "Performance assessment" },
  { naam: "Skillstoets", categorie: "Performance assessment" },
  { naam: "Skillstoets", categorie: "Schriftelijke toets" },
  { naam: "Spreektoets", categorie: "Performance assessment" },
  { naam: "Stationstoets", categorie: "Performance assessment" },
  { naam: "Take home toets", categorie: "Product-opdracht" },
  { naam: "Team-based-learning", categorie: "Product-opdracht" },
  { naam: "Theorietoets", categorie: "Schriftelijke toets" },
  { naam: "Vaardighedentoets", categorie: "Schriftelijke toets" },
  { naam: "Verslag", categorie: "Product-opdracht" },
  { naam: "Voortgangstoets", categorie: "Product-opdracht" },
  { naam: "Vorm in overleg met student(en)", categorie: "Product-opdracht" },
  { naam: "Waar-niet waar", categorie: "Schriftelijke toets" },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const categorieSet = new Set<ToetsCategorie>();
const grouped = new Map<
  string,
  { naam: string; beschrijving?: string; categorieen: Set<ToetsCategorie> }
>();

for (const item of RAW_TOETSVORMEN) {
  categorieSet.add(item.categorie);
  const key = item.naam.trim();
  const existing = grouped.get(key);

  if (existing) {
    existing.categorieen.add(item.categorie);
    if (!existing.beschrijving && item.beschrijving) {
      existing.beschrijving = item.beschrijving;
    }
    continue;
  }

  grouped.set(key, {
    naam: item.naam,
    beschrijving: item.beschrijving,
    categorieen: new Set<ToetsCategorie>([item.categorie]),
  });
}

export const ALLE_CATEGORIEEN: ToetsCategorie[] = Array.from(categorieSet).sort((a, b) =>
  a.localeCompare(b)
);

export const TOETSVORMEN: Toetsvorm[] = Array.from(grouped.values())
  .map((entry) => ({
    id: slugify(entry.naam),
    naam: entry.naam,
    beschrijving: entry.beschrijving,
    categorieen: Array.from(entry.categorieen).sort((a, b) => a.localeCompare(b)) as ToetsCategorie[],
  }))
  .sort((a, b) => a.naam.localeCompare(b));
