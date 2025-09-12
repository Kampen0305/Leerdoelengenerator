import { expect, test } from 'vitest';
import { getAllVoorbeeldcases, getSectorCounts } from './index';

test('examples bundle contains all sectors', () => {
  const all = getAllVoorbeeldcases();
  expect(all.length).toBeGreaterThanOrEqual(10); // 3 (mbo/hbo) + 7 (nieuw)
  const counts = getSectorCounts();
  ['PO','SO','VO','VSO','MBO','HBO','WO'].forEach(s => {
    expect(counts[s] ?? 0).toBeGreaterThanOrEqual(s==='MBO' || s==='HBO' ? 1 : 0);
  });

  const order = ['WO','HBO','MBO','VO','VSO','PO','SO'];
  const sectors = all.map(c => c.sector);
  const sorted = [...sectors].sort((a, b) => order.indexOf(a) - order.indexOf(b));
  expect(sectors).toEqual(sorted);
});
