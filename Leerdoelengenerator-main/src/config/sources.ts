import { EducationLevel, DomainGroup, LEVEL_TO_GROUP } from '@/types/education';

export type SourceDoc = { id: string; title: string; path: string };
export type SourceSet = { group: DomainGroup; levels?: EducationLevel[]; docs: SourceDoc[] };

export const SOURCES: SourceSet[] = [
  {
    group: 'Funderend',
    docs: [
      { id: 'kerndoelen-po-so', title: 'Kerndoelen PO/SO', path: '/docs/kerndoelen-po-so.pdf' },
      { id: 'kerndoelen-burgerschap-digitaal', title: 'Conceptkerndoelen Burgerschap & Digitale geletterdheid', path: '/docs/kerndoelen-burgerschap-digitaal.pdf' },
      { id: 'ai-go', title: 'AI-GO: Raamwerk AI-geletterdheid', path: '/docs/ai-go.pdf' },
      { id: 'referentiekader-2', title: 'Referentiekader 2.0', path: '/docs/referentiekader-2.pdf' },
    ],
  },
  {
    group: 'MBO_HBO_WO',
    docs: [
      { id: 'npuls-visie-toetsing', title: 'Npuls: Visie op Toetsing & Examinering', path: '/docs/npuls-visie-toetsing.pdf' },
      { id: 'npuls-handreiking-1', title: 'Npuls Handreiking 1', path: '/docs/npuls-handreiking-1.pdf' },
      { id: 'npuls-handreiking-2', title: 'Npuls Handreiking 2', path: '/docs/npuls-handreiking-2.pdf' },
      { id: 'npuls-handreiking-3', title: 'Npuls Handreiking 3', path: '/docs/npuls-handreiking-3.pdf' },
      { id: 'npuls-handreiking-4', title: 'Npuls Handreiking 4', path: '/docs/npuls-handreiking-4.pdf' },
      { id: 'ai-go', title: 'AI-GO: Raamwerk AI-geletterdheid', path: '/docs/ai-go.pdf' },
      { id: 'referentiekader-2', title: 'Referentiekader 2.0', path: '/docs/referentiekader-2.pdf' },
    ],
  },
];

export function getSourcesForLevel(level: EducationLevel): SourceDoc[] {
  const group = LEVEL_TO_GROUP[level];
  const set = SOURCES.find((s) => s.group === group);
  if (!set) throw new Error(`No source set for group ${group}`);
  return set.docs;
}
