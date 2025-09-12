import type { EducationLevel } from '@/types/education';

export const LEVEL_DISPLAY: Record<EducationLevel, string> = {
  PO: 'PO',
  SO: 'SO',
  VSO: 'V(S)O',
  MBO: 'MBO',
  HBO: 'HBO',
  WO: 'WO',
};

// NL Bloom per niveau (bewust eenvoudiger voor funderend)
export const BLOOM_BY_LEVEL: Record<EducationLevel, string[]> = {
  PO:  ['onthouden', 'begrijpen', 'toepassen'],
  SO:  ['onthouden', 'begrijpen', 'toepassen'],
  VSO: ['onthouden', 'begrijpen', 'toepassen'],
  MBO: ['toepassen', 'analyseren', 'evalueren'],
  HBO: ['analyseren', 'evalueren', 'creëren'],
  WO:  ['analyseren', 'evalueren', 'creëren'],
};

// Bloom tonen? (verborgen bij funderend)
export const SHOW_BLOOM: Record<EducationLevel, boolean> = {
  PO: false, SO: false, VSO: false, MBO: true, HBO: true, WO: true,
};

