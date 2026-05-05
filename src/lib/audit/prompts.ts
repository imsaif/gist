import { GapAnalysis, DraftFile } from '@/types/audit';

// ============================================
// Audit Prompt (sent to each LLM)
// ============================================

export interface ProductContext {
  name?: string;
  description?: string;
}

export function buildAuditPrompt(
  url: string,
  siteContent: string,
  context?: ProductContext
): string {
  const contextBlock =
    context?.name || context?.description
      ? `Product context (provided by the founder):
${context.name ? `- Name: ${context.name}\n` : ''}${context.description ? `- One-line description: ${context.description}\n` : ''}
---

`
      : '';

  return `I'm evaluating how well AI tools can understand this product from its public website. ${contextBlock}Based on the following website content from ${url}, please answer these questions:

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
// Analysis Prompt (Claude conflict detection)
// ============================================

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '\n[truncated]';
}

export function buildAnalysisPrompt(
  siteContent: string,
  chatgptResponse: string,
  claudeResponse: string,
  context?: ProductContext
): string {
  const founderBlock =
    context?.name || context?.description
      ? `## Founder's stated framing

${context.name ? `- Name: ${context.name}\n` : ''}${context.description ? `- One-line description: ${context.description}\n` : ''}
Use this as ground truth for what the product calls itself and how it's positioned. If an LLM contradicts this framing, that's a real conflict (category_conflict / audience_mismatch / contradiction as appropriate).

`
      : '';

  return `You are a cross-model conflict detector. Two LLMs were given the same product website and asked to describe it. Your job is to find where they **contradict each other** or **contradict the actual website content**.

${founderBlock}

You are NOT looking for what's missing. You are looking for what's WRONG or CONFLICTING.

## Website content (partial reference):

${truncate(siteContent, 5000)}

## ChatGPT's response:

${truncate(chatgptResponse, 2000)}

## Claude's response:

${truncate(claudeResponse, 2000)}

## Your task

Compare the two LLM responses against each other and against the website content. Only flag REAL conflicts:

### Conflict categories:

- **contradiction**: ChatGPT and Claude give conflicting answers about the same aspect (e.g., one says free, the other says paid; one says it's for developers, the other says it's for designers)
- **fabrication**: An LLM describes a feature or capability that clearly does NOT exist based on the website content and is NOT a plausible interactive element
- **category_conflict**: The LLMs place the product in fundamentally different categories (e.g., one calls it a CRM, the other calls it a project management tool)
- **shared_inaccuracy**: Both LLMs agree on something that clearly contradicts the website content
- **audience_mismatch**: The LLMs describe different or wrong target audiences (e.g., one says "enterprises", the other says "small teams", or both describe an audience that doesn't match the site)
- **missing_differentiator**: BOTH LLMs produce generic descriptions that could apply to any competitor in the same category. Neither can explain what makes this product unique. Only flag this when both descriptions are interchangeable with competitors — not when one LLM is more specific than the other.
- **pricing_confusion**: LLMs guess, contradict, or get wrong the pricing or availability (e.g., one says free, the site says $29/mo; or one invents pricing tiers)

### What is NOT a conflict:

- One LLM mentioning something the other didn't → NOT a conflict (just different detail levels)
- Both LLMs being vague about one aspect → NOT a conflict (unless it's the product's core differentiator)
- Missing information about boundaries, decisions, or positioning → NOT a conflict
- LLMs describing plausible interactive features not in the scraped text → NOT a conflict (the scraper misses interactive UI)

### Severity:

- **critical**: Fundamentally wrong about what the product IS or DOES
- **high**: Significant factual error that would mislead users
- **medium**: Minor disagreement or inaccuracy

### Scoring:

- **Good**: 0 conflicts, or only 1 medium conflict. Both LLMs agree and match the site.
- **Partial**: 1-2 conflicts with at most 1 high/critical
- **Poor**: 3+ conflicts, or 2+ critical

### Evidence:

For each conflict, include direct quotes showing what each model said. This is critical — users need to see the actual disagreement.

Also extract a "draftFile" — your best guess at structured product info based on what the LLMs described. Use null for fields you can't determine.

Respond with ONLY valid JSON matching this exact structure (no markdown, no code fences):

${JSON.stringify(
  {
    gaps: [
      {
        id: 'conflict-1',
        severity: 'critical',
        category: 'contradiction',
        description: 'Clear description of the conflict',
        modelsAffected: ['chatgpt', 'claude'],
        whatFileNeeds: 'What a .gist file should include to fix this',
        evidence: {
          chatgptSays: 'Direct quote from ChatGPT response',
          claudeSays: 'Direct quote from Claude response',
          siteContent: 'What the site actually says (if relevant)',
        },
      },
    ],
    summary: {
      totalGaps: 1,
      criticalGaps: 1,
      readabilityScore: 'Poor',
      worstModel: 'chatgpt',
      bestModel: 'claude',
    },
    draftFile: {
      product: {
        name: 'Product name',
        description: 'What LLMs agree the product does',
        audience: 'Who LLMs agree it is for',
      },
      positioning: {
        category: 'Agreed category (or best guess)',
        forWho: 'Target audience',
        notForWho: null,
      },
      context: {
        pricing: null,
        stage: null,
      },
    } satisfies DraftFile,
  } satisfies GapAnalysis,
  null,
  2
)}

Rules:
- If both LLMs agree and match the site content, return an EMPTY gaps array and score "Good". Do NOT invent conflicts.
- Include direct quotes in the evidence fields — short, specific phrases showing the disagreement
- evidence.siteContent is optional — only include when the site content directly contradicts an LLM claim
- worstModel = the model with more conflicts; bestModel = the model with fewer
- If an LLM errored out, exclude it from analysis entirely
- Err heavily on the side of fewer conflicts. Only flag genuine disagreements.`;
}

// ============================================
// Mock Analysis
// ============================================

export function getMockAnalysis(): GapAnalysis {
  return {
    gaps: [
      {
        id: 'conflict-1',
        severity: 'critical',
        category: 'category_conflict',
        description:
          'ChatGPT categorizes the product as a "project management tool" while Claude describes it as a "productivity and collaboration platform." These are meaningfully different product categories that would lead to different competitor comparisons.',
        modelsAffected: ['chatgpt', 'claude'],
        whatFileNeeds:
          'Positioning section with explicit product category and "not this" statements to prevent category confusion.',
        evidence: {
          chatgptSays: 'a project management tool that helps teams organize their work',
          claudeSays:
            'a productivity and project management solution... a workspace for teams to coordinate their efforts',
          siteContent: null,
        },
      },
      {
        id: 'conflict-2',
        severity: 'high',
        category: 'fabrication',
        description:
          'ChatGPT claims the product includes "Kanban boards, time tracking, and built-in chat" but these specific features are not mentioned on the website and Claude does not reference them either.',
        modelsAffected: ['chatgpt'],
        whatFileNeeds:
          "Product overview with explicit feature list so LLMs don't invent capabilities.",
        evidence: {
          chatgptSays:
            'Kanban boards, time tracking, built-in chat, Integration with Slack and GitHub',
          claudeSays:
            'Task organization and tracking, Real-time collaboration features, Automated workflows',
          siteContent: 'helps teams manage projects and collaborate effectively',
        },
      },
      {
        id: 'conflict-3',
        severity: 'high',
        category: 'audience_mismatch',
        description:
          'ChatGPT describes the product as targeting "small to medium businesses" while Claude says it\'s for "professional teams" broadly. The site doesn\'t specify team size.',
        modelsAffected: ['chatgpt', 'claude'],
        whatFileNeeds:
          'Clear audience definition specifying who the product is for and who it is NOT for.',
        evidence: {
          chatgptSays: 'designed for small to medium businesses',
          claudeSays: 'professional teams who need to coordinate complex projects',
          siteContent: null,
        },
      },
      {
        id: 'conflict-4',
        severity: 'medium',
        category: 'missing_differentiator',
        description:
          'Both LLMs describe the product generically as a "task tracking and collaboration tool." Neither can explain what makes it different from Asana, Trello, or Monday.com. The descriptions are interchangeable.',
        modelsAffected: ['chatgpt', 'claude'],
        whatFileNeeds:
          'A clear differentiator: what this product does differently from competitors and why someone would choose it.',
        evidence: {
          chatgptSays:
            'helps teams organize their work... task tracking, team collaboration, and workflow automation',
          claudeSays:
            'Task organization and tracking, Real-time collaboration features, Automated workflows',
          siteContent: null,
        },
      },
      {
        id: 'conflict-5',
        severity: 'medium',
        category: 'pricing_confusion',
        description:
          'ChatGPT guesses the product is "probably freemium" while Claude doesn\'t mention pricing. The site doesn\'t clearly state pricing either, leaving LLMs to guess.',
        modelsAffected: ['chatgpt'],
        whatFileNeeds: "Explicit pricing information so LLMs don't guess or invent pricing tiers.",
        evidence: {
          chatgptSays: 'Pricing is probably freemium with paid tiers for advanced features',
          claudeSays: null,
          siteContent: null,
        },
      },
    ],
    summary: {
      totalGaps: 5,
      criticalGaps: 1,
      readabilityScore: 'Poor',
      worstModel: 'chatgpt',
      bestModel: 'claude',
    },
    draftFile: {
      product: {
        name: 'Mock Product',
        description:
          'A project management tool that helps teams organize work, track tasks, and collaborate effectively.',
        audience: 'Teams and organizations',
      },
      positioning: {
        category: 'Project management',
        forWho: 'Teams who need to organize and track work',
        notForWho: null,
      },
      context: {
        pricing: null,
        stage: null,
      },
    },
  };
}

// Keep backward-compatible export for getMockLLMResponse
export function getMockLLMResponse(provider: 'chatgpt' | 'claude') {
  const responses = {
    chatgpt: {
      model: 'chatgpt' as const,
      content: `This product appears to be a project management tool that helps teams organize their work. It likely offers features like task tracking, team collaboration, and workflow automation. The tool seems designed for small to medium businesses looking for a streamlined way to manage projects.

Key features:
- Task management with Kanban boards
- Team collaboration and built-in chat
- Workflow automation
- Time tracking and reporting
- Integration with popular tools`,
      durationMs: 2100,
    },
    claude: {
      model: 'claude' as const,
      content: `Based on the website content, this appears to be a productivity and project management solution. The product offers a workspace for teams to coordinate their efforts.

Core capabilities seem to include:
- Task organization and tracking
- Real-time collaboration features
- Automated workflows
- Reporting and analytics
- Cross-platform availability`,
      durationMs: 3400,
    },
  };
  return responses[provider];
}
