import { GeneratePayload } from '@/api/schema';
import { LEVEL_TO_GROUP, type EducationLevel } from '@/types/education';
import { buildPrompt } from '@/generator/prompt';
import { llmGenerate } from '@/features/generator/llm';

export async function generate(reqBody: unknown) {
  const parsed = GeneratePayload.parse(reqBody);
  const level = parsed.level as EducationLevel;
  const group = LEVEL_TO_GROUP[level];

  // safety net: prompt krijgt level + group ingebakken
  const prompt = buildPrompt({ ...parsed, level, group });

  const result = await llmGenerate(prompt);

  // Validatie: output moet starten met exact het level-label
  // Verwacht: "Niveau: PO" (of SO/VSO/MBO/HBO/WO)
  if (!/^Niveau:\s*(PO|SO|VSO|MBO|HBO|WO)\b/m.test(result.text)) {
    throw new Error('VALIDATION_ERROR: Niveau ontbreekt in output');
  }
  const outLevel = result.text.match(/^Niveau:\s*(PO|SO|VSO|MBO|HBO|WO)\b/m)?.[1];
  if (outLevel !== level) {
    throw new Error(`VALIDATION_ERROR: Niveau mismatch (gekozen ${level}, output ${outLevel})`);
  }
  return result;
}
