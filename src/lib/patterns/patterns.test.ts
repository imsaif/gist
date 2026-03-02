import { describe, it, expect } from 'vitest';
import {
  getAllPatterns,
  getPatternById,
  getPatternsByCategory,
  searchPatternsByName,
  getPatternsForAIContext,
  getAllCategories,
  getRelatedPatterns,
} from './patterns';

describe('getAllPatterns', () => {
  it('returns an array of patterns', () => {
    const patterns = getAllPatterns();
    expect(Array.isArray(patterns)).toBe(true);
    expect(patterns.length).toBeGreaterThan(0);
  });

  it('each pattern has required fields', () => {
    const patterns = getAllPatterns();
    for (const p of patterns) {
      expect(p.id).toBeDefined();
      expect(p.name).toBeDefined();
      expect(p.category).toBeDefined();
      expect(p.keywords).toBeDefined();
      expect(Array.isArray(p.keywords)).toBe(true);
    }
  });
});

describe('getPatternById', () => {
  it('returns a pattern for a valid ID', () => {
    const pattern = getPatternById('explainability');
    expect(pattern).toBeDefined();
    expect(pattern!.name).toBe('Explainability');
  });

  it('returns undefined for an invalid ID', () => {
    expect(getPatternById('nonexistent-pattern-xyz')).toBeUndefined();
  });
});

describe('getPatternsByCategory', () => {
  it('returns patterns for the trust category', () => {
    const patterns = getPatternsByCategory('trust');
    expect(patterns.length).toBeGreaterThan(0);
    expect(patterns.every((p) => p.category === 'trust')).toBe(true);
  });

  it('returns empty array for a category with no patterns', () => {
    const patterns = getPatternsByCategory('nonexistent' as never);
    expect(patterns).toEqual([]);
  });
});

describe('searchPatternsByName', () => {
  it('finds patterns by partial name match', () => {
    const results = searchPatternsByName('explain');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((p) => p.id === 'explainability')).toBe(true);
  });

  it('is case-insensitive', () => {
    const results = searchPatternsByName('EXPLAIN');
    expect(results.length).toBeGreaterThan(0);
  });

  it('returns empty for no match', () => {
    const results = searchPatternsByName('xyznonexistent123');
    expect(results).toEqual([]);
  });
});

describe('getPatternsForAIContext', () => {
  it('returns a formatted string with pattern names', () => {
    const ctx = getPatternsForAIContext();
    expect(typeof ctx).toBe('string');
    expect(ctx).toContain('Explainability');
    expect(ctx).toContain('explainability');
  });

  it('includes one-liners', () => {
    const ctx = getPatternsForAIContext();
    // Check that it has the format "- Name (id): oneLiner"
    expect(ctx).toMatch(/- .+ \(.+\): .+/);
  });
});

describe('getAllCategories', () => {
  it('returns categories with id, name, and color', () => {
    const categories = getAllCategories();
    expect(categories.length).toBeGreaterThan(0);
    for (const c of categories) {
      expect(c.id).toBeDefined();
      expect(c.name).toBeDefined();
      expect(c.color).toBeDefined();
    }
  });
});

describe('getRelatedPatterns', () => {
  it('returns related patterns for a valid pattern', () => {
    const related = getRelatedPatterns('explainability');
    expect(related.length).toBeGreaterThan(0);
    expect(related.some((p) => p.id === 'confidence-calibration')).toBe(true);
  });

  it('returns empty array for invalid pattern ID', () => {
    expect(getRelatedPatterns('nonexistent')).toEqual([]);
  });
});
