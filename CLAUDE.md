# Gist - Project Memory

> A web standard and toolset for making product design decisions readable to AI tools.

## Project Overview

- **Domain:** gist.design
- **Stack:** Next.js 14+, TypeScript, Tailwind CSS, Claude API
- **Purpose:** Generate structured `.gist.design` files from conversational design decisions
- **Distribution:** Two channels — Claude Code skill (primary for developers) + web app at /create (for non-developers)
- **Claude Code skill:** `skills/gist-design/` subfolder (SKILL.md + references/) — isolated from web app

## Key Files

- `src/app/page.tsx` - Landing page (dual-channel hero, generate section, integrations, principles)
- `src/app/about/page.tsx` - About page
- `src/app/create/page.tsx` - Main app: chat + file preview (two-panel layout)
- `src/app/api/chat/route.ts` - API route (create-only)
- `src/types/index.ts` - Message, IdentifiedPatternInMessage
- `src/types/file.ts` - GistDesignFile, Feature, BeforeAfterItem, EntryState
- `src/types/patterns.ts` - Pattern type definitions
- `src/lib/createPrompt.ts` - System prompt, initial state, initial messages
- `src/lib/fileParser.ts` - Parses `<file_update>`, `<before_after_update>`, `<pattern_identified>`
- `src/lib/export/markdown.ts` - Generates .gist.design markdown
- `src/lib/export/developerBrief.ts` - Generates developer brief
- `src/lib/patterns/` - Pattern data loader and matcher
- `src/data/patterns.json` - All 28 AI UX patterns
- `src/components/Create/` - FileContainer, ProductOverviewSection, FeatureSection, etc.
- `src/components/PatternCard.tsx` - Pattern identification cards
- `src/components/Toast.tsx` - Toast notifications

## Architecture Notes

