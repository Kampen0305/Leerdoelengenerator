import { useState } from 'react';
import type { FlowState, Sector } from '../../lib/standards/types';

export function useSector(initial: FlowState = { sector: null }) {
  const [state, setState] = useState<FlowState>(initial);
  const setSector = (sector: Sector) => setState((s) => ({ ...s, sector }));
  const setVoSublevel = (voSublevel: 'onderbouw' | 'bovenbouw') =>
    setState((s) => ({ ...s, voSublevel }));
  return { ...state, setSector, setVoSublevel };
}
