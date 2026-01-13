import patternsData from '@/data/patterns.json';
import type { Pattern, PatternCategory, CategoryMeta } from '@/types/patterns';

// Type assertion for imported JSON
const { categories, patterns } = patternsData as {
  categories: CategoryMeta[];
  patterns: Pattern[];
};

// Get all patterns
export function getAllPatterns(): Pattern[] {
  return patterns;
}

// Get pattern by ID
export function getPatternById(id: string): Pattern | undefined {
  return patterns.find((p) => p.id === id);
}

// Get patterns by category
export function getPatternsByCategory(category: PatternCategory): Pattern[] {
  return patterns.filter((p) => p.category === category);
}

// Get all categories
export function getAllCategories(): CategoryMeta[] {
  return categories;
}

// Get category metadata
export function getCategoryMeta(id: PatternCategory): CategoryMeta | undefined {
  return categories.find((c) => c.id === id);
}

// Get category color for a pattern
export function getPatternColor(pattern: Pattern): string {
  const category = getCategoryMeta(pattern.category);
  return category?.color ?? '#6b7280';
}

// Get related patterns for a pattern
export function getRelatedPatterns(patternId: string): Pattern[] {
  const pattern = getPatternById(patternId);
  if (!pattern) return [];

  return pattern.relatedPatterns
    .map((id) => getPatternById(id))
    .filter((p): p is Pattern => p !== undefined);
}

// Get pattern URL
export function getPatternUrl(pattern: Pattern): string {
  return pattern.url;
}

// Search patterns by name (simple search)
export function searchPatternsByName(query: string): Pattern[] {
  const lowerQuery = query.toLowerCase();
  return patterns.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) || p.oneLiner.toLowerCase().includes(lowerQuery)
  );
}

// Get patterns as a summary for AI context
export function getPatternsForAIContext(): string {
  return patterns.map((p) => `- ${p.name} (${p.id}): ${p.oneLiner}`).join('\n');
}

// Export raw data for direct access
export { patterns, categories };
