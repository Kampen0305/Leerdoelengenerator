import React from 'react';
import type { TosSupport } from '../../lib/standards/types';

interface Props {
  value: TosSupport;
  onChange: (value: TosSupport) => void;
}

export function TosOptions({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          checked={value.spraakNaarTekst}
          onChange={(e) => onChange({ ...value, spraakNaarTekst: e.target.checked })}
        />
        <span>Spraak naar tekst</span>
      </label>
      <label className="inline-flex items-center gap-2">
        <span>Taalvereenvoudiging</span>
        <select
          value={value.taalvereenvoudiging}
          onChange={(e) => onChange({ ...value, taalvereenvoudiging: e.target.value as any })}
        >
          <option value="uit">Uit</option>
          <option value="licht">Licht</option>
          <option value="sterk">Sterk</option>
        </select>
      </label>
    </div>
  );
}
