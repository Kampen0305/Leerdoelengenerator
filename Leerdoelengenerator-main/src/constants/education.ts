export const EDUCATION_TYPES = [
  "PO",
  "SO",
  "VO",
  "VSO",
  "MBO",
  "HBO",
  "WO",
] as const;
export type Education = typeof EDUCATION_TYPES[number];

export const LEVEL_OPTIONS: Partial<Record<Education, string[]>> = {
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

export const VSO_CLUSTERS = [
  "Cluster 1: blinde en slechtziende kinderen",
  "Cluster 2: dove en slechthorende kinderen en kinderen met een taal/spraakprobleem",
  "Cluster 3: motorisch gehandicapte, verstandelijk gehandicapte en langdurig zieke kinderen",
  "Cluster 4: kinderen met psychische stoornissen en gedragsproblemen",
] as const;
export type VSOCluster = typeof VSO_CLUSTERS[number];
