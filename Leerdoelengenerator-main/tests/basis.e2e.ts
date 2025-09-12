import { test, expect } from "@playwright/test";
import { LevelCluster } from "@/lib/basis";
import { generateObjectives } from "@/server/api/generateObjectives";

const cases = [
  {
    level: LevelCluster.FUNDEREND,
    expected: "Deze leerdoelen zijn gebaseerd op de kerndoelen (SLO, 2025).",
  },
  {
    level: LevelCluster.MBO,
    expected: "Deze leerdoelen zijn gebaseerd op de visie en handreikingen van Npuls (2025).",
  },
  {
    level: LevelCluster.HBO,
    expected: "Deze leerdoelen zijn gebaseerd op de visie en handreikingen van Npuls (2025).",
  },
  {
    level: LevelCluster.WO,
    expected: "Deze leerdoelen zijn gebaseerd op de visie en handreikingen van Npuls (2025).",
  },
];

test.describe("basis label visibility", () => {
  for (const { level, expected } of cases) {
    test(`level ${level} -> label`, async () => {
      const res = await generateObjectives({ level });
      expect(res.basisLabel).toBe(expected);
    });
  }
});
