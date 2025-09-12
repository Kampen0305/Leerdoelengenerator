import type { TosSupport } from '../../lib/standards/types';

export function applyTosSupports<T extends { text: string }>(input: T, tos: TosSupport): T {
  let text = input.text;
  if (tos.taalvereenvoudiging !== 'uit') {
    // placeholder for simplification logic
    text = text.replace(/\w{10,}/g, (w) => w.slice(0, 10));
  }
  return { ...input, text };
}
