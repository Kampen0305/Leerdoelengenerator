export function OutputHeader({ basisLabel }: { basisLabel: string }) {
  return (
    <div className="rounded-xl border p-4 bg-muted/40">
      <div className="text-sm italic">{basisLabel}</div>
    </div>
  );
}
