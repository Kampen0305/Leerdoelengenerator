import { z } from 'zod';

export const geminiResponseSchema = z.object({
  newObjective: z.string().min(1),
  rationale: z.string().min(1),
  activities: z.array(z.string()).min(1),
  assessments: z.array(z.string()).default([])
});

export type GeminiResponse = z.infer<typeof geminiResponseSchema>;
