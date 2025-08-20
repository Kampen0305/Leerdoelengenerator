import { z } from 'zod';
import { EDUCATION_TYPES, LEVEL_OPTIONS, VO_LEVELS } from '../constants/education';

export const objectiveSchema = z
  .object({
    original: z.string().min(1, 'Vul het leerdoel in.'),
    education: z.enum(EDUCATION_TYPES, {
      errorMap: () => ({ message: 'Kies MBO, HBO, WO, VO of VSO.' })
    }),
    level: z.string().optional(),
    domain: z.string().min(1, 'Vul het domein in.'),
    assessment: z.string().min(1, 'Vul de toetsing in.'),
    voLevel: z.enum(VO_LEVELS).optional(),
    voGrade: z.number().int().optional()
  })
  .superRefine((data, ctx) => {
    if (data.education !== 'VO') {
      const allowed = LEVEL_OPTIONS[data.education as keyof typeof LEVEL_OPTIONS];
      if (!data.level || !allowed || !allowed.includes(data.level)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Kies een geldig niveau.',
          path: ['level']
        });
      }
    }
    if (data.education === 'VO') {
      if (!data.voLevel) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Vul het VO-niveau in.',
          path: ['voLevel']
        });
      }
      if (data.voGrade === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Vul het leerjaar in.',
          path: ['voGrade']
        });
      } else {
        const max = { 'vmbo-bb': 4, 'vmbo-kb': 4, 'vmbo-gl-tl': 4, havo: 5, vwo: 6 }[data.voLevel!];
        if (data.voGrade < 1 || data.voGrade > max) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Leerjaar moet tussen 1 en ${max} liggen.`,
            path: ['voGrade']
          });
        }
      }
    }
  });

export type ObjectiveInput = z.infer<typeof objectiveSchema>;
