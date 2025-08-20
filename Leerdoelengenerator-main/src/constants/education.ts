export const EDUCATION_TYPES = [
  "MBO",
  "HBO",
  "WO",
  "VO",
  "VSO",
] as const;
export type Education = typeof EDUCATION_TYPES[number];

export const LEVEL_OPTIONS: Record<Exclude<Education, "VO">, string[]> = {
  MBO: ["Niveau 1", "Niveau 2", "Niveau 3", "Niveau 4"],
  HBO: ["Bachelor", "Associate Degree", "Master"],
  WO: ["Bachelor", "Master"],
  VSO: [
    "Arbeidsmarktgerichte route",
    "Vervolgonderwijsroute",
    "Dagbestedingsroute",
  ],
};

export const VO_LEVELS = [
  "vmbo-bb",
  "vmbo-kb",
  "vmbo-gl-tl",
  "havo",
  "vwo",
] as const;
export type VoLevel = typeof VO_LEVELS[number];
