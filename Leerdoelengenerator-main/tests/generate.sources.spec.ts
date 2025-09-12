import { getSourcesForLevel } from '@/config/sources';

test('PO -> Funderend bronnen', () => {
  const docs = getSourcesForLevel('PO').map(d => d.id);
  expect(docs).toContain('kerndoelen-po-so');
  expect(docs).toContain('ai-go');
});

test('MBO -> Npuls bronnen aanwezig', () => {
  const docs = getSourcesForLevel('MBO').map(d => d.id);
  expect(docs).toContain('npuls-handreiking-1');
  expect(docs).toContain('npuls-visie-toetsing');
});
