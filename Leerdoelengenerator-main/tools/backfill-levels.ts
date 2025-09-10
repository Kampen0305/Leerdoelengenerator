import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { glob } from "glob";
import { normalizeLevel, resolveLevelStrict, type Level } from "../src/utils/levels";

type AnyRec = Record<string, any>;

// Pas deze paden/globs aan naar jouw repo:
const JSON_GLOBS = ["content/**/*.json"];
const MD_GLOBS   = ["content/**/*.{md,mdx}"];

async function fixJson(file: string) {
  const raw = await fs.readFile(file, "utf8");
  let data: AnyRec;
  try { data = JSON.parse(raw); } catch { return; }

  const before = data.niveau ?? data.level ?? null;
  let canon: Level | null = normalizeLevel(before);

  if (!canon) {
    try {
      canon = resolveLevelStrict({
        raw: before,
        opleidingstype: data.opleidingstype ?? data.educationType ?? null,
        kdCode: data.kwalificatiedossier ?? data.kdCode ?? null,
      });
    } catch (e) {
      console.error(`❌ ${file}: ${String(e)}`);
      return; // sla over; handmatige check
    }
  }

  data.niveau = canon; // schrijf naar ‘niveau’ als single source
  // optioneel: verwijder oude keys
  delete data.level;

  await fs.writeFile(file, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`✅ fixed: ${file} → niveau=${canon}`);
}

async function fixMd(file: string) {
  const raw = await fs.readFile(file, "utf8");
  const fm = matter(raw);
  const d = fm.data as AnyRec;

  const before = d.niveau ?? d.level ?? null;
  let canon: Level | null = normalizeLevel(before);

  if (!canon) {
    try {
      canon = resolveLevelStrict({
        raw: before,
        opleidingstype: d.opleidingstype ?? d.educationType ?? null,
        kdCode: d.kwalificatiedossier ?? d.kdCode ?? null,
      });
    } catch (e) {
      console.error(`❌ ${file}: ${String(e)}`);
      return; // handmatige check
    }
  }

  d.niveau = canon;
  delete d.level;

  const out = matter.stringify(fm.content, d);
  await fs.writeFile(file, out, "utf8");
  console.log(`✅ fixed: ${file} → niveau=${canon}`);
}

async function run() {
  const jsonFiles = await glob(JSON_GLOBS, { ignore: ["**/node_modules/**"] });
  const mdFiles   = await glob(MD_GLOBS,   { ignore: ["**/node_modules/**"] });

  await Promise.all(jsonFiles.map(fixJson));
  await Promise.all(mdFiles.map(fixMd));

  console.log("🏁 backfill klaar.");
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
