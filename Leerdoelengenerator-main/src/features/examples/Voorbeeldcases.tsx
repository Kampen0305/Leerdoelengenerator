import { getAllVoorbeeldcases, getSectorCounts /*, getCasesBySector */ } from '@/lib/examples';

export default function Voorbeeldcases({ currentSector, debug = false }:{
  currentSector?: string|null; debug?: boolean;
}) {
  // TIJDELIJK: zet filter uit om zichtbaarheid te verifiëren:
  // const cases = getCasesBySector(currentSector as any);
  const cases = getAllVoorbeeldcases();

  const counts = getSectorCounts();

  return (
    <div className="space-y-2">
      {debug && (
        <div className="text-xs text-gray-600 p-2 border rounded">
          <div className="font-semibold mb-1">Debug voorbeelden:</div>
          <div>PO:{counts.PO ?? 0} • SO:{counts.SO ?? 0} • VO:{counts.VO ?? 0} • VSO:{counts.VSO ?? 0} • MBO:{counts.MBO ?? 0} • HBO:{counts.HBO ?? 0} • WO:{counts.WO ?? 0}</div>
        </div>
      )}
      {cases.map(c => (
        <button key={c.id} type="button"
          className="w-full text-left bg-emerald-50 border border-emerald-200 rounded-lg p-3 hover:bg-emerald-100">
          {c.titel}
        </button>
      ))}
    </div>
  );
}

