import type { Education, VoLevel, VSOCluster } from '../constants/education';
export type { Education, VoLevel, VSOCluster };

export interface LearningObjectiveContext {
  original: string;
  education: Education;
  level: string; // unchanged for MBO/HBO/WO/VSO
  domain: string;
  assessment?: string;
  lane?: 'baan1' | 'baan2';
  voLevel?: VoLevel; // required when education === 'VO'
  voGrade?: number;  // required when education === 'VO'
  vsoCluster?: VSOCluster; // required when education === 'VSO'
}
