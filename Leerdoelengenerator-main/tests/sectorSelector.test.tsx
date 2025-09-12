/* @vitest-environment jsdom */
import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import { createRoot } from 'react-dom/client';
import SectorSelector from '@/features/sector/SectorSelector';

describe('SectorSelector', () => {
  it('renders 7 options and handles click', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const onChange = vi.fn();
    const root = createRoot(div);
    root.render(<SectorSelector value={null} onChange={onChange} />);
    const buttons = div.querySelectorAll('button');
    expect(buttons.length).toBe(7);
    buttons[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onChange).toHaveBeenCalledWith('PO');
    root.unmount();
  });
});
