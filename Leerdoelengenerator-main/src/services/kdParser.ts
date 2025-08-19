import { randomUUID } from 'crypto';
import type { Qualification, CoreTask, WorkProcess, Criterion, CriterionType } from '../types/qualification';

// Simple text-based parser for qualification dossiers.
// Expects already extracted plain text.
export function parseKdText(text: string): Qualification {
  const lines = text.split(/\r?\n/).map((l) => l.trim());
  const titleLine = lines.shift() || '';
  const versionMatch = titleLine.match(/(20\d{2})/);
  const qualification: Qualification = {
    id: randomUUID(),
    title: titleLine.replace(/\s*20\d{2}.*/, '').trim() || 'Onbekend',
    version: versionMatch ? versionMatch[1] : null,
    coreTasks: [],
  };

  let currentCore: CoreTask | null = null;
  let currentWp: WorkProcess | null = null;
  let currentType: CriterionType | null = null;

  lines.forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) return;

    const ctMatch = line.match(/^Kerntaak\s+(\d+)(?:\s+(.*))?/i);
    if (ctMatch) {
      currentCore = {
        id: randomUUID(),
        code: `Kerntaak ${ctMatch[1]}`,
        title: ctMatch[2] ? ctMatch[2].trim() : '',
        order: qualification.coreTasks.length + 1,
        workProcesses: [],
      };
      qualification.coreTasks.push(currentCore);
      currentWp = null;
      currentType = null;
      return;
    }

    const wpMatch = line.match(/^Werkproces\s+(\d+\.\d+)(?:\s+(.*))?/i);
    if (wpMatch && currentCore) {
      currentWp = {
        id: randomUUID(),
        code: wpMatch[1],
        title: wpMatch[2] ? wpMatch[2].trim() : '',
        order: currentCore.workProcesses.length + 1,
        criteria: [],
      };
      currentCore.workProcesses.push(currentWp);
      currentType = null;
      return;
    }

    const header = line.toLowerCase();
    if (header.startsWith('resultaat')) {
      currentType = 'result';
      return;
    }
    if (header.startsWith('kwaliteits')) {
      currentType = 'quality';
      return;
    }
    if (header.startsWith('gedrags')) {
      currentType = 'behavior';
      return;
    }

    if (/^[\-\u2022]/.test(line) && currentWp && currentType) {
      const text = line.replace(/^[-\u2022]\s*/, '');
      const crit: Criterion = {
        id: randomUUID(),
        type: currentType,
        text,
        order: currentWp.criteria.length + 1,
      };
      currentWp.criteria.push(crit);
    }
  });

  return qualification;
}
