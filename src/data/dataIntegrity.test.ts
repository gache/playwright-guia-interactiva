import { describe, expect, it } from 'vitest';
import { sections } from './es/sections';
import { roadmapStages } from './es/roadmap';
import { glossaryTerms } from './es/glossary';
import { sections as sectionsFr } from './fr/sections';
import { roadmapStages as roadmapStagesFr } from './fr/roadmap';
import { glossaryTerms as glossaryTermsFr } from './fr/glossary';
import { exercises as exercisesEs } from './es/exercises';
import { exercises as exercisesFr } from './fr/exercises';

describe('extracted guide data', () => {
  it('has exactly 31 sections in order s1..s31', () => {
    expect(sections).toHaveLength(31);
    expect(sections.map(s => s.id)).toEqual(Array.from({ length: 31 }, (_, i) => `s${i + 1}`));
  });

  it('has exactly 29 section-level quizzes with s-prefixed ids', () => {
    const quizIds = sections.flatMap(s => s.blocks.filter(b => b.type === 'quiz').map(b => b.id));
    expect(quizIds.filter(id => /^s\d+$/.test(id))).toHaveLength(29);
  });

  it('spot-checks known quiz answers extracted from the source', () => {
    const answerFor = (id: string) => {
      const block = sections.flatMap(s => s.blocks).find(b => b.type === 'quiz' && b.id === id);
      return block && block.type === 'quiz' ? block.answerIndex : undefined;
    };
    expect(answerFor('s1')).toBe(3);
    expect(answerFor('s7')).toBe(3);
    expect(answerFor('s16')).toBe(0);
    expect(answerFor('s25')).toBe(2);
    expect(answerFor('s29')).toBe(1);
  });

  it('section 30 has 8 exercises and no quiz blocks', () => {
    const s30 = sections.find(s => s.id === 's30')!;
    expect(s30.blocks.filter(b => b.type === 'exercise')).toHaveLength(8);
    expect(s30.blocks.filter(b => b.type === 'quiz')).toHaveLength(0);
  });

  it('section 31 has 8 theoretical quizzes flagged isTeo', () => {
    const s31 = sections.find(s => s.id === 's31')!;
    const teoQuizzes = s31.blocks.filter(b => b.type === 'quiz' && b.isTeo);
    expect(teoQuizzes).toHaveLength(8);
  });

  it('has no raw fallback blocks (every source pattern was recognized)', () => {
    const rawBlocks = sections.flatMap(s => s.blocks.filter(b => b.type === 'raw'));
    expect(rawBlocks).toEqual([]);
  });

  it('has a non-empty roadmap and glossary', () => {
    expect(roadmapStages.length).toBeGreaterThan(0);
    expect(glossaryTerms.length).toBeGreaterThan(0);
    expect(glossaryTerms.map(t => t.term)).toContain('Locator');
  });
});

describe('FR/ES content parity', () => {
  it('sections: same length, ids, and order between es and fr', () => {
    expect(sectionsFr).toHaveLength(sections.length);
    expect(sectionsFr.map(s => s.id)).toEqual(sections.map(s => s.id));
    expect(sectionsFr.map(s => s.num)).toEqual(sections.map(s => s.num));
    expect(sectionsFr.map(s => s.difficulty)).toEqual(sections.map(s => s.difficulty));
  });

  it('sections: same block-type sequence per section between es and fr', () => {
    sections.forEach((s, i) => {
      const frSection = sectionsFr[i];
      expect(frSection.blocks.map(b => b.type)).toEqual(s.blocks.map(b => b.type));
    });
  });

  it('exercises: same length, ids, and order between es and fr', () => {
    expect(exercisesFr).toHaveLength(exercisesEs.length);
    expect(exercisesFr.map(e => e.id)).toEqual(exercisesEs.map(e => e.id));
    expect(exercisesFr.map(e => e.difficulty)).toEqual(exercisesEs.map(e => e.difficulty));
  });

  it('glossary: same length and term count between es and fr', () => {
    expect(glossaryTermsFr).toHaveLength(glossaryTerms.length);
  });

  it('roadmap: same length and dot sequence between es and fr', () => {
    expect(roadmapStagesFr).toHaveLength(roadmapStages.length);
    expect(roadmapStagesFr.map(r => r.dot)).toEqual(roadmapStages.map(r => r.dot));
  });
});
