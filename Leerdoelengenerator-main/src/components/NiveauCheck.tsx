// src/components/NiveauCheck.tsx
import { LevelKey } from "../domain/levelProfiles";
import { validateObjective } from "../utils/objectiveValidator";

export function NiveauCheck({ levelKey, objective }: { levelKey: LevelKey; objective: string }) {
  const res = validateObjective(objective, levelKey);
  if (res.ok) {
    return <div className="rounded-md p-3 bg-green-50 text-green-800">✅ Niveau‑check: in orde.</div>;
  }
  return (
    <div className="rounded-md p-3 bg-red-50 text-red-800">
      ❌ Niveau‑check: verbeteringen nodig.
      <ul className="list-disc ml-5 mt-1">
        {res.issues.map((i, idx) => (
          <li key={idx}>{i.message}</li>
        ))}
      </ul>
    </div>
  );
}
