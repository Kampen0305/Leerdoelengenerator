import { z } from 'zod';

export const objectiveSchema = z.object({
  original: z.string().min(1, 'Vul het leerdoel in.'),
  sector: z.enum(['mbo', 'hbo', 'wo'], {
    errorMap: () => ({ message: 'Kies mbo, hbo of wo.' })
  }),
  level: z.string().optional(),
  domain: z.string().min(1, 'Vul het domein in.'),
  assessment: z.string().min(1, 'Vul de toetsing in.')
}).superRefine((data, ctx) => {
  if (data.sector === 'mbo') {
    if (!data.level) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Vul het niveau in.',
        path: ['level']
      });
    } else if (!['2', '3', '4'].includes(data.level)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Kies niveau 2, 3 of 4.',
        path: ['level']
      });
    }
  }
});

export type ObjectiveInput = z.infer<typeof objectiveSchema>;
