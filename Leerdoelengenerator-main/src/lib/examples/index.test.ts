import { expect, test } from 'vitest';
import { getAllVoorbeeldcases, getSectorCounts } from './index';

test('examples bundle contains all sectors', () => {
  const all = getAllVoorbeeldcases();
  expect(all.length).toBeGreaterThanOrEqual(10); // 3 (mbo/hbo) + 7 (nieuw)
  const counts = getSectorCounts();
  ['PO','SO','VO','VSO','MBO','HBO','WO'].forEach(s => {
    expect(counts[s] ?? 0).toBeGreaterThanOrEqual(s==='MBO' || s==='HBO' ? 1 : 0);
  });
});
