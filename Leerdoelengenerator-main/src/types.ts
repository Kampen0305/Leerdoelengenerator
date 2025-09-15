export type Sector = 'PO'|'SO'|'VSO'|'VO'|'MBO'|'HBO'|'WO';
export type OnderwijsType = 'FUNDEREND' | 'BEROEPS';
export type Leergebied = 'BURGERSCHAP'|'DG'|'COMMUNICATIE'|'TECHNIEK'|'ONDERZOEK'|'MANAGEMENT'|'ZORG'|'ICT'|'ALGEMEEN';

export interface TemplateItem {
  id: string;
  titel: string;
  sector: Sector;
  onderwijsType: OnderwijsType; // nieuw: filter “Alle onderwijstypes”
  leergebied: Leergebied;
  niveau?: string;               // bijv. “MBO • Niveau 3”
  kwaliteit?: number;            // 0–100, voor badge
  baan: 1|2;                     // Two-Lane: 1=AI-bewust (zonder/onder voorwaarden), 2=AI-geletterd (met AI)
  origineelLeerdoel: string;
  aiReadyLeerdoel: string;       // eenvoudigere, AI-ready versie
  korteBeschrijving?: string;
}

export type LeergebiedKey = 'BURGERSCHAP'|'DG'; // DG = Digitale Geletterdheid

export interface SupportItem {
  id: string;
  titel: string;
  beschrijving?: string;
  leergebied: LeergebiedKey;
  // optionele linking naar bron (niet tonen in funderend, alleen intern)
  bronId?: string;
}

export interface HandreikingItem {
  id: string;
  titel: string;
  url: string;
  type: 'VISIE'|'HANDREIKING'|'REFERENTIEKADER';
}

