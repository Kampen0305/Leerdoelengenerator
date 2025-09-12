import { getSupportModel } from '@/services/supportRouting';

describe('supportRouting', () => {
  it('Funderend => SLO, geen handreikingen', () => {
    const model = getSupportModel('PO');
    expect(model.mode).toBe('FUNDEREND');
    // @ts-expect-error union narrow
    expect(Array.isArray(model.slo)).toBe(true);
    // @ts-expect-error union narrow
    expect(model.slo.length).toBeGreaterThan(0);
  });

  it('MBO => Handreikingen, geen SLO', () => {
    const model = getSupportModel('MBO');
    expect(model.mode).toBe('BEROEPS_HO');
    // @ts-expect-error union narrow
    expect(Array.isArray(model.handreikingen)).toBe(true);
    // @ts-expect-error union narrow
    expect(model.handreikingen.length).toBeGreaterThan(0);
  });
});

