import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useActiveSection } from './useActiveSection';

let observedCallback: IntersectionObserverCallback;
let observedElements: Element[] = [];

class FakeIntersectionObserver {
  constructor(cb: IntersectionObserverCallback) {
    observedCallback = cb;
  }
  observe(el: Element) {
    observedElements.push(el);
  }
  disconnect() {
    observedElements = [];
  }
  unobserve() {}
  takeRecords() {
    return [];
  }
}

function Probe({ ids }: { ids: string[] }) {
  const activeId = useActiveSection(ids);
  return <div data-testid="active">{activeId ?? ''}</div>;
}

describe('useActiveSection', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
    document.body.innerHTML = '<div id="s1"></div><div id="s2"></div>';
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('starts with no active section', () => {
    const { getByTestId } = render(<Probe ids={['s1', 's2']} />);
    expect(getByTestId('active').textContent).toBe('');
  });

  it('updates when an observed element intersects', () => {
    const { getByTestId } = render(<Probe ids={['s1', 's2']} />);
    const s2 = document.getElementById('s2')!;
    act(() => {
      observedCallback(
        [{ target: s2, isIntersecting: true }] as unknown as IntersectionObserverEntry[],
        {} as IntersectionObserver,
      );
    });
    expect(getByTestId('active').textContent).toBe('s2');
  });
});
