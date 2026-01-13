import type { Pattern, PatternMatch } from '@/types/patterns';
import { getAllPatterns } from './patterns';

// Minimum score threshold for a pattern to be considered a match
const MIN_MATCH_SCORE = 2;

// Normalize text for matching (lowercase, remove punctuation)
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Extract words from text
function extractWords(text: string): Set<string> {
  return new Set(normalizeText(text).split(' ').filter(Boolean));
}

// Calculate match score for a pattern against input text
function calculateMatchScore(
  pattern: Pattern,
  inputWords: Set<string>,
  inputText: string
): { score: number; matchedKeywords: string[] } {
  const matchedKeywords: string[] = [];
  let score = 0;

  // Check keyword matches
  for (const keyword of pattern.keywords) {
    const keywordLower = keyword.toLowerCase();

    // Exact word match (higher weight)
    if (inputWords.has(keywordLower)) {
      score += 2;
      matchedKeywords.push(keyword);
      continue;
    }

    // Partial match / phrase match (lower weight)
    if (inputText.includes(keywordLower)) {
      score += 1;
      matchedKeywords.push(keyword);
    }
  }

  // Bonus for pattern name mention
  const patternNameLower = pattern.name.toLowerCase();
  if (inputText.includes(patternNameLower)) {
    score += 5;
    matchedKeywords.push(pattern.name);
  }

  // Bonus for pattern ID mention (e.g., "human-in-the-loop")
  const patternIdNormalized = pattern.id.replace(/-/g, ' ');
  if (inputText.includes(patternIdNormalized)) {
    score += 4;
  }

  return { score, matchedKeywords };
}

// Find patterns matching the input text
export function findMatchingPatterns(text: string, maxResults: number = 3): PatternMatch[] {
  const patterns = getAllPatterns();
  const inputText = normalizeText(text);
  const inputWords = extractWords(text);

  const matches: PatternMatch[] = [];

  for (const pattern of patterns) {
    const { score, matchedKeywords } = calculateMatchScore(pattern, inputWords, inputText);

    if (score >= MIN_MATCH_SCORE) {
      matches.push({
        pattern,
        score,
        matchedKeywords,
      });
    }
  }

  // Sort by score descending and take top results
  return matches.sort((a, b) => b.score - a.score).slice(0, maxResults);
}

// Find single best matching pattern
export function findBestMatchingPattern(text: string): PatternMatch | null {
  const matches = findMatchingPatterns(text, 1);
  return matches.length > 0 ? matches[0] : null;
}

// Check if text explicitly mentions a pattern by name or ID
export function findExplicitPatternMentions(text: string): Pattern[] {
  const patterns = getAllPatterns();
  const inputText = normalizeText(text);
  const mentioned: Pattern[] = [];

  for (const pattern of patterns) {
    const patternNameLower = pattern.name.toLowerCase();
    const patternIdNormalized = pattern.id.replace(/-/g, ' ');

    if (inputText.includes(patternNameLower) || inputText.includes(patternIdNormalized)) {
      mentioned.push(pattern);
    }
  }

  return mentioned;
}

// Semantic matching helpers for common problem descriptions
const SEMANTIC_MAPPINGS: Record<string, string[]> = {
  "users don't trust": ['explainability', 'confidence-calibration', 'source-attribution'],
  'need to approve': ['human-in-the-loop'],
  'before ai acts': ['human-in-the-loop'],
  'undo changes': ['undo-redo'],
  'revert back': ['undo-redo', 'version-history'],
  'ai is wrong': ['graceful-degradation', 'error-recovery'],
  'ai fails': ['graceful-degradation', 'fallback-behaviors'],
  'too many features': ['progressive-disclosure'],
  overwhelmed: ['progressive-disclosure', 'expectation-setting'],
  'first time user': ['tutorial-flows', 'onboarding', 'expectation-setting'],
  "don't know what to ask": ['prompt-suggestions'],
  'upload image': ['multimodal-input'],
  'voice input': ['multimodal-input'],
  'need human help': ['ai-human-handoff'],
  'talk to someone': ['ai-human-handoff'],
  'remember preferences': ['memory-personalization'],
  'loading too long': ['loading-progress', 'streaming-output'],
  'want to customize': ['ai-controls'],
  'show why': ['explainability'],
  'how confident': ['confidence-calibration'],
  'where did this come from': ['source-attribution'],
};

// Find patterns based on semantic problem descriptions
export function findPatternsByProblemDescription(text: string): Pattern[] {
  const inputText = normalizeText(text);
  const patterns = getAllPatterns();
  const matchedIds = new Set<string>();

  for (const [phrase, patternIds] of Object.entries(SEMANTIC_MAPPINGS)) {
    if (inputText.includes(phrase)) {
      patternIds.forEach((id) => matchedIds.add(id));
    }
  }

  return patterns.filter((p) => matchedIds.has(p.id));
}

// Combined matching: keywords + semantic + explicit mentions
export function findRelevantPatterns(text: string, maxResults: number = 3): PatternMatch[] {
  // Get keyword matches
  const keywordMatches = findMatchingPatterns(text, maxResults * 2);

  // Get semantic matches
  const semanticMatches = findPatternsByProblemDescription(text).map((p) => ({
    pattern: p,
    score: 3, // Base score for semantic match
    matchedKeywords: ['semantic match'],
  }));

  // Get explicit mentions
  const explicitMentions = findExplicitPatternMentions(text).map((p) => ({
    pattern: p,
    score: 10, // High score for explicit mention
    matchedKeywords: ['explicit mention'],
  }));

  // Combine and deduplicate
  const allMatches = [...explicitMentions, ...keywordMatches, ...semanticMatches];
  const seen = new Set<string>();
  const uniqueMatches: PatternMatch[] = [];

  for (const match of allMatches) {
    if (!seen.has(match.pattern.id)) {
      seen.add(match.pattern.id);
      uniqueMatches.push(match);
    }
  }

  // Sort by score and return top results
  return uniqueMatches.sort((a, b) => b.score - a.score).slice(0, maxResults);
}
