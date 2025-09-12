import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import Ajv from 'ajv';
import schema from '../../src/lib/standards/validators/slo.schema.json';

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema as any);

function load(file: string) {
  const p = join(process.cwd(), 'data/standards/slo_2025', file);
  return JSON.parse(readFileSync(p, 'utf8'));
}

describe('SLO kerndoel datasets', () => {
  for (const file of ['bg_funderend.v1.json', 'dg_funderend.v1.json']) {
    it(`validates ${file}`, () => {
      const data = load(file);
      const valid = validate(data);
      if (!valid) {
        console.error(validate.errors);
      }
      expect(valid).toBe(true);
    });
  }
});
