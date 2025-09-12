import { getSourcesForSector } from './sources';

describe('Bronselectie per sector', () => {
  test.each(['PO', 'SO', 'VSO', 'VO'] as const)('%s -> SLO-kerndoelen', (sector) => {
    const docs = getSourcesForSector(sector);
    expect(docs).toHaveLength(1);
    expect(docs[0].source).toBe('SLO');
    expect(docs[0].title).toMatch(/kerndoelen/i);
  });

  test.each(['MBO', 'HBO', 'WO'] as const)('%s -> Npuls-set', (sector) => {
    const docs = getSourcesForSector(sector);
    const titles = docs.map(d => d.title).join(' | ');
    expect(docs).toHaveLength(3);
    expect(titles).toMatch(/AI-GO/i);
    expect(titles).toMatch(/Toetsing .* AI/i);
    expect(titles).toMatch(/Referentiekader 2.0/i);
  });
});
