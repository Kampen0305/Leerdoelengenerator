import type { VoLevel } from '../types/context';

const GRADE_LIMITS: Record<VoLevel, number> = {
  'vmbo-bb': 4,
  'vmbo-kb': 4,
  'vmbo-gl-tl': 4,
  'havo': 5,
  'vwo': 6,
};

export function getVoGradeOptions(level?: VoLevel): number[] {
  if (!level) return [];
  const max = GRADE_LIMITS[level];
  return Array.from({ length: max }, (_, i) => i + 1);
}

export function isValidVoGrade(level: VoLevel, grade: number): boolean {
  const max = GRADE_LIMITS[level];
  return grade >= 1 && grade <= max;
}
