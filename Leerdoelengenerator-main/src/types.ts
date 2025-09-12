export type Sector = 'PO'|'SO'|'VO'|'VSO'|'MBO'|'HBO'|'WO';

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
