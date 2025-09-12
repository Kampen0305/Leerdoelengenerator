import { useState } from 'react';
import type { EducationLevel } from '@/types/education';
import { getSourcesForLevel } from '@/config/sources';

export function LevelPicker({ onGenerate }: { onGenerate?: (level: EducationLevel) => void }) {
  const [level, setLevel] = useState<EducationLevel | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (level && onGenerate) onGenerate(level);
  };

  const renderButton = (lvl: EducationLevel, label: string) => (
    <button
      type="button"
      key={lvl}
      onClick={() => setLevel(lvl)}
      className={`btn ${level === lvl ? 'btn-primary' : 'btn-outline'}`}
    >
      {label}
    </button>
  );

  const sources = level ? getSourcesForLevel(level) : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Funderend onderwijs (SO/PO/V(S)O)</h3>
        <div className="flex flex-wrap gap-2">
          {renderButton('PO', 'PO')}
          {renderButton('SO', 'SO')}
          {renderButton('VSO', 'V(S)O')}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">MBO/HBO/WO</h3>
        <div className="flex flex-wrap gap-2">
          {renderButton('MBO', 'MBO')}
          {renderButton('HBO', 'HBO')}
          {renderButton('WO', 'WO')}
        </div>
      </div>

      {level && (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium">Basisbronnen</h4>
            <span className="badge">Basis wordt vermeld in output</span>
          </div>
          <ul className="list-disc list-inside text-sm">
            {sources.map((s) => (
              <li key={s.id}>{s.title}</li>
            ))}
          </ul>
        </div>
      )}

      <button type="submit" disabled={!level} className="btn btn-primary w-full">
        Genereer
      </button>
    </form>
  );
}