- Single tool: Create (generates `.gist.design` files)
- Two-panel layout: Chat (left 40%), File Preview (right 60%)
- AI responses contain XML tags: `<file_update>`, `<before_after_update>`, `<pattern_identified>`
- PatternCard appears inline in chat when AI identifies relevant patterns
- Mock mode (`MOCK_MODE=true`) for testing without API key
- Entry state selection (building-new vs existing-product) before first message
- API route accepts `fileState` + `currentFeatureId` for context injection, uses `max_tokens: 4096`

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
```

## Recent Sessions

### Session 2026-03-10 20:40 (MacBook)

- **Pattern:** General updates
- **Status:** Work in progress
- **Files Changed:** 20
- **Tests Added/Modified:** 1
- **Notes:** Built audit-to-fix flow: after audit completes, floating CTA bar leads to progressive gap-fixer (one question per gap, sorted by severity). Removed standalone /create flow and chat drawer — audit-only MVP. Added draftFile pre-fill from audit analysis, editable fields with gap highlights, download + copy-to-clipboard + setup instructions on done screen, and LLM benefits section (stops blending, prevents fabrication, improves codegen, accurate recommendations).

### Session 2026-03-09 17:25 (MacBook)

- **Pattern:** General updates
- **Status:** Work in progress
- **Files Changed:** 7
- **Tests Added/Modified:** 0
- **Notes:** Redesigned audit results UI: gaps now display as a single sorted table (Issue/Fix/Severity columns) instead of grouped card lists. Removed hero title/description and gradient background when audit is active for clean transition. Widened audit layout to max-w-7xl. Improved summary bar with 4-column grid metrics, larger font sizes, and more padding throughout all audit components.

### Session 2026-03-09 16:58 (MacBook)

- **Pattern:** General updates
- **Status:** Work in progress
- **Files Changed:** 3
- **Tests Added/Modified:** 0
- **Notes:** Fixed audit false positives: scraper was stripping nav/header/svg/aria-hidden elements which removed real interactive features (search, filters). Analysis prompt now warns that scraped content is partial and won't flag plausible features as fabricated. LLM errors (like ChatGPT 429) now passed as explicit exclusion markers to analysis instead of empty strings.

### Session 2026-03-09 16:42 (MacBook)

- **Pattern:** General updates
- **Status:** Work in progress
- **Files Changed:** 11
- **Tests Added/Modified:** 0
- **Notes:** Tech debt cleanup: deleted stale TODO.md, dead /audit route, unused simple-icons dep, dead queryPerplexity code, legacy PatternCard props, dead nav links. Polished Claude Code skill (SKILL.md): added detailed audit scoring rubric, quality checklist (11 checks), common mistakes section, product type guidance (SaaS/CLI/API/mobile/AI-native/plugins), better quick mode (reads repo first, generates 2-3 features), fixed file writing to use Write tool. Upgraded Spark Mail example with Positioning and Context sections.

### Session 2026-03-04 17:45 (MacBook)

- **Pattern:** General updates
- **Status:** Work in progress
- **Files Changed:** 15
- **Tests Added/Modified:** 0
- **Notes:** Made gist-design skill distributable and useful for others. Renamed skill/ → skills/gist-design/ for Agent Skills convention. Added quick mode (/gist-design quick for 2-3 turn generation), default-to-audit behavior, argument-hint, and developer-natural trigger phrases to SKILL.md. Wrote 3 new example .gist.design files (Linear, v0, Raycast) with before/after showcase. Created install.sh one-liner installer with sparse clone. Rewrote README with quick-start at top, collapsible before/after preview, and 3 install methods.

### Session 2026-03-02 16:35 (MacBook)

- **Pattern:** General updates
- **Status:** Work in progress
- **Files Changed:** 25
- **Tests Added/Modified:** 10
- **Notes:** Audit-first landing page rework. Moved audit flow from /audit into the homepage hero. New flow: Enter URL → email gate (before API calls) → audit runs → results + "Create gist.design" CTA. Created AuditHero (state machine), AuditEmailGate, LandingWithAudit (client wrapper). /audit now redirects to /. Marketing sections hide when audit is active. Removed Audit nav link, updated bottom CTA to "Create your gist.design file".

- **2026-02-25 12:54** | MacBook | Files: 4 | Tests: 0
  - **Notes:** Added Heroicons to file preview section headings (Product Overview, Positioning, Context, Features). Replaced empty features placeholder with "What gets captured" section showing the 6 feature dimensions (Intent, Interaction model, Design decisions, Patterns, Constraints, States) with icons and descriptions.
- **2026-02-25 12:27** | MacBook | Files: 20 | Tests: 0
  - **Notes:** Added email-gated usage limit to prevent API abuse. Stateless HMAC approach (no database): 1 free gist file, then email verification via Resend 6-digit code to continue. Added PRD paste entry state, open questions, constraints, and design decisions to file format. EmailGate modal component, auth API routes, email validation with disposable domain blocking and honeypot. Set up HMAC_SECRET, RESEND_API_KEY, RESEND_FROM_EMAIL env vars locally and on Vercel.
- **2026-02-25 01:14** | MacBook | Files: 1 | Tests: 0
  - **Notes:** Changed hero CTA from "Run free audit" to "Create your gist.design" as the primary button. Verified Vercel production has ANTHROPIC_API_KEY set and MOCK_MODE off so live Claude API works for users.
- **2026-02-23 11:04** | MacBook | Files: 4 | Tests: 0
  - **Notes:** Deployed gist to Vercel at www.gist.design. Set Anthropic and OpenAI API keys. Optimized audit API to avoid 60s timeout: switched analysis model from Sonnet to Haiku, truncated inputs to analysis prompt, reduced max_tokens, made Perplexity gracefully optional.
- **2026-02-18 12:09** | MacBook | Files: 1 | Tests: 0
  - **Notes:** Rewrote README.md from scratch. Old version referenced removed Brief/Map/Rationale modes. New version reflects gist.design positioning, dual distribution (Claude Code skill + web app), file format overview, tool integration table, and 36 AI UX patterns.
- **2026-02-18 12:01** | MacBook | Files: 6 | Tests: 0
  - **Notes:** Added Claude Code skill to repo (SKILL.md + references/). Three entry states: create, fix, and audit (reads project files, describes product as AI would, scores readability, highlights gaps). Includes verify flow for before/after comparison and role-adaptive conversation. Updated all GitHub skill links from gist-design-skill to imsaif/gist. Added MIT LICENSE.
- **2026-02-18 11:36** | MacBook | Files: 3 | Tests: 0
  - **Notes:** Added dual-channel distribution to landing page: "Generate your gist.design file" section with Claude Code skill (editor) and web app (browser) cards, "Works with Figma MCP" callout, updated Integrations Claude Code entry with skill link, added GitHub icon CTA in hero alongside audit. Created /about page.
- **2026-02-17 19:20** | MacBook | Files: 3 | Tests: 0
  - **Notes:** Added full glassmorphism treatment to landing page. Created glass CSS variables and utility classes (.glass, .glass-strong, .glass-subtle, .glass-nav, .ambient-orb). Applied frosted glass surfaces with luminous borders to all cards, tables, nav, bento grid, CTA, and HowItWorks illustrations. Added ambient glow orbs behind each section. Increased hero section height for breathing room.
- **2026-02-17 18:00** | MacBook | Files: 30 | Tests: 0
  - **Notes:** Redesigned landing page with Landio-style tall cards for "How it works" and "Who this is for" sections. Added audit feature with LLM verification flow, export panel updates, and prompt enhancements.
- **2026-02-11 22:38** | MacBook | Files: 4 | Tests: 0
  - **Notes:** Updated landing page copy for dual audience (AI coding tools + LLMs). Added AEO (AI Engine Optimization) framing throughout Background, Proposal, llms.txt, Format, and Generate sections. Added "What this file solves" failure-mode table. Removed all em dashes from page copy.
- **2026-02-11 22:04** | MacBook | Files: 77 | Tests: 0
  - **Notes:** Major refactor: removed all old skills (Brief, Map, Critique, etc.), updated .gist.design file format with Positioning, Context, Goal, and Core Anxiety fields across types/parser/prompt/export/components. Rebuilt landing page as long-form documentation/spec page. Improved text accessibility (WCAG AAA contrast) and restored hero gradient background.
