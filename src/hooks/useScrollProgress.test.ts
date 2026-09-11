import { renderHook, act } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useScrollProgress } from './useScrollProgress';

describe('useScrollProgress', () => {
  afterEach(() => {
    Object.defineProperty(document.body, 'scrollHeight', { value: 0, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 768, configurable: true });
    window.scrollY = 0;
  });

  it('is 0 when the page does not scroll', () => {
    const { result } = renderHook(() => useScrollProgress());
    expect(result.current).toBe(0);
  });

  it('updates on scroll based on scrollY / (scrollHeight - innerHeight)', () => {
    Object.defineProperty(document.body, 'scrollHeight', { value: 2768, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 768, configurable: true });
    const { result } = renderHook(() => useScrollProgress());
    act(() => {
      window.scrollY = 1000; // (1000 / (2768-768)) * 100 = 50
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current).toBe(50);
  });
});
