import { useState } from 'react';
import { loadKerndoelen } from '../../lib/standards';
import type { Kerndoel, Leergebied } from '../../lib/standards/types';

export function useKerndoelen(file: string, leergebied?: Leergebied) {
  const [kerndoelen] = useState<Kerndoel[]>(() => loadKerndoelen(file));
  const list = leergebied
    ? kerndoelen.filter((k) => k.leergebied === leergebied)
    : kerndoelen;
  return { kerndoelen: list };
}
