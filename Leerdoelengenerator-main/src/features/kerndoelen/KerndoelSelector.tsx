import React from 'react';
import type { Kerndoel } from '../../lib/standards/types';

interface Props {
  kerndoelen: Kerndoel[];
  selected: string[];
  toggle: (id: string) => void;
}

export function KerndoelSelector({ kerndoelen, selected, toggle }: Props) {
  return (
    <div className="flex flex-col gap-2">
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
