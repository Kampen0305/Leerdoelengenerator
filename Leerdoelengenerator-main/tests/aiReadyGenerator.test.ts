import { describe, expect, test } from "vitest";
import { generateAiReadyGoal } from "@/lib/aiReadyGenerator";

describe("generateAiReadyGoal", () => {
  test("betoog → apply/analyze → baan2", async () => {
    const res = await generateAiReadyGoal({
      rawGoal: "De student kan een betoog schrijven.",
      timeframeDays: 7,
      domain: "Zorg",
      minWords: 500,
    });
    expect(res.lane).toBe("baan2");
    expect(res.aiReadyGoal.toLowerCase()).toContain(
      "met ondersteuning van ai"
    );
    expect(res.rubricCriteria.join(" ")).toMatch(/kritisch/i);
  });

  test("benoemen → remember → baan1", async () => {
    const res = await generateAiReadyGoal({
      rawGoal: "De student kan de vijf basisbegrippen van X benoemen.",
      timeframeDays: 3,
    });
    expect(res.lane).toBe("baan1");
    expect(res.aiReadyGoal.toLowerCase()).toContain("zonder inzet van ai");
  });
});

