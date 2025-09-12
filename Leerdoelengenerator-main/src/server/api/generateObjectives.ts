import { GenerateInputSchema } from "@/features/generator/schema";
import { resolveBasis, BASIS_LABEL, BASIS_PROMPT_TAG } from "@/lib/basis";
import { buildPrompt } from "@/features/generator/promptTemplates";
import { llmGenerate } from "@/features/generator/llm";

export async function generateObjectives(rawInput: unknown) {
  const input = GenerateInputSchema.parse(rawInput);

  const basis = resolveBasis(input.level);
  // Hard block als client probeert iets anders mee te sturen (toekomstige clients)
  if ((rawInput as any)?.basis && (rawInput as any).basis !== basis) {
    throw new Error(
      "Basisconflict: het gekozen onderwijsniveau vereist een vaste bron. Pas het niveau aan of laat 'basis' leeg."
    );
  }

  const prompt = buildPrompt({ ...input, basisTag: BASIS_PROMPT_TAG[basis] });

  const modelOut = await llmGenerate(prompt);

  return {
    basisLabel: BASIS_LABEL[basis],   // Voor UI/headers/export
    content: modelOut.content,        // Leerdoelen e.d.
    meta: { level: input.level, basis }, // Voor logging/telemetrie
  };
}
