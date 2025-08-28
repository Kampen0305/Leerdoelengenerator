import type { GoalOrientation, EducationLevel } from '@/types/learning';
import type { LearningObjectiveContext } from '@/types/context';

export function inferGoalOrientation(text: string): GoalOrientation {
  const t = text.toLowerCase();
  if (/(reflect|houding|attitude|samenwerk|feedback|verantwoordelijkheid)/.test(t)) {
    return 'attitude';
  }
  if (/(toepassen|vaardig|vaardigheid|simulatie|oefen|uitvoer|demonstratie)/.test(t)) {
    return 'vaardigheid';
  }
  return 'kennis';
}

export function mapEducationLevel(ctx: LearningObjectiveContext): EducationLevel {
  switch (ctx.education) {
    case 'VO':
      if (ctx.voLevel === 'havo') return 'VO-havo';
      if (ctx.voLevel === 'vwo') return 'VO-vwo';
      return 'VO-vmbo';
    case 'MBO':
      if (ctx.level.includes('1')) return 'MBO-1';
      if (ctx.level.includes('2')) return 'MBO-2';
      if (ctx.level.includes('3')) return 'MBO-3';
      return 'MBO-4';
    case 'HBO':
      return ctx.level === 'Master' ? 'HBO-ma' : 'HBO-ba';
    case 'WO':
      return ctx.level === 'Master' ? 'WO-ma' : 'WO-ba';
    case 'VSO':
      if (ctx.level.includes('Vervolg')) return 'VSO-vervolg';
      if (ctx.level.includes('Dagbested')) return 'VSO-dagbesteding';
      return 'VSO-arbeidsmarkt';
    default:
      return 'HBO-ba';
  }
}

