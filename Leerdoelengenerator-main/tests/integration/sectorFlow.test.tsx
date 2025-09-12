/* @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';

function renderApp() {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const root = createRoot(div);
  root.render(<App />);
  return { div, root };
}

describe('sector flow', () => {
  it('hides fields until sector chosen and handles funderend', () => {
    const { div, root } = renderApp();
    expect(div.querySelector('input[name="lane"]')).toBeNull();
    const poBtn = Array.from(div.querySelectorAll('button')).find(b => b.textContent === 'PO') as HTMLButtonElement;
    poBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(div.querySelector('input[name="lane"]')).not.toBeNull();
    const niveauLabel = Array.from(div.querySelectorAll('label')).find(l => l.textContent?.includes('Niveau *'));
    expect(niveauLabel).toBeUndefined();
    root.unmount();
  });

  it('shows niveau for HBO', () => {
    const { div, root } = renderApp();
    const hboBtn = Array.from(div.querySelectorAll('button')).find(b => b.textContent === 'HBO') as HTMLButtonElement;
    hboBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(div.querySelector('input[name="lane"]')).not.toBeNull();
    const niveauLabel = Array.from(div.querySelectorAll('label')).find(l => l.textContent?.includes('Niveau *'));
    expect(niveauLabel).toBeDefined();
    root.unmount();
  });
});
