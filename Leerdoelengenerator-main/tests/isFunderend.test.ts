import { describe, expect, it } from 'vitest';
import { isFunderend } from '@/features/sector/utils';

describe('isFunderend', () => {
  it('returns true for funderend sectors', () => {
    ['PO', 'SO', 'VO', 'VSO'].forEach((s) => {
      expect(isFunderend(s)).toBe(true);
    });
  });
  it('returns false for other sectors', () => {
    ['MBO', 'HBO', 'WO'].forEach((s) => {
      expect(isFunderend(s)).toBe(false);
    });
  });
});
