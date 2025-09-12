import { OutputHeader } from "@/features/generator/components/OutputHeader";

export function ResultView({ data }: { data: { basisLabel: string; content: string } }) {
  return (
    <div className="space-y-4">
      <OutputHeader basisLabel={data.basisLabel} />
      <article className="prose max-w-none" dangerouslySetInnerHTML={{ __html: data.content }} />
    </div>
  );
}
