export type BloomLevel =
  | "remember"
  | "understand"
  | "apply"
  | "analyze"
  | "evaluate"
  | "create";

export type Lane = "baan1" | "baan2";

export interface AiReadyGoalRequest {
  rawGoal: string; // door gebruiker ingevoerd leerdoel
  context?: string; // opleiding/niveau/sector (optioneel)
  domain?: string; // bijv. Zorg, ICT (optioneel)
  timeframeDays?: number; // standaard 10
  minWords?: number; // default 300 bij schrijfproducten, anders 0
}

export interface AiReadyGoalResponse {
  bloom: BloomLevel;
  lane: Lane;
  aiReadyGoal: string; // geherformuleerd leerdoel
  aiStatement: string; // verantwoording AI-gebruik
  rubricCriteria: string[]; // beoordelingscriteria in bullets
  warnings: string[]; // verbeterpunten (indien relevant)
  trace: {
    verb: string;
    matchedRules: string[]; // welke regels/templates gebruikt
    usedLLM?: boolean; // true als LLM-fallback gebruikt is
  };
}

