import fs from 'node:fs';
import path from 'node:path';
import type { Kerndoel } from './types';

export function loadKerndoelen(file: string): Kerndoel[] {
  const filePath = path.resolve(process.cwd(), 'data/standards', file);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as Kerndoel[];
}
