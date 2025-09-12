import { getSupportModel } from '@/services/supportRouting';

describe('supportRouting', () => {
  test('Funderend => SLO, geen handreikingen', () => {
    const model = getSupportModel('PO');
    expect(model.mode).toBe('FUNDEREND');
    // mag niet crashen; seed heeft minimaal 2+2 items
    // @ts-expect-error discriminated union
    expect(model.slo.length).toBeGreaterThanOrEqual(2);
  });

  test('MBO => Handreikingen, geen SLO', () => {
    const model = getSupportModel('MBO');
    expect(model.mode).toBe('BEROEPS_HO');
    // @ts-expect-error discriminated union
    expect(model.handreikingen.length).toBeGreaterThan(0);
  });

  test('Fallback on unknown => treat as funderend safe', () => {
    const model = getSupportModel('VO');
    expect(model.mode).toBe('FUNDEREND');
  });
});
