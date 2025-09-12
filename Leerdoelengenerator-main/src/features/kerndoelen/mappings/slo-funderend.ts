import type { Kerndoel } from '../../../lib/standards/types';

export interface FunderendOutput {
  kerndoel: Kerndoel;
  didactischeDoelen: string[];
  werkvormen: string[];
}

export function mapKerndoel(kerndoel: Kerndoel): FunderendOutput {
  return {
    kerndoel,
    didactischeDoelen: [],
    werkvormen: [],
  };
}
