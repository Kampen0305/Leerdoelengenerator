import React from 'react';
import { SECTORS, Sector } from '../../constants/sector';
import { track } from '../../services/telemetry';

interface Props {
  value: Sector;
  onChange: (sector: Sector) => void;
}

export function SectorSelector({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {SECTORS.map((s) => (
        <label
          key={s}
          className="inline-flex items-center gap-2"
          title={
            s === 'VO'
              ? 'Geldt voor onderbouw bij kerndoelen; bovenbouw werkt met examenprogramma/eindtermen (geen kerndoelen).'
              : undefined
          }
        >
          <input
            type="radio"
            name="sector"
            value={s}
            checked={value === s}
            onChange={() => {
              track('sector_selected', { sector: s });
              onChange(s);
            }}
          />
          <span>{s}</span>
        </label>
      ))}
    </div>
  );
}
