import React from 'react';
import type { AiBaanSettings } from '../../lib/standards/types';

interface Props {
  value: AiBaanSettings;
  onChange: (value: AiBaanSettings) => void;
}

export function AiBaanToggle({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="inline-flex items-center gap-2">
        <input
          type="radio"
          name="ai-baan"
          checked={value.baan === 1}
          onChange={() => onChange({ ...value, baan: 1 })}
        />
        <span>Baan 1</span>
      </label>
      <label className="inline-flex items-center gap-2">
        <input
          type="radio"
          name="ai-baan"
          checked={value.baan === 2}
          onChange={() => onChange({ ...value, baan: 2, transparantie: true, procesbewijzen: true })}
        />
        <span>Baan 2</span>
      </label>
    </div>
  );
}
