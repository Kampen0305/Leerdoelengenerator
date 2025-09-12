import type { Sector } from '@/lib/standards/types';

export function isFunderend(sector: Sector | null): boolean {
  return ['PO', 'SO', 'VO', 'VSO'].includes(sector ?? '');
}
