import { glob } from "glob";
import fs from "node:fs/promises";

test("alle content heeft een geldig 'niveau'", async () => {
  const files = await glob("content/**/*.{json,md,mdx}", { ignore: ["**/node_modules/**"] });
  const offenders: string[] = [];

  for (const f of files) {
    const raw = await fs.readFile(f, "utf8");
    if (/niveau\s*:\s*$/m.test(raw) || /"niveau"\s*:\s*""/m.test(raw)) offenders.push(f);
    if (/onbekend niveau/i.test(raw)) offenders.push(f);
  }

  expect(offenders).toEqual([]);
});
