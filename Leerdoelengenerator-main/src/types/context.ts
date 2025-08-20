import type { Education, VoLevel } from '../constants/education';
export type { Education, VoLevel };

export interface LearningObjectiveContext {
  original: string;
  education: Education;
  level: string; // unchanged for MBO/HBO/WO/VSO
  domain: string;
  assessment?: string;
  lane?: 'baan1' | 'baan2';
  voLevel?: VoLevel; // required when education === 'VO'
  voGrade?: number;  // required when education === 'VO'
}
