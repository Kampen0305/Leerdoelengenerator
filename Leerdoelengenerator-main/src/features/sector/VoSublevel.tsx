import React from 'react';
import { track } from '../../services/telemetry';

interface Props {
  value: 'onderbouw' | 'bovenbouw';
  onChange: (v: 'onderbouw' | 'bovenbouw') => void;
}

export function VoSublevel({ value, onChange }: Props) {
  const options: ('onderbouw' | 'bovenbouw')[] = ['onderbouw', 'bovenbouw'];
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <label key={opt} className="inline-flex items-center gap-2">
          <input
            type="radio"
            name="vo-sublevel"
            value={opt}
            checked={value === opt}
            onChange={() => {
              track('vo_sublevel_selected', { level: opt });
              onChange(opt);
            }}
          />
          <span className="capitalize">{opt}</span>
        </label>
      ))}
    </div>
  );
}
