export type Sector =
  | 'PO'
  | 'SO'
  | 'VO_ONDERBOUW'
  | 'VSO'
  | 'MBO'
  | 'HBO'
  | 'WO';

export type Leergebied = 'BURGERSCHAP' | 'DG';

export interface Kerndoel {
  id: string;
  sectors: Sector[];
  leergebied: Leergebied;
  kernzin: string;
  subdoelen: { code: string; tekst: string }[];
  toelichting?: string;
  status: 'definitieve_concepten_2025';
  bron: { doc: 'SLO-2025'; ref: string };
}

export interface AiBaanSettings {
  baan: 1 | 2;
  transparantie: boolean;
  procesbewijzen: boolean;
}

export interface TosSupport {
  spraakNaarTekst: boolean;
  taalvereenvoudiging: 'uit' | 'licht' | 'sterk';
  visueleHints: boolean;
  woordenschatBank: boolean;
  leesniveau: 'A1' | 'A2' | '1F' | '2F';
}
