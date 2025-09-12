import { useState } from 'react';
import type { FunderendFlowState, Sector } from '../../lib/standards/types';

export function useSector(
  initial: FunderendFlowState = { sector: 'MBO', voSublevel: 'onderbouw' }
) {
  const [state, setState] = useState<FunderendFlowState>(initial);
  const setSector = (sector: Sector) => setState((s) => ({ ...s, sector }));
  const setVoSublevel = (voSublevel: 'onderbouw' | 'bovenbouw') =>
    setState((s) => ({ ...s, voSublevel }));
  return { ...state, setSector, setVoSublevel };
}
