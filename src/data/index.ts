import { useEffect, useState } from 'react';
import type { Section, Exercise, GlossaryTerm, RoadmapStage, Locale } from '../types';
import { sections as sectionsEs } from './es/sections';
import { exercises as exercisesEs } from './es/exercises';
import { glossaryTerms as glossaryTermsEs } from './es/glossary';
import { roadmapStages as roadmapStagesEs } from './es/roadmap';

export interface GuideData {
  sections: Section[];
  exercises: Exercise[];
  glossaryTerms: GlossaryTerm[];
  roadmapStages: RoadmapStage[];
}

// Spanish ships in the main bundle; French is a separate chunk downloaded only when someone switches to it.
const SPANISH: GuideData = {
  sections: sectionsEs,
  exercises: exercisesEs,
  glossaryTerms: glossaryTermsEs,
  roadmapStages: roadmapStagesEs,
};

let frenchPromise: Promise<GuideData> | undefined;
let frenchData: GuideData | undefined;

export function loadGuideData(locale: Locale): Promise<GuideData> {
  if (locale !== 'fr') return Promise.resolve(SPANISH);
  frenchPromise ??= Promise.all([
    import('./fr/sections'),
    import('./fr/exercises'),
    import('./fr/glossary'),
    import('./fr/roadmap'),
  ]).then(([s, e, g, r]) => {
    frenchData = { sections: s.sections, exercises: e.exercises, glossaryTerms: g.glossaryTerms, roadmapStages: r.roadmapStages };
    return frenchData;
  });
  return frenchPromise;
}

/** Synchronous accessor: French falls back to Spanish until its chunk has been loaded. */
export function getGuideData(locale: Locale): GuideData {
  return locale === 'fr' && frenchData ? frenchData : SPANISH;
}

/** React hook: returns the data for the locale and re-renders when the French chunk arrives. */
export function useGuideData(locale: Locale): { data: GuideData; loading: boolean } {
  const [, setTick] = useState(0);
  const ready = locale !== 'fr' || frenchData !== undefined;
  useEffect(() => {
    if (ready) return;
    let cancelled = false;
    loadGuideData(locale).then(() => { if (!cancelled) setTick(t => t + 1); });
    return () => { cancelled = true; };
  }, [locale, ready]);
  return { data: getGuideData(locale), loading: !ready };
}

export const getSections = (locale: Locale): Section[] => getGuideData(locale).sections;
export const getExercises = (locale: Locale): Exercise[] => getGuideData(locale).exercises;
export const getGlossaryTerms = (locale: Locale): GlossaryTerm[] => getGuideData(locale).glossaryTerms;
export const getRoadmapStages = (locale: Locale): RoadmapStage[] => getGuideData(locale).roadmapStages;
