export interface Qualification {
  id: string;
  title: string;
  version: string | null;
  coreTasks: CoreTask[];
}

export interface CoreTask {
  id: string;
  code: string;
  title: string;
  order: number;
  workProcesses: WorkProcess[];
}

export interface WorkProcess {
  id: string;
  code: string;
  title: string;
  order: number;
  criteria: Criterion[];
}

export type CriterionType = 'result' | 'quality' | 'behavior' | 'other';

export interface Criterion {
  id: string;
  type: CriterionType;
  text: string;
  order: number;
}
