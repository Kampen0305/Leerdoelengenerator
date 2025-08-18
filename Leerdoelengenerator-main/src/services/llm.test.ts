import { describe, it, expect } from 'vitest';
import * as llm from './llm';

const { tryFixJson } = llm as any;

describe('tryFixJson', () => {
  it('laat geldige JSON ongewijzigd', () => {
    const json = '{"a":1}';
    expect(tryFixJson(json)).toBe(json);
  });

  it('herstelt eenvoudige JSON-fouten', () => {
    const broken = '```json\n{"a":1,}\n```';
    const fixed = tryFixJson(broken);
    expect(fixed).toBe('{"a":1}');
    expect(fixed).not.toContain('`');
  });

  it('geeft null terug bij onherstelbare JSON', () => {
    expect(tryFixJson('not json')).toBeNull();
  });
});
