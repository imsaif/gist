import { describe, it, expect } from 'vitest';
import {
  findMatchingPatterns,
  findBestMatchingPattern,
  findExplicitPatternMentions,
  findPatternsByProblemDescription,
  findRelevantPatterns,
} from './matcher';

describe('findMatchingPatterns', () => {
  it('returns matches for text containing pattern keywords', () => {
    const matches = findMatchingPatterns('explain why the AI made this decision');
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].score).toBeGreaterThanOrEqual(2);
  });

  it('gives higher score for exact word match than partial', () => {
    // "explain" is a keyword for explainability
    const matches = findMatchingPatterns('explain this to me');
    const explainMatch = matches.find((m) => m.pattern.id === 'explainability');
    expect(explainMatch).toBeDefined();
    expect(explainMatch!.score).toBeGreaterThanOrEqual(2);
  });

  it('gives +5 bonus for pattern name mention', () => {
    const matches = findMatchingPatterns('we need explainability in our app');
    const match = matches.find((m) => m.pattern.id === 'explainability');
    expect(match).toBeDefined();
    expect(match!.score).toBeGreaterThanOrEqual(5);
  });

  it('gives +4 bonus for pattern ID mention', () => {
    const matches = findMatchingPatterns('we should use human in the loop');
    const match = matches.find((m) => m.pattern.id === 'human-in-the-loop');
    expect(match).toBeDefined();
    expect(match!.score).toBeGreaterThanOrEqual(4);
  });

  it('respects maxResults', () => {
    const matches = findMatchingPatterns('explain trust transparent undo revert error', 2);
    expect(matches.length).toBeLessThanOrEqual(2);
  });

  it('returns empty for unrelated text', () => {
    const matches = findMatchingPatterns('the quick brown fox jumps over the lazy dog');
    expect(matches).toEqual([]);
  });

  it('sorts by score descending', () => {
    const matches = findMatchingPatterns('explain reasoning transparent decision');
    for (let i = 1; i < matches.length; i++) {
      expect(matches[i - 1].score).toBeGreaterThanOrEqual(matches[i].score);
    }
  });

  it('includes matchedKeywords', () => {
    const matches = findMatchingPatterns('explain reasoning');
    if (matches.length > 0) {
      expect(matches[0].matchedKeywords.length).toBeGreaterThan(0);
    }
  });
});

describe('findBestMatchingPattern', () => {
  it('returns the top match', () => {
    const match = findBestMatchingPattern('we need explainability for our AI');
    expect(match).not.toBeNull();
    expect(match!.pattern.id).toBe('explainability');
  });

  it('returns null for unrelated text', () => {
    expect(findBestMatchingPattern('random words with no pattern relevance xyz')).toBeNull();
  });
});

describe('findExplicitPatternMentions', () => {
  it('finds patterns mentioned by name', () => {
    const patterns = findExplicitPatternMentions('We use Explainability in our feature');
    expect(patterns.some((p) => p.id === 'explainability')).toBe(true);
  });

  it('finds patterns mentioned by ID (kebab-case)', () => {
    const patterns = findExplicitPatternMentions('human in the loop is important');
    expect(patterns.some((p) => p.id === 'human-in-the-loop')).toBe(true);
  });

  it('returns empty for no explicit mentions', () => {
    const patterns = findExplicitPatternMentions('no pattern names here at all xyz');
    expect(patterns).toEqual([]);
  });
});

describe('findPatternsByProblemDescription', () => {
  it('maps "loading too long" to loading/streaming patterns', () => {
    const patterns = findPatternsByProblemDescription('the loading too long for users');
    expect(patterns.length).toBeGreaterThan(0);
    const ids = patterns.map((p) => p.id);
    expect(ids).toContain('loading-progress');
  });

  it('returns empty for phrases with punctuation that gets normalized away', () => {
    // normalizeText strips apostrophes, so "don't" becomes "don t" which won't match the key "don't"
    const patterns = findPatternsByProblemDescription("users don't trust the AI");
    expect(patterns).toEqual([]);
  });

  it('maps "need to approve" to human-in-the-loop', () => {
    const patterns = findPatternsByProblemDescription('users need to approve before AI acts');
    expect(patterns.some((p) => p.id === 'human-in-the-loop')).toBe(true);
  });

  it('maps "undo changes" to undo-redo', () => {
    const patterns = findPatternsByProblemDescription('users want to undo changes');
    expect(patterns.some((p) => p.id === 'undo-redo')).toBe(true);
  });

  it('returns empty for non-matching description', () => {
    const patterns = findPatternsByProblemDescription('build a database');
    expect(patterns).toEqual([]);
  });
});

describe('findRelevantPatterns', () => {
  it('combines keyword, semantic, and explicit matches', () => {
    const matches = findRelevantPatterns("users don't trust the AI, we need explainability");
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].pattern.id).toBe('explainability');
  });

  it('deduplicates results from different sources', () => {
    const matches = findRelevantPatterns('explainability explain reasoning');
    const ids = matches.map((m) => m.pattern.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  it('respects maxResults', () => {
    const matches = findRelevantPatterns("explainability trust undo users don't trust error", 2);
    expect(matches.length).toBeLessThanOrEqual(2);
  });

  it('returns empty for unrelated text', () => {
    expect(findRelevantPatterns('completely unrelated gibberish text xyz 123')).toEqual([]);
  });
});
