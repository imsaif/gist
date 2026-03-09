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

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '\n[truncated]';
}

export function buildAnalysisPrompt(
  siteContent: string,
  chatgptResponse: string,
  claudeResponse: string,
  perplexityResponse: string
): string {
  return `You are an AI readability analyst. LLMs were given a product's website and asked to describe it. Your job is to identify gaps in their understanding — where they got it wrong, were vague, blended with competitors, or missed key info.

## Website content (partial reference):

${truncate(siteContent, 5000)}

## ChatGPT's response:

${truncate(chatgptResponse, 2000)}

## Claude's response:

${truncate(claudeResponse, 2000)}

## Perplexity's response:

${truncate(perplexityResponse, 2000)}

## Your task

Analyze the LLM responses and identify gaps in how accurately they understood the product.

IMPORTANT: The website content above is a partial, text-only extraction of the page. It does NOT capture:
- Interactive elements (search bars, filters, dropdowns, modals)
- Client-rendered UI (React/Next.js components that render after JavaScript loads)
- Content on subpages (only the homepage was scraped)
- Visual layout, images, icons, or navigation structure

Do NOT flag something as "fabricated" just because it doesn't appear in the scraped text. If an LLM describes a plausible feature (like search or filtering), it may be correctly describing interactive UI that the scraper couldn't capture. Only flag fabrication when a claim is clearly invented and contradicts what the site actually is (e.g., claiming a documentation site has a paid SaaS tier, or describing features from a completely different product).

For each gap found, categorize it as one of:

- **competitor_blending**: The model described features or behaviors from a competitor's product, not this one
- **invisible_mechanics**: The model described what a feature IS but not HOW it works — the interaction model is missing or vague
- **missing_decisions**: The model missed or got wrong a design decision that makes this product unique
- **fabrication**: The model clearly invented details that contradict the product's actual nature (NOT just details missing from the scraped text)
- **missing_boundaries**: The model didn't know what the product is NOT or who it's NOT for
- **positioning_drift**: The model placed the product in the wrong category or compared it to the wrong competitors

For severity:
- **critical**: Fundamentally misrepresents the product (wrong category, clearly fabricated features, competitor confusion)
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
- worstModel/bestModel should reflect which model had the most/fewest issues
- If an LLM errored out (returned an error message instead of a product description), exclude it from the analysis entirely — do not count it as "best" or "worst" model
- Err on the side of fewer, higher-confidence gaps over many speculative ones`;
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
