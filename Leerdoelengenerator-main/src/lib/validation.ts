import { z } from 'zod';

export const objectiveSchema = z.object({
  original: z.string().min(1, 'Vul het leerdoel in.'),
  sector: z.enum(['mbo', 'hbo', 'wo'], {
    errorMap: () => ({ message: 'Kies mbo, hbo of wo.' })
  }),
  level: z.string().min(1, 'Vul het niveau in.'),
  domain: z.string().min(1, 'Vul het domein in.'),
  assessment: z.string().min(1, 'Vul de toetsing in.')
}).refine(
  data => data.sector !== 'mbo' || ['2', '3', '4'].includes(data.level),
  {
    message: 'Kies niveau 2, 3 of 4.',
    path: ['level']
  }
);

export type ObjectiveInput = z.infer<typeof objectiveSchema>;
