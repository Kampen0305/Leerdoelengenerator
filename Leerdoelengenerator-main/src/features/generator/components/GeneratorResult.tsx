import { OutputHeader } from "./OutputHeader";

export function GeneratorResult({ basisLabel, content }: { basisLabel: string; content: string }) {
  return (
    <div className="space-y-4">
      <OutputHeader basisLabel={basisLabel} />
      <div>{content}</div>
    </div>
  );
}
