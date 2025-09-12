import { LEVEL_DISPLAY, SHOW_BLOOM } from '@/constants/levels';

test('PO toont GEEN HBO en GEEN Bloom-label', () => {
  expect(LEVEL_DISPLAY['PO']).toBe('PO');
  expect(SHOW_BLOOM['PO']).toBe(false);
});

test('HBO toont Bloom in NL', () => {
  expect(SHOW_BLOOM['HBO']).toBe(true);
  // verdere render-test indien je testing-library gebruikt
});
