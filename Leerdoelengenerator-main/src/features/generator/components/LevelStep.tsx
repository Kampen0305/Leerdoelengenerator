import { LevelCluster } from "@/lib/basis";

const LEVEL_OPTIONS = [
  { value: LevelCluster.FUNDEREND, label: "Funderend (PO/SO/VSO)" },
  { value: LevelCluster.MBO, label: "MBO" },
  { value: LevelCluster.HBO, label: "HBO" },
  { value: LevelCluster.WO, label: "WO" },
];

export function LevelStep({ value, onChange }: { value: LevelCluster; onChange: (v: LevelCluster) => void }) {
  return (
    <div className="space-y-3">
      <label className="font-medium">Kies onderwijsniveau</label>
      <select
        className="select select-bordered w-full"
        value={value}
        onChange={(e) => onChange(e.target.value as LevelCluster)}
      >
        {LEVEL_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <p className="text-sm text-muted-foreground">
        De bron wordt automatisch bepaald op basis van het gekozen niveau en kan niet worden overschreven.
      </p>
    </div>
  );
}
