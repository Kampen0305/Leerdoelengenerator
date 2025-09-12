import React from 'react';
import type { Kerndoel, Leergebied, Sector } from '../../lib/standards/types';
import { track } from '../../services/telemetry';

interface Props {
  sector: Sector;
  voSublevel?: 'onderbouw' | 'bovenbouw';
  kerndoelen: Kerndoel[];
  selected: string[];
  toggle: (id: string) => void;
  leergebied?: Leergebied;
  setLeergebied?: (lg: Leergebied) => void;
}

export function KerndoelSelector({
  sector,
  voSublevel,
  kerndoelen,
  selected,
  toggle,
  leergebied,
  setLeergebied,
}: Props) {
  const isFunderend = ['PO', 'SO', 'VO', 'VSO'].includes(sector);
  const showLeergebieden =
    isFunderend && (sector !== 'VO' || voSublevel === 'onderbouw');

  return (
    <div className="flex flex-col gap-2">
      {showLeergebieden && setLeergebied && (
        <div className="mb-2 flex gap-4">
          {(['BURGERSCHAP', 'DG'] as Leergebied[]).map((lg) => (
            <label key={lg} className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="leergebied"
                value={lg}
                checked={leergebied === lg}
                onChange={() => {
                  track('leergebied_selected', { leergebied: lg });
                  setLeergebied(lg);
                }}
              />
              <span>{lg}</span>
            </label>
          ))}
        </div>
      )}
      {kerndoelen.map((kd) => (
        <label key={kd.id} className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={selected.includes(kd.id)}
            onChange={() => toggle(kd.id)}
          />
          <span>{kd.kernzin}</span>
        </label>
      ))}
    </div>
  );
}
