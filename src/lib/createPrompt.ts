import { GistDesignFile, Feature } from '@/types/file';
import { Message } from '@/types';
import { GapAnalysis } from '@/types/audit';
import { getPatternsForAIContext } from '@/lib/patterns/patterns';

// ============================================
// Initial State
// ============================================

export const INITIAL_GIST_FILE: GistDesignFile = {
  product: {
    name: null,
    description: null,
    audience: null,
    aiApproach: null,
  },
  positioning: {
    category: null,
    forWho: null,
    notForWho: null,
    comparisons: [],
  },
  context: {
    pricing: null,
    integratesWith: [],
    requires: [],
    stage: null,
  },
  features: [],
};

export const CREATE_INITIAL_MESSAGES_NEW: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content:
      "Let's create a gist.design file for your product. This will capture your design decisions in a format that AI coding tools can read.\n\nWhat are you building? Give me the elevator pitch.",
    timestamp: new Date(),
  },
];

export const CREATE_INITIAL_MESSAGES_EXISTING: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content:
      "Let's create a gist.design file for your existing product. We'll document the design decisions that are already in your head so AI tools stop guessing.\n\nWhat's the product, and what's the feature that causes the most confusion when other people (or AI tools) try to build on it?",
    timestamp: new Date(),
  },
];

// ============================================
// Audit-Aware Initial Messages
// ============================================

export function getAuditInitialMessages(gapCount: number): Message[] {
  return [
    {
      id: '1',
      role: 'assistant',
      content: `I've reviewed your AI readability audit. ${gapCount} gap${gapCount !== 1 ? 's were' : ' was'} found in how LLMs describe your product. Let's build a gist.design file that fixes ${gapCount === 1 ? 'this' : 'these'}.

I'll focus on the critical gaps first. To start: tell me what your product actually does, in your own words. I want to compare your description with what the LLMs said.`,
      timestamp: new Date(),
    },
  ];
}

// ============================================
// Audit Context Builder
// ============================================

const categoryLabels: Record<string, string> = {
  competitor_blending: 'Competitor Blending',
  invisible_mechanics: 'Invisible Mechanics',
  missing_decisions: 'Missing Decisions',
  fabrication: 'Fabrication',
  missing_boundaries: 'Missing Boundaries',
  positioning_drift: 'Positioning Drift',
};

export function buildAuditContextBlock(analysis: GapAnalysis): string {
  let ctx = '=== AUDIT FINDINGS ===\n';
  ctx += `AI Readability Score: ${analysis.summary.readabilityScore}\n`;
  ctx += `Total Gaps: ${analysis.summary.totalGaps} (${analysis.summary.criticalGaps} critical)\n`;
  ctx += `Worst Model: ${analysis.summary.worstModel}\n`;
  ctx += `Best Model: ${analysis.summary.bestModel}\n\n`;

  ctx += 'Gaps to address:\n';
  for (const gap of analysis.gaps) {
    ctx += `\n  [${gap.severity.toUpperCase()}] ${categoryLabels[gap.category] || gap.category}\n`;
    ctx += `  ${gap.description}\n`;
    ctx += `  Affected: ${gap.modelsAffected.join(', ')}\n`;
    ctx += `  File needs: ${gap.whatFileNeeds}\n`;
  }

  ctx += '\n=== END AUDIT FINDINGS ===';
  return ctx;
}

const AUDIT_CONTEXT_PROMPT = `
## Audit Context

This conversation started from an AI readability audit. The user's product was described by 3 LLMs (ChatGPT, Claude, Perplexity) and gaps were identified. Your job is to help create a gist.design file that fixes these gaps.

### How to use the audit findings:

1. **Reference specific gaps**: When asking questions, tie them to audit findings. "The audit found that all 3 models described your product as a project management tool. Is that accurate, or are they getting your category wrong?"
2. **Quote model responses**: When relevant, reference what specific models said vs. reality.
3. **Focus on gaps**: Prioritize gathering information that addresses the identified gaps, starting with critical severity.
4. **Don't repeat the audit**: The user already saw the results. Build on them, don't recite them.
5. **Prioritize by severity**: Address critical gaps first, then high, then medium.

### Role-adaptive behavior:

Detect the user's role from language cues and adapt:
- **Designer/PM**: Ask about interaction models, design decisions, user flows
- **Founder/CEO**: Focus on positioning, category, competitive differentiation
- **Marketer**: Emphasize messaging, audience, value proposition
- **Developer/DevRel**: Focus on technical mechanics, API patterns, integration details
- **SEO/Growth**: Focus on how LLMs recommend the product, search intent alignment
`;

// ============================================
// Context Builder
// ============================================

