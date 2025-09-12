import type { TosSupport } from '../../lib/standards/types';
import { track } from '../../services/telemetry';

export function applyTosSupports<T extends { text: string }>(input: T, tos: TosSupport): T {
  let text = input.text;
  track('tos_option_changed', { hash: JSON.stringify(tos) });
  if (tos.taalvereenvoudiging !== 'uit') {
    // placeholder for simplification logic
    text = text.replace(/\w{10,}/g, (w) => w.slice(0, 10));
  }
  return { ...input, text };
}
