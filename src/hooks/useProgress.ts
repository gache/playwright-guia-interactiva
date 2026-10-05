import { useCallback, useState } from 'react';
import type { ProgressState } from '../types';

const STORAGE_KEY = 'pwguide_progress_v1';

const empty = (): ProgressState => ({ visited: [], quiz: {}, exercises: [], checks: {} });

function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw);
    return {
      visited: Array.isArray(parsed.visited) ? parsed.visited : [],
      quiz: parsed.quiz && typeof parsed.quiz === 'object' ? parsed.quiz : {},
      exercises: Array.isArray(parsed.exercises) ? parsed.exercises : [],
      checks: parsed.checks && typeof parsed.checks === 'object' ? parsed.checks : {},
    };
  } catch {
    return empty();
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

  const toggleExercise = useCallback((id: string) => {
    setState(prev => {
      const done = prev.exercises.includes(id);
      const next = { ...prev, exercises: done ? prev.exercises.filter(e => e !== id) : [...prev.exercises, id] };
      saveProgress(next);
      return next;
    });
  }, []);

  const toggleCheck = useCallback((id: string, key: string) => {
    setState(prev => {
      const current = prev.checks[id] ?? [];
      const updated = current.includes(key) ? current.filter(k => k !== key) : [...current, key];
      const next = { ...prev, checks: { ...prev.checks, [id]: updated } };
      saveProgress(next);
      return next;
    });
  }, []);

  return {
    visited: state.visited, quizAnswers: state.quiz, markVisited, markUnvisited, recordAnswer,
    doneExercises: state.exercises, checks: state.checks, toggleExercise, toggleCheck,
  };
}
