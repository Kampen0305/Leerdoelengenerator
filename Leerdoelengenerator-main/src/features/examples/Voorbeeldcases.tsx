import { getCasesBySector } from '@/lib/examples';
import type { VoorbeeldCase } from '@/lib/examples';

export default function Voorbeeldcases({ currentSector, onSelect }:{
  currentSector?: string | null;
  onSelect?: (c: VoorbeeldCase) => void;
}) {
  const cases = getCasesBySector(currentSector as any);

  return (
    <div className="space-y-2">
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

