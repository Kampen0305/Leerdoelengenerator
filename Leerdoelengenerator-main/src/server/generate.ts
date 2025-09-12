import { GeneratePayload } from '@/api/schema';
import { LEVEL_TO_GROUP } from '@/types/education';
import { buildPrompt } from '@/generator/prompt';
import { llmGenerate } from '@/features/generator/llm';
import { buildGenerationContext } from '@/domain/sources';
import type { OnderwijsSector } from '@/domain/niveau';

export async function generate(reqBody: unknown) {
  const parsed = GeneratePayload.parse(reqBody);
  const sector = parsed.level as OnderwijsSector;
  const group = LEVEL_TO_GROUP[sector];
  const { sources } = buildGenerationContext({ sector });

  // safety net: prompt krijgt level + group ingebakken
  const prompt = buildPrompt({ ...parsed, level: sector, group, sources: sources.map((s) => s.title) });

  const result = await llmGenerate(prompt);

  // Validatie: output moet starten met exact het level-label
  // Verwacht: "Niveau: PO" (of SO/VSO/MBO/HBO/WO)
  if (!/^Niveau:\s*(PO|SO|VSO|MBO|HBO|WO)\b/m.test(result.text)) {
    throw new Error('VALIDATION_ERROR: Niveau ontbreekt in output');
  }
    const outLevel = result.text.match(/^Niveau:\s*(PO|SO|VSO|MBO|HBO|WO)\b/m)?.[1];
    if (outLevel !== sector) {
      throw new Error(`VALIDATION_ERROR: Niveau mismatch (gekozen ${sector}, output ${outLevel})`);
    }
  return result;
}
