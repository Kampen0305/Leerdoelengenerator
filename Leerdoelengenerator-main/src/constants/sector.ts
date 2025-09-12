export const SECTORS = [
  'PO',
  'SO',
  'VO_ONDERBOUW',
  'VSO',
  'MBO',
  'HBO',
  'WO',
] as const;

export type Sector = typeof SECTORS[number];
