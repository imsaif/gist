import { GapAnalysis } from '@/types/audit';

// ============================================
// Audit Prompt (sent to all 3 LLMs)
// ============================================

export function buildAuditPrompt(url: string, siteContent: string): string {
  return `I'm evaluating how well AI tools can understand this product from its public website. Based on the following website content from ${url}, please answer these questions:

1. **What does this product do?** Describe its core purpose and functionality.
2. **How does it work?** Explain the key mechanics and user workflow.
3. **What makes it different?** How does it stand out from competitors or alternatives?
4. **Who is it for?** Describe the target audience and use cases.

Be specific. If you're unsure about something, say so rather than guessing.

---

Website content:

${siteContent}`;
}

// ============================================
// Analysis Prompt (Claude analysis layer)
// ============================================

export function buildAnalysisPrompt(
  siteContent: string,
  chatgptResponse: string,
  claudeResponse: string,
  perplexityResponse: string
): string {
  return `You are an AI readability analyst. Three LLMs were given the same website content and asked to describe the product. Your job is to identify gaps: places where the LLMs got it wrong, made things up, blended the product with competitors, or missed key information.

## The website content that was provided to all models:

${siteContent}

## ChatGPT's response:

${chatgptResponse}

## Claude's response:

${claudeResponse}

## Perplexity's response:

${perplexityResponse}

## Your task

Analyze the three responses and identify gaps in how accurately these models understood and described the product. For each gap, categorize it as one of:

- **competitor_blending**: The model described features or behaviors from a competitor's product, not this one
- **invisible_mechanics**: The model couldn't explain how the product actually works (key mechanics are invisible)
- **missing_decisions**: The model missed or got wrong a design decision that makes this product unique
- **fabrication**: The model made up specific details (pricing, features, capabilities) that aren't on the site
- **missing_boundaries**: The model didn't know what the product is NOT or who it's NOT for
- **positioning_drift**: The model placed the product in the wrong category or compared it to the wrong competitors

For severity:
- **critical**: Fundamentally misrepresents the product (wrong category, fabricated features, competitor confusion)
- **high**: Significant gap that would lead to wrong recommendations or implementations
- **medium**: Minor inaccuracy or missing nuance

Respond with ONLY valid JSON matching this exact structure (no markdown, no code fences):

${JSON.stringify(
  {
    gaps: [
      {
        id: 'gap-1',
        severity: 'critical',
        category: 'competitor_blending',
        description: 'Description of the gap',
        modelsAffected: ['chatgpt', 'claude'],
        whatFileNeeds: 'What a gist.design file should include to fix this',
      },
    ],
    summary: {
      totalGaps: 5,
      criticalGaps: 2,
      readabilityScore: 'Poor',
      worstModel: 'chatgpt',
      bestModel: 'claude',
    },
  } satisfies GapAnalysis,
  null,
  2
)}

Rules:
- Use "Poor" if 3+ critical gaps, "Partial" if 1-2 critical, "Good" if 0 critical
- modelsAffected should only include models that exhibited the gap
- whatFileNeeds should be specific and actionable
- Generate real gap IDs like "gap-1", "gap-2", etc.
- worstModel/bestModel should reflect which model had the most/fewest issues`;
}

// ============================================
// Mock Analysis
// ============================================

export function getMockAnalysis(): GapAnalysis {
  return {
    gaps: [
      {
        id: 'gap-1',
        severity: 'critical',
        category: 'competitor_blending',
        description:
          'All three models compared the product to generic project management tools (Asana, Trello, Monday.com) without any basis from the website content. The product may be something entirely different.',
        modelsAffected: ['chatgpt', 'claude', 'perplexity'],
        whatFileNeeds:
          'Positioning section with explicit category, competitor comparisons, and "not this" statements to prevent category confusion.',
      },
      {
        id: 'gap-2',
        severity: 'critical',
        category: 'fabrication',
        description:
          'ChatGPT and Perplexity fabricated specific features (Kanban boards, time tracking, built-in chat) that may not exist in the product.',
        modelsAffected: ['chatgpt', 'perplexity'],
        whatFileNeeds:
          'Product overview with explicit feature list and interaction model describing actual capabilities.',
      },
      {
        id: 'gap-3',
        severity: 'high',
        category: 'invisible_mechanics',
        description:
          'None of the models could explain how the product actually works. All descriptions are vague: "helps teams organize work" without any specific mechanics.',
        modelsAffected: ['chatgpt', 'claude', 'perplexity'],
        whatFileNeeds:
          'Interaction model with primary flow, key interactions, and specific user workflows.',
      },
      {
        id: 'gap-4',
        severity: 'high',
        category: 'missing_boundaries',
        description:
          'No model identified who the product is NOT for. All assumed a generic "teams" audience without specificity.',
        modelsAffected: ['chatgpt', 'claude', 'perplexity'],
        whatFileNeeds:
          'Positioning section with "for who" and "not for who" to prevent wrong-audience recommendations.',
      },
      {
        id: 'gap-5',
        severity: 'medium',
        category: 'positioning_drift',
        description:
          'Perplexity positioned the product as a direct Monday.com/ClickUp competitor, which may misrepresent its actual market position.',
        modelsAffected: ['perplexity'],
        whatFileNeeds:
          'Explicit competitor comparisons with honest differences in the positioning section.',
      },
      {
        id: 'gap-6',
        severity: 'medium',
        category: 'missing_decisions',
        description:
          'No model identified any design decisions or trade-offs. All descriptions read like generic marketing copy without any "chose X over Y because Z" reasoning.',
        modelsAffected: ['chatgpt', 'claude', 'perplexity'],
        whatFileNeeds: 'Design decisions section capturing key trade-offs and their rationale.',
      },
    ],
    summary: {
      totalGaps: 6,
      criticalGaps: 2,
      readabilityScore: 'Poor',
      worstModel: 'chatgpt',
      bestModel: 'claude',
    },
  };
}
