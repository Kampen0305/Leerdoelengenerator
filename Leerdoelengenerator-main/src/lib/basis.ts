export enum LevelCluster {
  FUNDEREND = "funderend", // PO, SO, VSO (incl. VO-onderbouw indien aanwezig)
  MBO = "mbo",
  HBO = "hbo",
  WO = "wo",
}

export enum BasisType {
  KER = "kerndoelen_slo_2025",
  NPL = "npuls_toetsing_2025",
}

export const LEVEL_TO_BASIS: Record<LevelCluster, BasisType> = {
  [LevelCluster.FUNDEREND]: BasisType.KER,
  [LevelCluster.MBO]: BasisType.NPL,
  [LevelCluster.HBO]: BasisType.NPL,
  [LevelCluster.WO]: BasisType.NPL,
};

// Strings die 1-op-1 in UI en documenten komen (NIET aanpassen zonder PO):
export const BASIS_LABEL: Record<BasisType, string> = {
  [BasisType.KER]: "Deze leerdoelen zijn gebaseerd op de kerndoelen (SLO, 2025).",
  [BasisType.NPL]: "Deze leerdoelen zijn gebaseerd op de visie en handreikingen van Npuls (2025).",
};

// Korte code-constanten voor prompts
export const BASIS_PROMPT_TAG: Record<BasisType, string> = {
  [BasisType.KER]: "BASIS: SLO kerndoelen 2025 (funderend onderwijs: PO/SO/VSO).",
  [BasisType.NPL]: "BASIS: Npuls visie + handreikingen 2025 (mbo/hbo/wo).",
};

export function resolveBasis(level: LevelCluster): BasisType {
  return LEVEL_TO_BASIS[level];
}
