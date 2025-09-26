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

export const TOETSVORMEN: Toetsvorm[] = [
  {
    id: "advies",
    naam: "Advies",
    beschrijving:
      "Een schriftelijk of mondeling product waarin een student aanbevelingen doet op basis van analyse van een situatie.",
    categorieen: ["Product-opdracht"],
  },
  {
    id: "beroepshandelingen-stageplek",
    naam: "Beroepshandelingen stageplek",
    beschrijving:
      "Toetsing van taken die de student uitvoert tijdens stage, gekoppeld aan kerntaken uit het kwalificatiedossier.",
    categorieen: ["Praktijk/Authentiek", "Performance assessment"],
  },
  {
    id: "beroepsproduct",
    naam: "Beroepsproduct",
    beschrijving:
      "Concreet eindproduct uit de beroepspraktijk (bijv. rapport, ontwerp, handleiding).",
    categorieen: ["Product-opdracht"],
  },
  {
    id: "casustoets",
    naam: "Casustoets",
    beschrijving:
      "Student analyseert een praktijksituatie en lost een probleem op met onderbouwing.",
    categorieen: ["Schriftelijke toets", "Praktijk/Authentiek"],
  },
  {
    id: "criteriumgericht-interview",
    naam: "Criteriumgericht interview (CGI)",
    beschrijving:
      "Mondelinge toets waarin student vragen beantwoordt over eigen handelen in relatie tot vastgestelde criteria.",
    categorieen: ["Mondeling", "Mondelinge toets", "Performance assessment"],
  },
  {
    id: "demonstratie",
    naam: "Demonstratie",
    beschrijving: "Student laat zien dat hij/zij een vaardigheid of handeling beheerst.",
    categorieen: ["Praktijk/Authentiek", "Performance assessment"],
  },
  {
    id: "eindgesprek",
    naam: "Eindgesprek",
    beschrijving: "Mondeling gesprek waarin student reflecteert op leerproces en resultaten.",
    categorieen: ["Mondeling", "Mondelinge toets", "Proces/Portfolio"],
  },
  {
    id: "eindproduct",
    naam: "Eindproduct",
    beschrijving: "Het uiteindelijke resultaat van een opdracht of project.",
    categorieen: ["Product-opdracht"],
  },
  {
    id: "essay",
    naam: "Essay",
    beschrijving:
      "Schrijfopdracht waarin student een stelling of probleem uitwerkt met argumentatie.",
    categorieen: ["Schriftelijk", "Schriftelijke toets"],
  },
  {
    id: "experiment",
    naam: "Experiment",
    beschrijving: "Student voert een proef of test uit en analyseert de resultaten.",
    categorieen: ["Praktijk/Authentiek", "Product-opdracht"],
  },
  {
    id: "game",
    naam: "Game",
    beschrijving:
      "Toetsing door middel van een spelvorm waarin kennis/vaardigheden toegepast worden.",
    categorieen: ["Digitaal/Geautomatiseerd", "Product-opdracht"],
  },
  {
    id: "gedragsassessment",
    naam: "Gedragsassessment",
    beschrijving: "Observatie van gedrag in gesimuleerde praktijksituaties.",
    categorieen: ["Performance assessment", "Praktijk/Authentiek"],
  },
  {
    id: "geschreven-beroepsproduct",
    naam: "Geschreven beroepsproduct",
    beschrijving:
      "Schriftelijke uitwerking van een beroepsopdracht (bijv. beleidsplan).",
    categorieen: ["Schriftelijk", "Product-opdracht"],
  },
  {
    id: "gesloten-items",
    naam: "Gesloten items (selected response)",
    beschrijving: "Vragen met vaste antwoordopties (bijv. multiple choice).",
    categorieen: ["Schriftelijke toets", "Digitaal/Geautomatiseerd"],
  },
  {
    id: "half-open-vragen",
    naam: "Half-open vragen toets",
    beschrijving: "Vragen waarbij een kort antwoord verwacht wordt.",
    categorieen: ["Schriftelijke toets"],
  },
  {
    id: "invul",
    naam: "Invul",
    beschrijving:
      "Toets met invulvragen (bijv. ontbrekende woorden of cijfers aanvullen).",
    categorieen: ["Schriftelijke toets", "Digitaal/Geautomatiseerd"],
  },
  {
    id: "kennisclip",
    naam: "Kennisclip",
    beschrijving: "Digitale video waarin student kennis deelt of uitlegt.",
    categorieen: ["Digitaal/Geautomatiseerd", "Product-opdracht"],
  },
  {
    id: "kennistoets",
    naam: "Kennistoets",
    beschrijving: "Toets die kennis meet, vaak schriftelijk of digitaal.",
    categorieen: ["Schriftelijke toets"],
  },
  {
    id: "kort-antwoord",
    naam: "Kort antwoord",
    beschrijving:
      "Toetsvorm met beknopte antwoorden, vaak feitelijk.",
    categorieen: ["Schriftelijke toets"],
  },
  {
    id: "luistertoets",
    naam: "Luistertoets",
    beschrijving:
      "Student luistert naar een audiofragment en beantwoordt vragen.",
    categorieen: ["Schriftelijke toets", "Digitaal/Geautomatiseerd"],
  },
  {
    id: "matching",
    naam: "Matching",
    beschrijving: "Opdrachten waarbij elementen aan elkaar gekoppeld worden.",
    categorieen: ["Schriftelijke toets", "Digitaal/Geautomatiseerd"],
  },
  {
    id: "meerkeuze",
    naam: "Meerkeuze",
    beschrijving: "Toets met multiplechoicevragen.",
    categorieen: ["Schriftelijke toets", "Digitaal/Geautomatiseerd"],
  },
  {
    id: "observatie",
    naam: "Observatie",
    beschrijving: "Beoordeling van studentgedrag tijdens een activiteit of taak.",
    categorieen: ["Praktijk/Authentiek", "Performance assessment"],
  },
  {
    id: "onderzoek",
    naam: "Onderzoek",
    beschrijving:
      "Student voert een onderzoek uit en verantwoordt proces en resultaten.",
    categorieen: ["Product-opdracht", "Proces/Portfolio"],
  },
  {
    id: "ontwerp",
    naam: "Ontwerp",
    beschrijving:
      "Student ontwikkelt een ontwerp of prototype als toetsproduct.",
    categorieen: ["Product-opdracht", "Praktijk/Authentiek"],
  },
  {
    id: "open-book-toets",
    naam: "Open book toets",
    beschrijving: "Toets waarbij student gebruik mag maken van hulpmiddelen.",
    categorieen: ["Schriftelijke toets"],
  },
  {
    id: "open-items",
    naam: "Open items (constructed response)",
    beschrijving: "Open vragen waarbij langere antwoorden verwacht worden.",
    categorieen: ["Schriftelijke toets"],
  },
  {
    id: "open-vragen-toets",
    naam: "Open-vragen toets",
    beschrijving: "Toets met open vragen, zonder vaste antwoordopties.",
    categorieen: ["Schriftelijke toets"],
  },
  {
    id: "paper",
    naam: "Paper",
    beschrijving: "Schriftelijk academisch werkstuk.",
    categorieen: ["Schriftelijk", "Schriftelijke toets"],
  },
  {
    id: "pitch",
    naam: "Pitch",
    beschrijving:
      "Korte presentatie om een idee of plan overtuigend over te brengen.",
    categorieen: ["Mondeling", "Performance assessment"],
  },
  {
    id: "plan-van-aanpak",
    naam: "Plan van aanpak/werkplan",
    beschrijving: "Uitwerking van stappenplan voor een opdracht.",
    categorieen: ["Proces/Portfolio", "Product-opdracht"],
  },
  {
    id: "portfolio-ontwikkel",
    naam: "Portfolio - ontwikkel",
    beschrijving:
      "Portfolio waarin student ontwikkelingsproces zichtbaar maakt.",
    categorieen: ["Proces/Portfolio", "Portfolio"],
  },
  {
    id: "portfolio-product",
    naam: "Portfolio - product",
    beschrijving: "Portfolio met bewijsstukken van afgeronde prestaties.",
    categorieen: ["Portfolio"],
  },
  {
    id: "portfolio-assessment",
    naam: "Portfolio assessment",
    beschrijving: "Beoordeling van het gehele portfolio.",
    categorieen: ["Portfolio", "Proces/Portfolio"],
  },
  {
    id: "posterpresentatie",
    naam: "Posterpresentatie",
    beschrijving:
      "Toets waarin student informatie presenteert via poster en toelichting.",
    categorieen: ["Mondeling", "Product-opdracht"],
  },
  {
    id: "practicumtoets",
    naam: "Practicumtoets",
    beschrijving: "Toets in laboratorium- of praktijkomgeving.",
    categorieen: ["Praktijk/Authentiek"],
  },
  {
    id: "praktijktoets",
    naam: "Praktijktoets",
    beschrijving: "Toetsing van vaardigheden in de praktijk.",
    categorieen: ["Praktijk/Authentiek", "Performance assessment"],
  },
  {
    id: "presentatie",
    naam: "Presentatie",
    beschrijving: "Mondelinge presentatie over een onderwerp of product.",
    categorieen: ["Mondeling", "Product-opdracht"],
  },
  {
    id: "proces",
    naam: "Proces",
    beschrijving: "Beoordeling van het verloop van werkzaamheden of project.",
    categorieen: ["Proces/Portfolio"],
  },
  {
    id: "product",
    naam: "Product",
    beschrijving:
      "Beoordeling van concreet resultaat (bijv. werkstuk, ontwerp).",
    categorieen: ["Product-opdracht"],
  },
  {
    id: "project",
    naam: "Project",
    beschrijving:
      "Groeps- of individuele opdracht met product en proces.",
    categorieen: ["Product-opdracht", "Proces/Portfolio"],
  },
  {
    id: "rapport",
    naam: "Rapport",
    beschrijving:
      "Schriftelijke uitwerking van bevindingen of onderzoek.",
    categorieen: ["Schriftelijk", "Schriftelijke toets"],
  },
  {
    id: "reflectie",
    naam: "Reflectie",
    beschrijving:
      "Schriftelijke of mondelinge terugblik op leerervaring.",
    categorieen: ["Proces/Portfolio", "Product-opdracht"],
  },
  {
    id: "reflectiegesprek",
    naam: "Reflectiegesprek",
    beschrijving: "Mondeling gesprek over leerervaring en ontwikkeling.",
    categorieen: ["Mondeling", "Proces/Portfolio"],
  },
  {
    id: "resultaatformulier",
    naam: "Resultaatformulier",
    beschrijving:
      "Standaardformulier waarmee prestaties beoordeeld worden.",
    categorieen: ["Proces/Portfolio"],
  },
  {
    id: "rollenspel",
    naam: "Rollenspel",
    beschrijving:
      "Gesimuleerde situatie waarin student een rol vervult.",
    categorieen: ["Performance assessment", "Praktijk/Authentiek"],
  },
  {
    id: "script-concordance-test",
    naam: "Script-Concordance-Test (SCT)",
    beschrijving:
      "Toets waarbij student klinisch redeneren laat zien in casussen.",
    categorieen: ["Schriftelijke toets"],
  },
  {
    id: "simulatie",
    naam: "Simulatie",
    beschrijving:
      "Nabootsing van praktijksituatie waarin student handelt.",
    categorieen: ["Praktijk/Authentiek", "Performance assessment"],
  },
  {
    id: "simulatie-patient-toets",
    naam: "Simulatie-patient-toets",
    beschrijving:
      "Toets met een (gespeelde) patiënt om vaardigheden te toetsen.",
    categorieen: ["Praktijk/Authentiek", "Performance assessment"],
  },
  {
    id: "skillstoets",
    naam: "Skillstoets",
    beschrijving: "Toets van specifieke praktische vaardigheden.",
    categorieen: ["Praktijk/Authentiek", "Performance assessment"],
  },
  {
    id: "spreektoets",
    naam: "Spreektoets",
    beschrijving: "Mondelinge taalvaardigheidstoets.",
    categorieen: ["Mondeling", "Mondelinge toets"],
  },
  {
    id: "stationstoets",
    naam: "Stationstoets",
    beschrijving:
      "Circuit van opdrachten met verschillende taken/stations.",
    categorieen: ["Praktijk/Authentiek", "Performance assessment"],
  },
  {
    id: "take-home-toets",
    naam: "Take home toets",
    beschrijving:
      "Toets die de student thuis maakt binnen gestelde tijd.",
    categorieen: ["Schriftelijke toets"],
  },
  {
    id: "team-based-learning",
    naam: "Team-based-learning",
    beschrijving:
      "Groepstoets waarbij studenten samenwerken aan vragen/opdrachten.",
    categorieen: ["Peer/Co-assessment", "Proces/Portfolio"],
  },
  {
    id: "theorietoets",
    naam: "Theorietoets",
    beschrijving: "Schriftelijke toets gericht op theoretische kennis.",
    categorieen: ["Schriftelijke toets"],
  },
  {
    id: "vaardighedentoets",
    naam: "Vaardighedentoets",
    beschrijving: "Toets gericht op praktische vaardigheden.",
    categorieen: ["Praktijk/Authentiek", "Performance assessment"],
  },
  {
    id: "verslag",
    naam: "Verslag",
    beschrijving:
      "Schriftelijke rapportage over opdracht of onderzoek.",
    categorieen: ["Schriftelijk", "Product-opdracht"],
  },
  {
    id: "voortgangstoets",
    naam: "Voortgangstoets",
    beschrijving:
      "Toets die ontwikkeling van kennis/vaardigheden in de tijd meet.",
    categorieen: ["Schriftelijke toets"],
  },
  {
    id: "vorm-in-overleg",
    naam: "Vorm in overleg met student(en)",
    beschrijving:
      "Toetsvorm afgestemd met student, maatwerk.",
    categorieen: ["Proces/Portfolio"],
  },
  {
    id: "waar-niet-waar",
    naam: "Waar-niet waar",
    beschrijving:
      "Toets met stellingen die correct of fout moeten worden beoordeeld.",
    categorieen: ["Schriftelijke toets", "Digitaal/Geautomatiseerd"],
  },
];
