import { LEVEL_DISPLAY, BLOOM_BY_LEVEL, SHOW_BLOOM } from '@/constants/levels';
import type { EducationLevel } from '@/types/education';

type Props = {
  level: EducationLevel;           // UIT result.meta.level
  degree?: 'Associate degree' | 'Bachelor' | 'Master'; // alleen tonen bij HBO/WO indien aanwezig
  className?: string;
};

export function GoalItemHeader({ level, degree, className }: Props) {
  const label = LEVEL_DISPLAY[level];
  const showBloom = SHOW_BLOOM[level];
  const blooms = BLOOM_BY_LEVEL[level];

  const degreeSuffix =
    (level === 'HBO' || level === 'WO') && degree ? ` – ${degree}` : '';

  return (
    <div className={className ?? 'flex flex-wrap items-center gap-2 text-sm'}>
      <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-1 font-semibold">
        {label}{degreeSuffix}
      </span>
      {showBloom && (
        <span className="text-neutral-500">
          Bloom: {blooms.join(' • ')}
        </span>
      )}
    </div>
  );
}

export default GoalItemHeader;