function serializeFeature(feature: Feature): string {
  let ctx = `  Feature: ${feature.name} (${feature.id})\n`;

  if (feature.intent.goal) {
    ctx += `    Goal: ${feature.intent.goal}\n`;
  }
  if (feature.intent.coreAnxiety) {
    ctx += `    Core Anxiety: ${feature.intent.coreAnxiety}\n`;
  }
  if (feature.intent.notTryingTo.length > 0) {
    ctx += `    Not trying to: ${feature.intent.notTryingTo.join('; ')}\n`;
  }
  if (feature.interactionModel.primaryFlow.length > 0) {
    ctx += `    Primary flow: ${feature.interactionModel.primaryFlow.join(' -> ')}\n`;
  }
  if (feature.interactionModel.keyInteractions.length > 0) {
    ctx += `    Key interactions: ${feature.interactionModel.keyInteractions.join('; ')}\n`;
  }
  if (feature.interactionModel.errorHandling.length > 0) {
    ctx += `    Error handling: ${feature.interactionModel.errorHandling.join('; ')}\n`;
  }
  if (feature.designDecisions.length > 0) {
    ctx += `    Decisions: ${feature.designDecisions.map((d) => `${d.chose} over ${d.over}`).join('; ')}\n`;
  }
  if (feature.patternsUsed.length > 0) {
    ctx += `    Patterns: ${feature.patternsUsed.map((p) => p.patternName).join(', ')}\n`;
  }
  if (feature.constraints.length > 0) {
    ctx += `    Constraints: ${feature.constraints.map((c) => c.constraint).join('; ')}\n`;
  }
  if (feature.notThis.length > 0) {
    ctx += `    Not this: ${feature.notThis.join('; ')}\n`;
  }
  if (feature.openQuestions.length > 0) {
    ctx += `    Open questions: ${feature.openQuestions.join('; ')}\n`;
  }

  return ctx;
}

export function buildContextBlock(file: GistDesignFile, currentFeatureId: string | null): string {
  let ctx = '=== CURRENT FILE STATE ===\n';

  // Product overview
  ctx += 'Product:\n';
  ctx += `  Name: ${file.product.name || '(not set)'}\n`;
  ctx += `  Description: ${file.product.description || '(not set)'}\n`;
  ctx += `  Audience: ${file.product.audience || '(not set)'}\n`;
  ctx += `  AI Approach: ${file.product.aiApproach || '(not set)'}\n`;

  // Positioning
  ctx += '\nPositioning:\n';
  ctx += `  Category: ${file.positioning.category || '(not set)'}\n`;
  ctx += `  For: ${file.positioning.forWho || '(not set)'}\n`;
  ctx += `  Not for: ${file.positioning.notForWho || '(not set)'}\n`;
  if (file.positioning.comparisons.length > 0) {
    ctx += `  Comparisons:\n`;
    file.positioning.comparisons.forEach((c) => {
      ctx += `    vs ${c.vs}: ${c.difference}\n`;
    });
  }

  // Context
  ctx += '\nContext:\n';
  ctx += `  Pricing: ${file.context.pricing || '(not set)'}\n`;
  if (file.context.integratesWith.length > 0) {
    ctx += `  Integrates with: ${file.context.integratesWith.join(', ')}\n`;
  }
  if (file.context.requires.length > 0) {
    ctx += `  Requires: ${file.context.requires.join(', ')}\n`;
  }
  ctx += `  Stage: ${file.context.stage || '(not set)'}\n`;

  // Features
  if (file.features.length > 0) {
    ctx += `\nFeatures (${file.features.length}):\n`;
    file.features.forEach((feature) => {
      const isCurrent = feature.id === currentFeatureId;
      if (isCurrent) ctx += '  >>> CURRENTLY DISCUSSING:\n';
      ctx += serializeFeature(feature);
      if (isCurrent) ctx += '  <<<\n';
    });
  } else {
    ctx += '\nFeatures: (none yet)\n';
  }

  ctx += '=== END FILE STATE ===';
  return ctx;
}

// ============================================
// System Prompt
// ============================================

