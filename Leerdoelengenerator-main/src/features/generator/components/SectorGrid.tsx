import { useState } from "react";
import { compareByLevel, LevelKey } from "@/utils/levelOrder";

export function SectorGrid({ value, onChange }: {
  value: { PO?:boolean; SO?:boolean; VO?:boolean; VSO?:boolean; MBO?:boolean; HBO?:boolean; WO?:boolean };
  onChange: (v: any) => void;
}) {
  const [error, setError] = useState<string>("");

  function toggle(key: keyof typeof value) {
    const next = { ...value, [key]: !value[key] };
    onChange(next);

    // Light client-side hint (optioneel – de echte block zit in submit.ts):
    const funderend = !!(next.PO || next.SO || next.VO || next.VSO);
    const vervolg = [next.MBO, next.HBO, next.WO].filter(Boolean).length > 0;
    if (funderend && vervolg) {
      setError("Kies óf funderend (PO/SO/VO/VSO) óf MBO/HBO/WO.");
    } else {
      setError("");
    }
  }

  return (
    <div className="space-y-2">
      {/* render jouw 7 knoppen/velden; hieronder pseudo */}
      <div className="grid grid-cols-2 gap-2">
        {(['PO','SO','VO','VSO','MBO','HBO','WO'] as LevelKey[]).sort(compareByLevel).map(k => (
          <button
            key={k}
            type="button"
            onClick={() => toggle(k as any)}
            className={`btn ${value[k as keyof typeof value] ? "btn-primary" : "btn-outline"}`}
          >
            {k}
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
