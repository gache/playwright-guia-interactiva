import { render, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useActiveSection } from './useActiveSection';

function Probe({ ids }: { ids: string[] }) {
  const activeId = useActiveSection(ids);
  return <div data-testid="active">{activeId ?? ''}</div>;
}

describe('useActiveSection', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="s1"></div><div id="s2"></div>';
    Object.defineProperty(window, 'innerHeight', { value: 768, configurable: true });
  });
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('starts with no active section when no element is above 30% viewport', () => {
    const s1 = document.getElementById('s1')!;
    const s2 = document.getElementById('s2')!;
    s1.getBoundingClientRect = () => ({ top: 400, bottom: 500, left: 0, right: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => {} });
    s2.getBoundingClientRect = () => ({ top: 600, bottom: 700, left: 0, right: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => {} });
    const { getByTestId } = render(<Probe ids={['s1', 's2']} />);
    expect(getByTestId('active').textContent).toBe('');
  });

  it('returns the id of the element whose top is closest to but not above 30% threshold', () => {
    const s1 = document.getElementById('s1')!;
    const s2 = document.getElementById('s2')!;
    s1.getBoundingClientRect = () => ({ top: 100, bottom: 200, left: 0, right: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => {} });
    s2.getBoundingClientRect = () => ({ top: 200, bottom: 300, left: 0, right: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => {} });
    const { getByTestId } = render(<Probe ids={['s1', 's2']} />);
    // threshold = 768 * 0.3 = 230; s1.top=100 ≤ 230 and s2.top=200 ≤ 230; s2 wins (closer to 230)
    expect(getByTestId('active').textContent).toBe('s2');
  });

  it('updates active section on scroll', () => {
    const s1 = document.getElementById('s1')!;
    const s2 = document.getElementById('s2')!;
    let s1Top = 100;
    let s2Top = 400;
    s1.getBoundingClientRect = () => ({ top: s1Top, bottom: s1Top + 100, left: 0, right: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => {} });
    s2.getBoundingClientRect = () => ({ top: s2Top, bottom: s2Top + 100, left: 0, right: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => {} });
    const { getByTestId } = render(<Probe ids={['s1', 's2']} />);
    expect(getByTestId('active').textContent).toBe('s1');
    act(() => {
      s1Top = -200;
      s2Top = 50;
      window.dispatchEvent(new Event('scroll'));
    });
    expect(getByTestId('active').textContent).toBe('s2');
  });
});
