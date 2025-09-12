// Gebruik TS om bundling-gedoe met JSON te vermijden.
export type Sector = 'PO'|'SO'|'VO'|'VSO'|'MBO'|'HBO'|'WO';

export interface VoorbeeldCase {
  id: string;
  titel: string;
  sector: Sector;
  leergebied?: 'BURGERSCHAP'|'DG'|'ALGEMEEN';
  korteBeschrijving: string;
  baan: 1|2;
  inputs: string[];
  expected: string[];
}

// -- Bestaande cases (haal uit je huidige bronbestanden of plak hier over):
export const mboHboCases: VoorbeeldCase[] = [
  { id:'mbo-zorg',  titel:'mbo-zorg',  sector:'MBO', leergebied:'ALGEMEEN', korteBeschrijving:'', baan:2, inputs:[], expected:[] },
  { id:'mbo-sport', titel:'mbo-sport', sector:'MBO', leergebied:'ALGEMEEN', korteBeschrijving:'', baan:1, inputs:[], expected:[] },
  { id:'hbo-ict',   titel:'hbo-ict',   sector:'HBO', leergebied:'ALGEMEEN', korteBeschrijving:'', baan:2, inputs:[], expected:[] },
];

// -- Nieuwe funderend + WO cases (zoals eerder aangeleverd):
export const funderendWoCases: VoorbeeldCase[] = [
  {
    id: 'po-dg-mediawijsheid',
    titel: 'PO – DG: Mediawijs nieuwsbericht',
    sector: 'PO',
    leergebied: 'DG',
    korteBeschrijving: 'Leerlingen vergelijken twee kinderberichten en checken bron, bedoeling en betrouwbaarheid.',
    baan: 2,
    inputs: ['Sector=PO, Leergebied=Digitale geletterdheid','Kerndoel: media & informatievaardigheid','TOS: taalvereenvoudiging=licht'],
    expected: ['Officiële kerndoeltekst','Didactische leerdoelen in kindtaal','Werkvorm Baan 1 & Baan 2','Reflectievragen over juistheid en bias']
  },
  {
    id: 'po-burg-klassafspraken',
    titel: 'PO – Burgerschap: Klasafspraken & dialoog',
    sector: 'PO',
    leergebied: 'BURGERSCHAP',
    korteBeschrijving: 'Klas maakt gezamenlijke afspraken na een kringgesprek over samen spelen/delen.',
    baan: 1,
    inputs: ['Sector=PO, Leergebied=Burgerschap','Kerndoel: democratische cultuur of sociale/morele ontwikkeling'],
    expected: ['Officiële kerndoeltekst','Werkvorm zonder AI + differentiatie','Bewijsvorm: observatie + klasposter']
  },
  {
    id: 'so-dg-spraak-naar-tekst',
    titel: 'SO – DG: Spreek je verhaal (spraak-naar-tekst)',
    sector: 'SO',
    leergebied: 'DG',
    korteBeschrijving: 'Leerlingen met TOS dicteren een kort verhaal en redigeren samen.',
    baan: 2,
    inputs: ['Sector=SO, Leergebied=DG','TOS: spraakNaarTekst=true, taalvereenvoudiging=sterk, visueleHints=true'],
    expected: ['Officiële kerndoeltekst','Baan-2: transparantie + logboek','TOS-tips en pictogram-stappenplan']
  },
  {
    id: 'so-burg-rollen-en-regels',
    titel: 'SO – Burgerschap: Rollen, regels en veiligheid',
    sector: 'SO',
    leergebied: 'BURGERSCHAP',
    korteBeschrijving: 'Rollenspel “Wat doe je als…?” rond schoolplein- en online regels.',
    baan: 1,
    inputs: ['Sector=SO, Leergebied=Burgerschap'],
    expected: ['Officiële kerndoeltekst','Duidelijke stappen zonder AI','Observatie + nabespreking']
  },
  {
    id: 'vo-dg-factcheck',
    titel: 'VO (onderbouw) – DG: Fact-check challenge',
    sector: 'VO',
    leergebied: 'DG',
    korteBeschrijving: 'Leerlingen onderzoeken een viraal bericht: waar of niet?',
    baan: 2,
    inputs: ['Sector=VO, Leergebied=DG','Kerndoel: informatievaardigheid','Baan=2, Reflectie verplicht'],
    expected: ['Officiële kerndoeltekst','Werkvorm met AI + bronvermelding prompts','Logboek + reflectie']
  },
  {
    id: 'vo-burg-debat',
    titel: 'VO (onderbouw) – Burgerschap: Mini-debat lokaal onderwerp',
    sector: 'VO',
    leergebied: 'BURGERSCHAP',
    korteBeschrijving: 'Teams debatteren over een actuele schoolkwestie.',
    baan: 1,
    inputs: ['Sector=VO, Leergebied=Burgerschap'],
    expected: ['Officiële kerndoeltekst','Werkvorm zonder AI + rubric','Peer-feedback']
  },
  {
    id: 'vso-dg-veilig-online',
    titel: 'VSO – DG: Veilig online & wachtwoorden',
    sector: 'VSO',
    leergebied: 'DG',
    korteBeschrijving: 'Sterk wachtwoord, 2FA instellen en phishing herkennen.',
    baan: 2,
    inputs: ['Sector=VSO, Leergebied=DG','TOS: visueleHints=true'],
    expected: ['Officiële kerndoeltekst','Checklist + bewijs','Transparantie & korte reflectie']
  },
  {
    id: 'vso-burg-mededeling',
    titel: 'VSO – Burgerschap: Ik & de buurt (mededeling)',
    sector: 'VSO',
    leergebied: 'BURGERSCHAP',
    korteBeschrijving: 'Korte mededeling maken voor buurthuis-activiteit.',
    baan: 1,
    inputs: ['Sector=VSO, Leergebied=Burgerschap'],
    expected: ['Officiële kerndoeltekst','Observatielijst sociaal-communicatief','Eenvoudige rubric (3 niveaus)']
  },
  {
    id: 'wo-ai-ethiek-essay',
    titel: 'WO – AI-ethiek: Position paper met bronkritiek',
    sector: 'WO',
    leergebied: 'ALGEMEEN',
    korteBeschrijving: 'Essay (±1200 woorden) met transparante AI-inzet.',
    baan: 2,
    inputs: ['Sector=WO','Eigen leeruitkomst + ethiek/kritisch denken','Promptlog verplicht'],
    expected: ['Didactische leeruitkomsten','Transparantie, logboek, reflectie','Beoordeling: argumentatie + bronnen + proces']
  }
];

export const allVoorbeeldcases: VoorbeeldCase[] = [
  ...mboHboCases,
  ...funderendWoCases,
];

