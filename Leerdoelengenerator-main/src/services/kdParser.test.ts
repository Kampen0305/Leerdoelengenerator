import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { parseKdText } from './kdParser';

const fixture = readFileSync('fixtures/kd_sample_text.txt', 'utf-8');

describe('parseKdText', () => {
  const result = parseKdText(fixture);
  it('parses core task and work process', () => {
    expect(result.coreTasks.length).toBe(1);
    expect(result.coreTasks[0].workProcesses.length).toBe(1);
  });

  it('parses criteria with bullet list', () => {
    const wp = result.coreTasks[0].workProcesses[0];
    expect(wp.criteria.length).toBe(3);
    expect(wp.criteria.map((c) => c.type)).toEqual([
      'result',
      'quality',
      'behavior',
    ]);
  });
});
