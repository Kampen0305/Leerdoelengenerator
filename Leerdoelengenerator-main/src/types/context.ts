export type Education = 'MBO' | 'HBO' | 'WO' | 'VO';
export type VoLevel = 'vmbo-bb' | 'vmbo-kb' | 'vmbo-gl-tl' | 'havo' | 'vwo';

export interface LearningObjectiveContext {
  original: string;
  education: Education;
  level: string; // unchanged for MBO/HBO/WO
  domain: string;
  assessment?: string;
  lane?: 'baan1' | 'baan2';
  voLevel?: VoLevel; // required when education === 'VO'
  voGrade?: number;  // required when education === 'VO'
}
