export type EducationLevel = 'PO' | 'SO' | 'VSO' | 'MBO' | 'HBO' | 'WO';
export type DomainGroup = 'Funderend' | 'MBO_HBO_WO';

export const LEVEL_TO_GROUP: Record<EducationLevel, DomainGroup> = {
  PO: 'Funderend',
  SO: 'Funderend',
  VSO: 'Funderend',
  MBO: 'MBO_HBO_WO',
  HBO: 'MBO_HBO_WO',
  WO: 'MBO_HBO_WO',
};
