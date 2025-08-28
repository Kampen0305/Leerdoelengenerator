export type GoalOrientation = 'kennis' | 'vaardigheid' | 'attitude';
export type EducationLevel =
  | 'VO-vmbo'
  | 'VO-havo'
  | 'VO-vwo'
  | 'VSO-vervolg'
  | 'VSO-arbeidsmarkt'
  | 'VSO-dagbesteding'
  | 'MBO-1'
  | 'MBO-2'
  | 'MBO-3'
  | 'MBO-4'
  | 'HBO-ba'
  | 'HBO-ma'
  | 'WO-ba'
  | 'WO-ma';

export interface ActivitySuggestion {
  title: string;
  description: string;
  duration?: string; // bijv. "45 min"
  why: string; // korte rationale
}

export interface AssessmentSuggestion {
  title: string;
  description: string;
  formative?: boolean;
  summative?: boolean;
  why: string;
}

export interface SuggestionBundle {
  activities: ActivitySuggestion[];
  assessments: AssessmentSuggestion[];
}

