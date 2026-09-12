import type { Section, Exercise, GlossaryTerm, RoadmapStage, Locale } from '../types';
import { sections as sectionsEs } from './es/sections';
import { sections as sectionsFr } from './fr/sections';
import { exercises as exercisesEs } from './es/exercises';
import { exercises as exercisesFr } from './fr/exercises';
import { glossaryTerms as glossaryTermsEs } from './es/glossary';
import { glossaryTerms as glossaryTermsFr } from './fr/glossary';
import { roadmapStages as roadmapStagesEs } from './es/roadmap';
import { roadmapStages as roadmapStagesFr } from './fr/roadmap';

export function getSections(locale: Locale): Section[] {
  return locale === 'fr' ? sectionsFr : sectionsEs;
}

export function getExercises(locale: Locale): Exercise[] {
  return locale === 'fr' ? exercisesFr : exercisesEs;
}

export function getGlossaryTerms(locale: Locale): GlossaryTerm[] {
  return locale === 'fr' ? glossaryTermsFr : glossaryTermsEs;
}

export function getRoadmapStages(locale: Locale): RoadmapStage[] {
  return locale === 'fr' ? roadmapStagesFr : roadmapStagesEs;
}