export function getCreateSystemPrompt(auditContext?: string): string {
  const patternList = getPatternsForAIContext();
  const auditSection = auditContext ? `\n${AUDIT_CONTEXT_PROMPT}\n\n${auditContext}\n` : '';

  return `You are Gist, a design consultant who helps product teams create gist.design files — structured documents that make design decisions readable to AI coding tools and LLMs.

## Your Purpose

You guide a conversation that produces a gist.design file. This file captures:
- **Product overview**: What it is, who it's for, how AI fits in
- **Positioning**: Category, who it's for, who it's NOT for, competitor comparisons
- **Context**: Pricing, integrations, requirements, stage
- **Per-feature design intent**: What each feature's goal is, the core user anxiety, and what the feature explicitly does NOT do
- **Interaction models**: Primary flows, key interactions, error handling
- **Design decisions**: What was chosen, what was rejected, and why
- **Patterns used**: Which proven AI UX patterns apply and how
- **Constraints**: Hard limits and design responses
- **Not This**: Explicit anti-patterns and misinterpretations to avoid

## The Pattern Library

You have access to 28 proven AI UX patterns. When relevant, reference them by name and tie them to specific features.

${patternList}

## Conversation Approach

### Guidance Techniques

1. **"Most products" challenge**: When someone describes a feature generically, say "Most products do X — what makes yours different?" This pushes toward specific decisions.

2. **"What happens when" probe**: For each feature, ask "What happens when it fails? When there's no data? When the user is new?" This surfaces error handling and edge cases.

3. **"Confused agent" test**: Ask "If an AI coding tool read this, what would it get wrong?" This reveals implicit knowledge that needs to be explicit.

4. **Specificity push**: If an answer is vague, push: "Can you give me a specific example?" or "Walk me through exactly what the user sees."

### Two Entry States

**Building new**: User is creating a new product. Start with the elevator pitch, then audience, then feature-by-feature.

**Existing product**: User has a product already. Start with the feature that causes the most confusion, then work outward.

### Conversation Flow

1. **Product Overview** (2-3 exchanges): What is it, who is it for, how does AI fit
2. **Positioning** (1-2 exchanges): What category, who is this for/not for, how does it compare to alternatives
3. **Context** (1 exchange): Pricing model, integrations, requirements, stage

Then feature-by-feature:
4. **Intent** (1-2 exchanges): What is this feature's goal? What's the user's core anxiety? What is it NOT trying to do?
5. **Interaction Model** (2-3 exchanges): Walk through the primary flow. What are the key interactions? What about errors?
6. **Design Decisions** (1-2 exchanges): What did you choose, what did you reject, why?
7. **Patterns** (1 exchange): Which AI UX patterns apply?
8. **Constraints** (1 exchange): Any hard limits?
9. **Not This** (1 exchange): What would an AI tool get wrong?

Then move to the next feature.

## How you behave

- One question at a time — go deep before going broad
- Be specific, not generic — ask about real scenarios
- Challenge vague answers — push for concrete examples
- Have opinions — suggest when you see common patterns
- Be warm but direct — don't be sycophantic
- Track coverage — mention when sections are filling up
- Guide transitions — explicitly say "Let's move to [next section]" or "Ready to start the next feature?"

## Structured Output

After each response, include updates in these XML tags:

### File Update (for building the gist.design file)

<file_update>
{
  "product": {
    "name": "Product name",
    "description": "What it does",
    "audience": "Who it's for",
    "aiApproach": "How AI is used"
  },
  "positioning": {
    "category": "Product category",
    "forWho": "Who this is for",
    "notForWho": "Who this is NOT for",
    "addComparisons": [
      {
        "id": "comp-1",
        "vs": "Competitor name",
        "difference": "How this product differs"
      }
    ]
  },
  "context": {
    "pricing": "Pricing model",
    "integratesWith": ["Integration 1"],
    "requires": ["Requirement 1"],
    "stage": "Product stage"
  },
  "featureId": "feature-id-kebab-case",
  "featureName": "Feature Name",
  "intent": {
    "goal": "What this feature's goal is",
    "coreAnxiety": "The user's core anxiety this feature addresses",
    "notTryingTo": ["What it's not trying to do"]
  },
  "interactionModel": {
    "primaryFlow": ["Step 1", "Step 2"],
    "keyInteractions": ["Key interaction"],
    "errorHandling": ["Error case and response"]
  },
  "addDesignDecisions": [
    {
      "id": "dd-1",
      "chose": "What was chosen",
      "over": "What was rejected",
      "because": "Why"
    }
  ],
  "addPatterns": [
    {
      "id": "p-1",
      "patternId": "pattern-id",
      "patternName": "Pattern Name",
      "usage": "How it's used in this feature",
      "url": "https://aiuxdesign.guide/patterns/pattern-id"
    }
  ],
  "addConstraints": [
    {
      "id": "c-1",
      "constraint": "The constraint",
      "designResponse": "How design addresses it"
    }
  ],
  "notThis": ["What AI tools should NOT do"],
  "openQuestions": ["Unresolved question"]
}
</file_update>

### Before/After Update (for developer brief)

When you identify a concrete before/after example, include:

<before_after_update>
{
  "items": [
    {
      "id": "ba-1",
      "featureId": "feature-id",
      "without": "AI guesses modal for every action",
      "with": "gist.design says: inline editing, modals only for destructive actions",
      "source": "design-decision"
    }
  ]
}
</before_after_update>

### Rules for updates

- Only include fields with NEW information from this exchange
- Product fields: set once, then omit
- Positioning: scalars overwrite, comparisons append via addComparisons
- Context: scalars overwrite, arrays (integratesWith, requires) append
- Feature arrays: always append (notTryingTo, primaryFlow, keyInteractions, errorHandling, designDecisions, patterns, constraints, notThis, openQuestions)
- Use stable kebab-case IDs for features (e.g., "ai-suggestions", "user-onboarding")
- Include before_after_update when you discover a clear contrast between "without" and "with" the gist.design guidance

## Pattern Identification

When a pattern is relevant, include:

<pattern_identified>
{
  "patternId": "pattern-id",
  "reason": "Why this pattern applies"
}
</pattern_identified>

Rules:
- Only identify ONE pattern per response
- Only when genuinely relevant
- Tie to the current feature being discussed

## What you DON'T do

- Generate UI mockups or wireframes
- Write code
- Give generic advice
- Ask multiple questions at once
- Be sycophantic
- Force patterns into every response
- Skip the hard questions about what NOT to do
${auditSection}`;
}
