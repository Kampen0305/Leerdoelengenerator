import { validateObjective } from "../utils/objectiveValidator";

test("VO-vmbo-bbkb objective valid", () => {
  const obj = "Voert een eenvoudige meting uit in het practicumlokaal, met standaardinstrumenten, conform het stappenplan, onder begeleiding.";
  const res = validateObjective(obj, "VO-vmbo-bbkb");
  expect(res.ok).toBe(true);
});

test("VO-havo objective valid", () => {
  const obj = "Analyseert de betrouwbaarheid van twee nieuwsbronnen in een actuele context, op basis van vastgestelde criteria, met enige zelfstandigheid.";
  const res = validateObjective(obj, "VO-havo");
  expect(res.ok).toBe(true);
});

test("MBO-2 objective valid", () => {
  const obj = "Voert een basisonderhoudsbeurt uit in de werkplaats, met standaardgereedschap, volgens checklist, onder begeleiding.";
  const res = validateObjective(obj, "MBO-2");
  expect(res.ok).toBe(true);
});

test("MBO-4 objective valid", () => {
  const obj = "Ontwerpt en plant een klein verbeterproject op de werkvloer, op basis van data-analyse, conform kwaliteitsrichtlijnen, en verantwoordt keuzes in een kort verslag, zelfstandig.";
  const res = validateObjective(obj, "MBO-4");
  expect(res.ok).toBe(true);
});

test("HBO-AD objective valid", () => {
  const obj = "Implementeert een basisdashboard in een teamomgeving, op basis van requirements, volgens huisstijlrichtlijnen, en verantwoordt keuzes beknopt, met toenemende zelfstandigheid.";
  const res = validateObjective(obj, "HBO-AD");
  expect(res.ok).toBe(true);
});

test("HBO-Bachelor objective valid", () => {
  const obj = "Ontwerpt en valideert in co-creatie met stakeholders een low-fidelity prototype voor een studentportaal, gebaseerd op drie gebruikersinterviews, volgens heuristieken van Nielsen, en verantwoordt ontwerpkeuzes in een reflectieverslag, zelfstandig.";
  const res = validateObjective(obj, "HBO-Bachelor");
  expect(res.ok).toBe(true);
});

test("WO-Bachelor objective valid", () => {
  const obj = "Analyseert in een seminar een wetenschappelijk artikel met behulp van een beoordelingskader, en verantwoordt bevindingen met correcte bronvermelding, zelfstandig.";
  const res = validateObjective(obj, "WO-Bachelor");
  expect(res.ok).toBe(true);
});

test("WO-Master objective valid", () => {
  const obj = "Ontwerpt en evalueert in een onderzoekssetting een experimentele opzet om hypothesen te toetsen, conform open-science principes, met volledige methodologische verantwoording, zelfstandig.";
  const res = validateObjective(obj, "WO-Master");
  expect(res.ok).toBe(true);
});
