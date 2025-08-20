// src/components/LevelBadge.tsx
import { LEVEL_PROFILES, LevelKey } from "../domain/levelProfiles";

export function LevelBadge({ levelKey }: { levelKey: LevelKey }) {
  const p = LEVEL_PROFILES[levelKey];
  return (
    <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm bg-slate-100">
      <span className="font-medium">{p.label}</span>
      <span className="opacity-70">Bloom: {p.allowedBands.join(" • ")}</span>
    </div>
  );
}
