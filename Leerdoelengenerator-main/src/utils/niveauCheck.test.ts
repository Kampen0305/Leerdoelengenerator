import { describe, it, expect } from 'vitest';
import { checkLevelFit } from './niveauCheck';

describe('checkLevelFit', () => {
  it('vmbo-basis analyseert -> te_hoog and verb tip', () => {
    const res = checkLevelFit('Analyseert de oorzaken van klimaatverandering.', 'VO:vmbo-basis');
    expect(res.fit).toBe('te_hoog');
    expect(res.messages[0]).toBe("Begin met een passend, meetbaar werkwoord voor dit niveau (bv. 'noemt').");
  });

  it('havo past toe with norm and autonomy >35 words -> length tip only', () => {
    const obj = 'Past toe de geleerde rekenstrategieën bij drie verschillende complexe vraagstukken in de les, volgens de rubric voor nauwkeurigheid en volledigheid van het examen, volledig zelfstandig en binnen de door de docent gestelde tijd van 15 minuten.';
    const res = checkLevelFit(obj, 'VO:havo');
    expect(res.fit).toBe('passend');
    expect(res.messages).toEqual(['Leerdoel is te lang; formuleer compacter.']);
  });

  it('vwo evaluate and create -> bloom label', () => {
    const obj = 'Evalueert en ontwerpt een onderzoeksopzet volgens rubric, binnen 2 weken zelfstandig.';
    const res = checkLevelFit(obj, 'VO:vwo');
    expect(res.fit).toBe('passend');
    expect(res.bloomLabelNl).toBe('Niveau volgens Bloom: Evalueren en Creëren');
  });

  it('VSO arbeidsmarktgericht zonder norm -> measurability tip', () => {
    const obj = 'Gebruikt gereedschap volgens veiligheidsinstructies onder begeleiding.';
    const res = checkLevelFit(obj, 'VSO:arbeidsmarktgericht');
    expect(res.messages).toContain('Maak het doel meetbaar (hoeveel/hoe goed/wanneer).');
  });

  it('MBO-2 analyseert -> te_hoog', () => {
    const res = checkLevelFit('Analyseert markttrends.', 'MBO:2');
    expect(res.fit).toBe('te_hoog');
  });

  it('WO Master creëert -> passend', () => {
    const res = checkLevelFit('Creëert een nieuw model volgens rubric binnen 10 weken zelfstandig.', 'WO:Master');
    expect(res.fit).toBe('passend');
  });

  it('heuristic detection works with empty bloom input', () => {
    const res = checkLevelFit('Analyseert gegevens zorgvuldig.', 'MBO:3', '');
    expect(res.detectedBlooms).toContain('analyze');
  });
});
