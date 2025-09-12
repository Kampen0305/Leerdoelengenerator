export type OnderwijsSector = 'PO' | 'SO' | 'VSO' | 'VO' | 'MBO' | 'HBO' | 'WO';

export type NiveauBadge = {
  title: string;
  showBloom?: boolean;
  bloom?: string[];
};

export function getNiveauBadge(sector: OnderwijsSector, programSubtype?: string): NiveauBadge {
  const title = programSubtype ? `${sector} – ${programSubtype}` : sector;
  const showBloom = sector === 'MBO' || sector === 'HBO' || sector === 'WO';
  return { title, showBloom };
}
