import { useCallback, useState } from 'react';
import type { ProgressState } from '../types';

const STORAGE_KEY = 'pwguide_progress_v1';

function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { visited: [], quiz: {} };
    const parsed = JSON.parse(raw);
    return {
      visited: Array.isArray(parsed.visited) ? parsed.visited : [],
      quiz: parsed.quiz && typeof parsed.quiz === 'object' ? parsed.quiz : {},
    };
  } catch {
    return { visited: [], quiz: {} };
  }
}

function saveProgress(state: ProgressState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable (private browsing, quota, etc.) — keep going in-memory only
  }
}

export function useProgress() {
  const [state, setState] = useState<ProgressState>(loadProgress);

  const markVisited = useCallback((id: string) => {
    setState(prev => {
      if (prev.visited.includes(id)) return prev;
      const next = { ...prev, visited: [...prev.visited, id] };
      saveProgress(next);
      return next;
    });
  }, []);

  const recordAnswer = useCallback((id: string, index: number) => {
    setState(prev => {
      if (id in prev.quiz) return prev;
      const next = { ...prev, quiz: { ...prev.quiz, [id]: index } };
      saveProgress(next);
      return next;
    });
  }, []);

  const markUnvisited = useCallback((id: string) => {
    setState(prev => {
      if (!prev.visited.includes(id)) return prev;
      const next = { ...prev, visited: prev.visited.filter(v => v !== id) };
      saveProgress(next);
      return next;
    });
  }, []);

  return { visited: state.visited, quizAnswers: state.quiz, markVisited, markUnvisited, recordAnswer };
}
