export const SECTORS = [
  'PO',
  'SO',
  'VO',
  'VSO',
  'MBO',
  'HBO',
  'WO',
] as const;

export type Sector = typeof SECTORS[number];
