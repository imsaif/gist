// Pattern category types
export type PatternCategory =
  | 'trust'
  | 'control'
  | 'feedback'
  | 'error'
  | 'onboarding'
  | 'io'
  | 'collaboration';

// Category metadata for display
export interface CategoryMeta {
  id: PatternCategory;
  name: string;
  color: string;
}

// Product example showing real-world usage
export interface ProductExample {
  product: string;
  description: string;
  imageUrl?: string;
}

// Core pattern interface
export interface Pattern {
  id: string;
  name: string;
  category: PatternCategory;
  oneLiner: string;
  problem: string;
  solution: string;
  examples: ProductExample[];
  url: string;
  keywords: string[];
  relatedPatterns: string[];
}

// Pattern identified during conversation
export interface IdentifiedPattern {
  patternId: string;
  reason: string;
  addedToBrief: boolean;
}

// Pattern recommendation in brief artifact
export interface PatternRecommendation {
  patternId: string;
  reason: string;
  url: string;
}

// Pattern match result from matcher
export interface PatternMatch {
  pattern: Pattern;
  score: number;
  matchedKeywords: string[];
}
