import { useState } from 'react';
import type { Sector } from '../../constants/sector';

export function useSector(initial: Sector = 'MBO') {
  const [sector, setSector] = useState<Sector>(initial);
  return { sector, setSector };
}
