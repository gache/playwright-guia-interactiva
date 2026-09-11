import { describe, expect, it } from 'vitest';
import { sections } from './sections';
import { roadmapStages } from './roadmap';
import { glossaryTerms } from './glossary';

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
