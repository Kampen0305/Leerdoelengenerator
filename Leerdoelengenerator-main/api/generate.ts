import { objectiveSchema } from '../src/lib/validation';
import { llmService } from '../src/services/llm';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  const body = req.body || {};
  if (body.education !== 'VO') {
    delete body.voLevel;
    delete body.voGrade;
  }
  const parsed = objectiveSchema.safeParse(body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    return;
  }
  try {
    const result = await llmService.generateNormalizedObjective(parsed.data as any);
    res.status(200).json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
