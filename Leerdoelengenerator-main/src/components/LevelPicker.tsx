import { useState } from 'react';
import { LEVEL_TO_GROUP, type EducationLevel } from '@/types/education';

export function LevelPicker({ onGenerate }: { onGenerate?: (level: EducationLevel) => void }) {
  const [level, setLevel] = useState<EducationLevel | null>(null);
  const group = level ? LEVEL_TO_GROUP[level] : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (level && onGenerate) onGenerate(level);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <label htmlFor="level" className="block text-sm font-medium">Niveau</label>
      <select
        id="level"
        required
        value={level ?? ''}
        onChange={(e) => setLevel(e.target.value as EducationLevel)}
        className="select select-bordered w-full"
      >
        <option value="" disabled>
          Kies niveau
        </option>
        <option value="PO">PO</option>
        <option value="SO">SO</option>
        <option value="VSO">VSO</option>
        <option value="MBO">MBO</option>
        <option value="HBO">HBO</option>
        <option value="WO">WO</option>
      </select>
      {group && <p className="text-sm text-muted-foreground">Domeingroep: {group}</p>}
      <button type="submit" disabled={!level} className="btn btn-primary w-full">
        Genereer
      </button>
    </form>
  );
}
