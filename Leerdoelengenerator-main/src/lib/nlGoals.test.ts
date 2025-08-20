import { describe, it, expect } from "vitest";
import { normalizeObjective } from "./nlGoals";

describe("normalizeObjective", () => {
  it("replaces vague verb and adds placeholders", () => {
    expect(normalizeObjective("De student begrijpt AI"))
      .toBe("De student verklaart AI in [situatie] volgens [criterium]");
  });

  it("keeps existing context", () => {
    expect(normalizeObjective("De student kent de theorie in de praktijk"))
      .toBe("De student beschrijft de theorie in de praktijk volgens [criterium]");
  });

  it("keeps existing criterion", () => {
    expect(normalizeObjective("De student weet de regels volgens examen"))
      .toBe("De student beschrijft de regels volgens examen");
  });

  it("detects numeric criterion", () => {
    expect(normalizeObjective("De student leert samenwerken tot 80%"))
      .toBe("De student oefent samenwerken tot 80% in [situatie]");
  });

  it("adds both placeholders when missing", () => {
    expect(normalizeObjective("De student kent Python"))
      .toBe("De student beschrijft Python in [situatie] volgens [criterium]");
  });

  it("works for VO niveau", () => {
    expect(normalizeObjective("De leerling weet de stelling"))
      .toBe("De leerling beschrijft de stelling in [situatie] volgens [criterium]");
  });

  it("works for MBO product", () => {
    expect(normalizeObjective("Student leert een website"))
      .toBe("Student oefent een website in [situatie] volgens [criterium]");
  });

  it("works for HBO proces", () => {
    expect(normalizeObjective("De student begrijpt projectmanagement"))
      .toBe("De student verklaart projectmanagement in [situatie] volgens [criterium]");
  });

  it("works for WO onderzoek", () => {
    expect(normalizeObjective("De onderzoeker kent statistiek"))
      .toBe("De onderzoeker beschrijft statistiek in [situatie] volgens [criterium]");
  });

  it("does not add context twice", () => {
    expect(normalizeObjective("De student kent theorie binnen het lab"))
      .toBe("De student beschrijft theorie binnen het lab volgens [criterium]");
  });

  it("does not add criterion if aanwezig", () => {
    expect(normalizeObjective("De student weet theorie volgens schema"))
      .toBe("De student beschrijft theorie volgens schema");
  });

  it("handles uppercase verbs", () => {
    expect(normalizeObjective("DE STUDENT BEGRIJPT DATA"))
      .toBe("DE STUDENT verklaart DATA in [situatie] volgens [criterium]");
  });

  it("handles extra spaces", () => {
    expect(normalizeObjective("  student weet  feiten  "))
      .toBe("student beschrijft feiten in [situatie] volgens [criterium]");
  });

  it("leaves observable verb untouched", () => {
    expect(normalizeObjective("De student analyseert data"))
      .toBe("De student analyseert data in [situatie] volgens [criterium]");
  });

  it("returns empty string for empty input", () => {
    expect(normalizeObjective(""))
      .toBe("");
  });
});
