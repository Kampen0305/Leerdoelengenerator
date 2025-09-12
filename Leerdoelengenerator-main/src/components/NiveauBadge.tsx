import React from 'react';
import { getNiveauBadge, OnderwijsSector } from '../domain/niveau';

type Props = {
  sector: OnderwijsSector;
  programSubtype?: string; // bv. "Bachelor", "Master", "Associate degree"
};

export default function NiveauBadge({ sector, programSubtype }: Props) {
  const cfg = getNiveauBadge(sector, programSubtype);

  return (
    <div aria-label="niveau-badge" className="inline-flex items-center gap-2 rounded-xl border px-3 py-1 text-sm" >
      <strong>{cfg.title}</strong>
      {cfg.showBloom && cfg.bloom?.length ? (
        <span className="opacity-70">Bloom: {cfg.bloom.join(' • ')}</span>
      ) : null}
    </div>
  );
}
