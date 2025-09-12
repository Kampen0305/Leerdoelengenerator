import React from 'react';
import { getCasesBySector } from '@/lib/examples';
import { useSector } from '@/features/sector/useSector';

export function Voorbeeldcases() {
  const { sector } = useSector();
  const cases = getCasesBySector(sector);

  if (cases.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      {cases.map((c) => (
        <div key={c.id} className="rounded border p-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{c.titel}</h3>
            <span className="rounded bg-gray-200 px-2 text-xs">Baan {c.baan}</span>
          </div>
          <p className="text-sm text-gray-600">{c.korteBeschrijving}</p>
        </div>
      ))}
    </div>
  );
}
