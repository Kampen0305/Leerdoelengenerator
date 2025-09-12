import { z } from "zod";
import { LevelCluster } from "@/lib/basis";

export const GenerateInputSchema = z.object({
  level: z.nativeEnum(LevelCluster),
  // ...overige velden (opleiding, doelgroep, thema, etc.)
});
export type GenerateInput = z.infer<typeof GenerateInputSchema>;
