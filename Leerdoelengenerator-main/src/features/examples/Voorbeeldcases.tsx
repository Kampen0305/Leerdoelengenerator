import { getAllVoorbeeldcases, getSectorCounts /*, getCasesBySector */ } from '@/lib/examples';
import type { VoorbeeldCase } from '@/lib/examples';
import { compareByLevel, LevelKey } from '@/utils/levelOrder';

export default function Voorbeeldcases({ currentSector, debug = false, onSelect }:{
  currentSector?: string | null;
  debug?: boolean;
  onSelect?: (c: VoorbeeldCase) => void;
}) {
  // TIJDELIJK: zet filter uit om zichtbaarheid te verifiëren:
  // const cases = getCasesBySector(currentSector as any);
  const cases = getAllVoorbeeldcases().sort((a, b) => compareByLevel(a.titel, b.titel));

  const counts = getSectorCounts();
  const countsLine = (['WO','HBO','MBO','VO','VSO','PO','SO'] as LevelKey[])
    .map((lvl) => `${lvl}:${counts[lvl] ?? 0}`)
    .join(' • ');

  return (
    <div className="space-y-2">
      {debug && (
        <div className="text-xs text-gray-600 p-2 border rounded">
          <div className="font-semibold mb-1">Overkoepelende kaders & visies</div>
          <div>{countsLine}</div>
        </div>
      )}
      {cases.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onSelect?.(c)}
          className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg text-sm"
        >
          {c.titel}
        </button>
      ))}
    </div>
  );
}

