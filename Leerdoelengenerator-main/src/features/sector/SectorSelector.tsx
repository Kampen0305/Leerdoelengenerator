import React from 'react';
import { SECTORS, Sector } from '../../constants/sector';

interface Props {
  value: Sector;
  onChange: (sector: Sector) => void;
}

export function SectorSelector({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {SECTORS.map((s) => (
        <label key={s} className="inline-flex items-center gap-2">
          <input
            type="radio"
            name="sector"
            value={s}
            checked={value === s}
            onChange={() => onChange(s)}
          />
          <span>{s}</span>
        </label>
      ))}
    </div>
  );
}
