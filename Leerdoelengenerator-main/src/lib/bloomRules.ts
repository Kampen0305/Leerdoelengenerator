import type { BloomLevel } from "@/types/learningGoals";

export const BLOOM_RULES: Array<{ level: BloomLevel; verbs: RegExp[] }> = [
  { level: "remember", verbs: [/noem(en)?/i, /opsommen?/i, /definieer/i, /herken/i] },
  { level: "understand", verbs: [/leg uit/i, /beschrijf/i, /interpreteer/i, /samenvat/i] },
  { level: "apply", verbs: [/pas toe/i, /toepassen?/i, /schrijf/i, /configureer/i, /voer uit/i] },
  { level: "analyze", verbs: [/analyseer/i, /vergelijk/i, /onderbouw/i, /ontleed/i] },
  { level: "evaluate", verbs: [/beoordeel/i, /evalueer/i, /kritiseer/i, /weeg af/i, /verdedig/i] },
  { level: "create", verbs: [/ontwerp/i, /creëer/i, /produceer/i, /ontwikkel/i, /formuleer/i] },
];

