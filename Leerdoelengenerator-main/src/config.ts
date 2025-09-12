import { FEATURE_SLO_KERNDOELEN_FUNDEREND } from '@/lib/config/flags';

export const feature = {
  aiReadyGoalsV2: import.meta.env.VITE_FEATURE_AI_READY_GOALS_V2 === "true",
  sloFunderend: FEATURE_SLO_KERNDOELEN_FUNDEREND,
};

