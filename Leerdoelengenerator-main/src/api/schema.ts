import { z } from 'zod';

export const GeneratePayload = z.object({
  level: z.enum(['PO','SO','VSO','MBO','HBO','WO']),
  topic: z.string().min(2),
  // overige velden…
});

export type GeneratePayload = z.infer<typeof GeneratePayload>;
