import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useProgress } from './useProgress';

const KEY = 'pwguide_progress_v1';

describe('useProgress', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts empty when nothing is stored', () => {
    const { result } = renderHook(() => useProgress());
    expect(result.current.visited).toEqual([]);
    expect(result.current.quizAnswers).toEqual({});
  });

  it('restores previously saved progress', () => {
    localStorage.setItem(KEY, JSON.stringify({ visited: ['s1'], quiz: { s1: 2 } }));
    const { result } = renderHook(() => useProgress());
    expect(result.current.visited).toEqual(['s1']);
    expect(result.current.quizAnswers).toEqual({ s1: 2 });
  });

  it('markVisited adds an id once and persists it', () => {
    const { result } = renderHook(() => useProgress());
    act(() => result.current.markVisited('s1'));
    act(() => result.current.markVisited('s1'));
    expect(result.current.visited).toEqual(['s1']);
    expect(JSON.parse(localStorage.getItem(KEY)!).visited).toEqual(['s1']);
  });

  it('recordAnswer stores the chosen index once and persists it', () => {
    const { result } = renderHook(() => useProgress());
    act(() => result.current.recordAnswer('s1', 3));
    act(() => result.current.recordAnswer('s1', 0)); // already answered — ignored
    expect(result.current.quizAnswers).toEqual({ s1: 3 });
    expect(JSON.parse(localStorage.getItem(KEY)!).quiz).toEqual({ s1: 3 });
  });

  it('falls back to empty state on corrupt JSON', () => {
    localStorage.setItem(KEY, '{not valid json');
    const { result } = renderHook(() => useProgress());
    expect(result.current.visited).toEqual([]);
    expect(result.current.quizAnswers).toEqual({});
  });

  it('falls back to empty state when localStorage.getItem throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const { result } = renderHook(() => useProgress());
    expect(result.current.visited).toEqual([]);
    spy.mockRestore();
  });
});
