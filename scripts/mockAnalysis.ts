/**
 * Varied mock audit output for the gallery build. Each company gets a
 * different headline + evidence seeded off its slug so the grid doesn't look
 * like 25 identical cards. Only used when --mock is passed to build-gallery.
 */
import type {
  GapAnalysis,
  Gap,
  GapCategory,
  GapSeverity,
  LLMProvider,
  DraftFile,
} from '../src/types/audit';

interface MockCompany {
  slug: string;
  name: string;
  url: string;
}

interface Template {
  category: GapCategory;
  severity: GapSeverity;
  description: (c: MockCompany) => string;
  chatgpt: (c: MockCompany) => string;
  claude: (c: MockCompany) => string;
  site: (c: MockCompany) => string;
  whatFileNeeds: string;
  models: LLMProvider[];
}

const TEMPLATES: Template[] = [
  {
    category: 'fabrication',
    severity: 'critical',
    description: (c) =>
      `ChatGPT invents a feature ${c.name} doesn't ship — claiming built-in video chat and AI meeting summaries that aren't on the product.`,
    chatgpt: (c) =>
      `${c.name} includes built-in video chat, AI-generated meeting summaries, and a native calendar sync out of the box.`,
    claude: (c) =>
      `${c.name} is focused on structured work; video and calendar are handled via integrations.`,
    site: () => `We focus on one thing. Integrations available via our API.`,
    whatFileNeeds: 'Add a NotThis section listing features the product deliberately does not ship.',
    models: ['chatgpt'],
  },
  {
    category: 'category_conflict',
    severity: 'critical',
    description: (c) =>
      `ChatGPT categorises ${c.name} as a "project management tool" while Claude describes it as a "design collaboration platform." The two positions imply different competitor sets and different buyers.`,
    chatgpt: (c) => `${c.name} is a project management tool for engineering teams.`,
    claude: (c) => `${c.name} is a design collaboration and prototyping platform.`,
    site: (c) => `${c.name} — the single source of truth for your product team.`,
    whatFileNeeds: 'Positioning section with explicit category and "not this" statements.',
    models: ['chatgpt', 'claude'],
  },
  {
    category: 'audience_mismatch',
    severity: 'high',
    description: (c) =>
      `Both models describe ${c.name} as an enterprise tool, but the site targets solo founders and small teams. Wrong buyer gets recommended.`,
    chatgpt: (c) => `${c.name} is built for large engineering organisations and Fortune 500 teams.`,
    claude: (c) => `${c.name} is suited to enterprise adoption with SSO and advanced RBAC.`,
    site: () => `Built for founders and teams of 1–20. Priced accordingly.`,
    whatFileNeeds: 'Positioning: forWho and notForWho, with concrete team-size ranges.',
    models: ['chatgpt', 'claude'],
  },
  {
    category: 'missing_differentiator',
    severity: 'high',
    description: (c) =>
      `Neither model names ${c.name}'s actual differentiator — the audit layer that catches AI hallucinations before they ship. Both models describe it as "another dev tool."`,
    chatgpt: (c) => `${c.name} is one of many dev tools in the space, similar to its peers.`,
    claude: (c) => `${c.name} offers a standard set of developer-productivity features.`,
    site: (c) => `${c.name} is the only tool that checks AI outputs against your design decisions.`,
    whatFileNeeds: 'Positioning: explicit comparisons vs 2–3 well-known alternatives.',
    models: ['chatgpt', 'claude'],
  },
  {
    category: 'pricing_confusion',
    severity: 'high',
    description: (c) =>
      `ChatGPT says ${c.name} is free, Claude says it's $99/month enterprise-only. The truth is a freemium model with a $29 pro tier.`,
    chatgpt: () => `It's a free tool with no paid tiers.`,
    claude: () => `Pricing starts at $99 per user per month for teams.`,
    site: () => `Free to start. Pro is $29/month. Team is $99/month.`,
    whatFileNeeds: 'Context.pricing with the real tier structure written in one sentence.',
    models: ['chatgpt', 'claude'],
  },
  {
    category: 'contradiction',
    severity: 'high',
    description: (c) =>
      `ChatGPT says ${c.name} is self-hosted, Claude says it's cloud-only. The site says both are available.`,
    chatgpt: (c) => `${c.name} runs entirely on your own infrastructure, self-hosted.`,
    claude: (c) => `${c.name} is a cloud-only SaaS with no self-hosting option.`,
    site: () => `Deploy in the cloud or self-host. Your call.`,
    whatFileNeeds: 'Context: deployment options listed plainly.',
    models: ['chatgpt', 'claude'],
  },
  {
    category: 'shared_inaccuracy',
    severity: 'high',
    description: (c) =>
      `Both models claim ${c.name} has a Slack integration that has never existed on the product.`,
    chatgpt: () => `Integrates natively with Slack for notifications and commands.`,
    claude: () => `Supports Slack out of the box.`,
    site: () => `Our integrations: GitHub, Linear, Figma. Slack via Zapier.`,
    whatFileNeeds: 'Add Slack to NotThis until a first-party integration ships.',
    models: ['chatgpt', 'claude'],
  },
];

function seededPick<T>(slug: string, arr: T[]): T {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return arr[h % arr.length];
}

function seededShuffle<T>(slug: string, arr: T[]): T[] {
  const copy = arr.slice();
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  for (let i = copy.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) >>> 0;
    const j = h % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function buildMockAnalysis(company: MockCompany): GapAnalysis {
  // Pick 3–5 gaps for this company, always including a "headline" template so
  // the detail page has something to quote.
  const shuffled = seededShuffle(company.slug, TEMPLATES);
  const count = 3 + (company.slug.length % 3); // 3, 4, or 5
  const picked = shuffled.slice(0, count);

  const gaps: Gap[] = picked.map((t, i) => ({
    id: `${company.slug}-gap-${i + 1}`,
    severity: t.severity,
    category: t.category,
    description: t.description(company),
    modelsAffected: t.models,
    whatFileNeeds: t.whatFileNeeds,
    evidence: {
      chatgptSays: t.chatgpt(company),
      claudeSays: t.claude(company),
      siteContent: t.site(company),
    },
  }));

  const criticalGaps = gaps.filter((g) => g.severity === 'critical').length;
  const readabilityScore = criticalGaps >= 2 ? 'Poor' : criticalGaps === 1 ? 'Partial' : 'Good';

  const draftFile: DraftFile = {
    product: {
      name: company.name,
      description: `${company.name} — the single source of truth for how AI models should describe this product.`,
      audience: seededPick(company.slug, [
        'solo founders and small teams',
        'developer-first teams shipping AI-native products',
        'product teams that care about getting recommended',
        'founders who already have users and want to keep them',
      ]),
    },
    positioning: {
      category: seededPick(company.slug, [
        'developer tool',
        'design collaboration platform',
        'product analytics',
        'AI visibility toolkit',
        'workflow automation',
      ]),
      forWho: 'teams of 1–20 people',
      notForWho: 'Fortune 500 enterprises or regulated industries',
    },
    context: {
      pricing: 'Free to start. Pro $29/month. Team $99/month.',
      stage: seededPick(company.slug, ['early', 'growing', 'established']),
    },
  };

  return {
    gaps,
    summary: {
      totalGaps: gaps.length,
      criticalGaps,
      readabilityScore,
      worstModel: 'chatgpt',
      bestModel: 'claude',
    },
    draftFile,
  };
}
