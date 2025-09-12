/* @vitest-environment jsdom */
import { describe, test, expect } from 'vitest';
import React from 'react';
import { createRoot } from 'react-dom/client';
import NiveauBadge from '@/components/NiveauBadge';

describe('NiveauBadge', () => {
  test('PO toont geen Bloom en geen HBO-tekst', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = createRoot(div);
    root.render(<NiveauBadge sector="PO" />);
    expect(div.textContent).toMatch(/PO — Kerndoelen/i);
    expect(div.textContent).not.toMatch(/HBO|Bachelor|Bloom:/i);
    root.unmount();
  });

  test('HBO Bachelor toont Bloom', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = createRoot(div);
    root.render(<NiveauBadge sector="HBO" subtype="Bachelor" locale="en" />);
    expect(div.textContent).toMatch(/^HBO — Bachelor/);
    expect(div.textContent).toMatch(/Bloom: analyze • evaluate • create/);
    root.unmount();
  });
});

