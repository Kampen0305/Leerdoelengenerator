import { formatBadgeLine, getNiveauBadge } from './niveau';

describe('Niveau-badge', () => {
  test('PO toont nooit Bloom en nooit HBO-tekst', () => {
    const cfg = getNiveauBadge('PO');
    expect(cfg.showBloom).toBe(false);
    expect(cfg.title).toMatch(/^PO — Kerndoelen/);
    expect(cfg.title).not.toMatch(/HBO/i);
  });

  test('VSO toont nooit Bloom en nooit HBO-tekst', () => {
    const cfg = getNiveauBadge('VSO');
    expect(cfg.showBloom).toBe(false);
    expect(cfg.title).toMatch(/^V\(S\)O — Kerndoelen/);
    expect(cfg.title).not.toMatch(/HBO/i);
  });

  test('VO (onderbouw) toont geen Bloom', () => {
    const cfg = getNiveauBadge('VO');
    expect(cfg.showBloom).toBe(false);
  });

  test('HBO toont Bloom en subtype indien meegegeven', () => {
    const line = formatBadgeLine('HBO', 'Bachelor');
    expect(line).toMatch(/^HBO — Bachelor/);
    expect(line).toMatch(/Bloom: analyze • evaluate • create$/);
  });

  test('MBO/WO tonen Bloom standaard', () => {
    expect(formatBadgeLine('MBO')).toMatch(/Bloom:/);
    expect(formatBadgeLine('WO')).toMatch(/Bloom:/);
  });
});
