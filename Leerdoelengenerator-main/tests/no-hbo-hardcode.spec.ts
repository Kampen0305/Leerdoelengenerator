import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '..');

const BAD_STRINGS = [
  'HBO – Bachelor Bloom: analyze • evaluate • create',
  'HBO — Bachelor Bloom: analyze • evaluate • create',
  'HBO – Bachelor',
  'HBO — Bachelor',
];

function walk(dir: string, acc: string[] = []) {
  for (const entry of fs.readdirSync(dir)) {
    const p = path.join(dir, entry);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) walk(p, acc);
    else if (/\.(ts|tsx|js|jsx|mdx|html|css)$/.test(entry)) acc.push(p);
  }
  return acc;
}

describe('No hardcoded HBO badge strings remain', () => {
  const files = walk(path.join(ROOT, 'src'));
  test('repo has no forbidden hardcoded HBO labels', () => {
    const offenders: string[] = [];
    for (const file of files) {
      const txt = fs.readFileSync(file, 'utf8');
      if (BAD_STRINGS.some(s => txt.includes(s))) offenders.push(file);
    }
    if (offenders.length) {
      throw new Error(`Hardcoded HBO labels found in:\n- ${offenders.join('\n- ')}`);
    }
  });
});

