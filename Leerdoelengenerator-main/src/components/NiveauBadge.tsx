import React from 'react';
import { badgeFor, OnderwijsSector } from '@/domain/niveau';

type Props = {
  sector?: OnderwijsSector | null;      // kan even null zijn tijdens hydration
  subtype?: string | null;              // bv. "Bachelor" bij HBO, optioneel
  locale?: 'nl' | 'en';
  className?: string;
};

export default function NiveauBadge({ sector, subtype, locale = 'nl', className }: Props) {
  // Niks renderen totdat sector bekend is -> voorkomt "flash" van fout label
  if (!sector) return null;

  const { title, showBloom, bloom } = badgeFor(sector, subtype ?? undefined, locale);

  return (
    <div
      data-ready="true"
      data-sector={sector}
      className={className ?? 'inline-flex items-center gap-2 rounded-xl border px-3 py-1 text-sm bg-neutral-50'}
    >
      <strong>{title}</strong>
      {showBloom && bloom.length > 0 ? (
        <span className="opacity-70">Bloom: {bloom.join(' • ')}</span>
      ) : null}
    </div>
  );
}

