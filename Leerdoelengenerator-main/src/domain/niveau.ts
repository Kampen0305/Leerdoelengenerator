export type OnderwijsSector = 'PO' | 'SO' | 'VSO' | 'VO' | 'MBO' | 'HBO' | 'WO';

export type NiveauBadge = {
  /** Titeltekst in de badge, bv. "PO — Kerndoelen (SLO)" of "HBO — Bachelor" */
  title: string;
  /* Zet true om Bloom-niveaus te tonen in de UI */
  showBloom: boolean;
  /* Standaard Bloom-niveaus voor hoger/beroepsonderwijs */
  bloom?: string[];
};

const BLOOM_HE: string[] = ['analyze', 'evaluate', 'create'];

/**
 * Retourneert een sector-bewuste badgeconfig.
 *
 * Voor PO/SO/VSO/VO: nooit Bloom; titel volgt SLO-kerndoelen.
 *
 * Voor MBO/HBO/WO: optioneel subtype (bv. "Bachelor", "Associate degree", "Master") en Bloom tonen.
 */
export function getNiveauBadge(
  sector: OnderwijsSector,
  programSubtype?: string
): NiveauBadge {
  switch (sector) {
    case 'PO':
      return { title: 'PO — Kerndoelen (SLO)', showBloom: false };
    case 'SO':
      return { title: 'SO — Kerndoelen (SLO)', showBloom: false };
    case 'VSO':
      return { title: 'V(S)O — Kerndoelen (SLO)', showBloom: false };
    case 'VO':
      // Onderbouw valt onder SLO-kerndoelen; geen Bloom
      return { title: 'VO — Onderbouw (SLO-kerndoelen)', showBloom: false };
    case 'MBO':
    case 'HBO':
    case 'WO': {
      const subtype = (programSubtype ?? '').trim();
      const base = subtype ? `${sector} — ${subtype}` : sector;
      return { title: base, showBloom: true, bloom: BLOOM_HE };
    }
    default: {
      // Typedef dekt alles, maar voor de zekerheid:
      const neverSector: never = sector;
      throw new Error(`Onbekende sector: ${(neverSector as any) ?? 'undefined'}`);
    }
  }
}

/** Convenience: simpele string voor UI, inclusief Bloom als dat mag */
export function formatBadgeLine(
  sector: OnderwijsSector,
  programSubtype?: string
): string {
  const cfg = getNiveauBadge(sector, programSubtype);
  if (cfg.showBloom && cfg.bloom?.length) {
    return `${cfg.title} Bloom: ${cfg.bloom.join(' • ')}`;
  }
  return cfg.title;
}
