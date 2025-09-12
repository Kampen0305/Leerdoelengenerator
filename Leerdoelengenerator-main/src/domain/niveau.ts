export type OnderwijsSector = 'PO' | 'SO' | 'VSO' | 'VO' | 'MBO' | 'HBO' | 'WO';

export const FUNDEREND: OnderwijsSector[] = ['PO', 'SO', 'VSO', 'VO'];
export const HO_BVE: OnderwijsSector[]   = ['MBO', 'HBO', 'WO'];

export function isFunderend(sector: OnderwijsSector) {
  return FUNDEREND.includes(sector);
}

export function isHOofMBO(sector: OnderwijsSector) {
  return HO_BVE.includes(sector);
}

const BLOOM_HE_EN = ['analyze', 'evaluate', 'create']; // UI-labels
const BLOOM_HE_NL = ['analyseren', 'evalueren', 'creëren']; // als je NL wilt tonen

export type BadgeConfig = {
  title: string;
  showBloom: boolean;
  bloom: string[];
};

export function badgeFor(sector: OnderwijsSector, subtype?: string, locale: 'nl' | 'en' = 'en'): BadgeConfig {
  if (isFunderend(sector)) {
    // Fund. onderwijs: nooit Bloom, geen HBO-artefacten
    switch (sector) {
      case 'PO':  return { title: 'PO — Kerndoelen (SLO)',        showBloom: false, bloom: [] };
      case 'SO':  return { title: 'SO — Kerndoelen (SLO)',        showBloom: false, bloom: [] };
      case 'VSO': return { title: 'V(S)O — Kerndoelen (SLO)',     showBloom: false, bloom: [] };
      case 'VO':  return { title: 'VO — Onderbouw (SLO-kerndoelen)', showBloom: false, bloom: [] };
    }
  }
  // MBO/HBO/WO: Bloom aan
  const bloom = locale === 'nl' ? BLOOM_HE_NL : BLOOM_HE_EN;
  const label = subtype?.trim() ? `${sector} — ${subtype.trim()}` : sector;
  return { title: label, showBloom: true, bloom };
}

