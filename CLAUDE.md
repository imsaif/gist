# Gist - Project Memory

> Generate .gist.design files that make your design decisions readable to AI coding tools.

## Project Overview

- **Domain:** gist.design
- **Stack:** Next.js 14+, TypeScript, Tailwind CSS, Claude API
- **Purpose:** Generate structured `.gist.design` files from conversational design decisions

## Key Files

- `src/app/page.tsx` - Landing page with hero animation and CTA
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

- **2026-02-17 19:20** | MacBook | Files: 3 | Tests: 0
  - **Notes:** Added full glassmorphism treatment to landing page. Created glass CSS variables and utility classes (.glass, .glass-strong, .glass-subtle, .glass-nav, .ambient-orb). Applied frosted glass surfaces with luminous borders to all cards, tables, nav, bento grid, CTA, and HowItWorks illustrations. Added ambient glow orbs behind each section. Increased hero section height for breathing room.
- **2026-02-17 18:00** | MacBook | Files: 30 | Tests: 0
  - **Notes:** Redesigned landing page with Landio-style tall cards for "How it works" and "Who this is for" sections. Added audit feature with LLM verification flow, export panel updates, and prompt enhancements.
- **2026-02-11 22:38** | MacBook | Files: 4 | Tests: 0
  - **Notes:** Updated landing page copy for dual audience (AI coding tools + LLMs). Added AEO (AI Engine Optimization) framing throughout Background, Proposal, llms.txt, Format, and Generate sections. Added "What this file solves" failure-mode table. Removed all em dashes from page copy.
- **2026-02-11 22:04** | MacBook | Files: 77 | Tests: 0
  - **Notes:** Major refactor: removed all old skills (Brief, Map, Critique, etc.), updated .gist.design file format with Positioning, Context, Goal, and Core Anxiety fields across types/parser/prompt/export/components. Rebuilt landing page as long-form documentation/spec page. Improved text accessibility (WCAG AAA contrast) and restored hero gradient background.
