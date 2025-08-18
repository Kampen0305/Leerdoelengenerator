export interface KDStructure {
  metadata: {
    title: string;
    code: string;
    level: string;
    sector: string;
    version: string;
    validFrom?: string;
  };
  competencies: Competency[];
  workProcesses: WorkProcess[];
  learningOutcomes: LearningOutcome[];
}

export interface Competency {
  id: string;
  title: string;
  description: string;
  level: string;
  workProcesses: string[];
}

export interface WorkProcess {
  id: string;
  title: string;
  description: string;
  activities: string[];
  competencyIds: string[];
}

export interface LearningOutcome {
  id: string;
  title: string;
  description: string;
  competencyId: string;
  workProcessId: string;
  assessmentCriteria: string[];
  context: string;
}

export interface KDParseResult {
  success: boolean;
  data?: KDStructure;
  error?: string;
  suggestions?: string[];
}