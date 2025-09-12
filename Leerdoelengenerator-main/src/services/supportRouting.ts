import type { Sector, LeergebiedKey, SupportItem, HandreikingItem } from '@/types';
import SLO_INDEX from '@/content/sloKerndoelenIndex.json';
import { HANDREIKINGEN } from '@/content/handreikingen';

const FUNDEREND: Sector[] = ['PO','SO','VO','VSO'];
const BER/HBO_WO: Sector[] = ['MBO','HBO','WO'];

export type SupportModel =
  | { mode: 'FUNDEREND'; slo: SupportItem[] }
  | { mode: 'BEROEPS_HO'; handreikingen: HandreikingItem[] };

/**
 * Retourneert het UI-model voor ondersteuning op basis van sector.
 * - FUNDEREND: SLO-ondersteuning tonen (geen handreikingen)
 * - MBO/HBO/WO: Handreikingen tonen (geen SLO)
 */
export function getSupportModel(sector: Sector, leergebieden: LeergebiedKey[] = ['BURGERSCHAP','DG']): SupportModel {
  if (FUNDEREND.includes(sector)) {
    const items: SupportItem[] = leergebieden.flatMap(lg => {
      const arr = (SLO_INDEX as Record<string, any[]>)[lg] || [];
      return arr.map((x) => ({
        id: x.id,
        titel: x.titel,
        beschrijving: x.beschrijving,
        leergebied: lg as LeergebiedKey,
      }));
    });
    return { mode: 'FUNDEREND', slo: items };
  }
  if (BER/HBO_WO.includes(sector)) {
    return { mode: 'BEROEPS_HO', handreikingen: HANDREIKINGEN };
  }
  // Fallback — behandel onbekend als funderend veilig:
  const items: SupportItem[] = (['BURGERSCHAP','DG'] as LeergebiedKey[]).flatMap(lg => {
    const arr = (SLO_INDEX as Record<string, any[]>)[lg] || [];
    return arr.map((x) => ({
      id: x.id,
      titel: x.titel,
      beschrijving: x.beschrijving,
      leergebied: lg as LeergebiedKey,
    }));
  });
  return { mode: 'FUNDEREND', slo: items };
}
