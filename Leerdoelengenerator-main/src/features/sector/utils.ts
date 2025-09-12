import type { Sector } from '@/core/education/ui-adapters';

export const isBeroepsonderwijs = (s: Sector) => s === 'MBO' || s === 'HBO' || s === 'WO';
export const isFunderend = (s: Sector) => s === 'PO' || s === 'SO' || s === 'VO' || s === 'VSO';
