import React from 'react';
import type { Sector } from '@/lib/standards/types';

type Props = {
  value: string | null;
  onChange: (v: Sector) => void;
};

export default function SectorSelector({ value, onChange }: Props) {
  const options = [
    { value: 'PO', label: 'PO' },
    { value: 'SO', label: 'SO' },
    { value: 'VO', label: 'VO' },
    { value: 'VSO', label: 'VSO' },
    { value: 'MBO', label: 'MBO' },
    { value: 'HBO', label: 'HBO' },
    { value: 'WO', label: 'WO' },
  ];
  return (
    <div className="space-y-2">
      <label className="font-medium">Onderwijssector *</label>
      <div className="grid grid-cols-2 gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value as Sector)}
            className={`rounded-lg border p-2 text-left ${
              value === o.value ? 'bg-emerald-50 border-emerald-500' : 'bg-white'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
