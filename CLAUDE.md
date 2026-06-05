# Gist - Project Memory

> A web standard and toolset for making product design decisions readable to AI tools.

## Project Overview

- **Domain:** gist.design
- **Stack:** Next.js 14+, TypeScript, Tailwind CSS, Claude API
- **Purpose:** Audit how AI tools describe your product and generate a `.gist` file (open format) that fixes the gaps
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
- `src/lib/export/markdown.ts` - Generates .gist markdown
- `src/lib/export/developerBrief.ts` - Generates developer brief
- `src/lib/patterns/` - Pattern data loader and matcher
- `src/data/patterns.json` - All 28 AI UX patterns
- `src/components/Create/` - FileContainer, ProductOverviewSection, FeatureSection, etc.
- `src/components/PatternCard.tsx` - Pattern identification cards
- `src/components/Toast.tsx` - Toast notifications

## Architecture Notes

- Single tool: Create (generates `.gist` files)
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

## Session History

Full per-session history lives in **`docs/SESSION-LOG.md`** (not auto-loaded, to keep this file lean).
`/save` appends a terse summary there. Read it only when you need historical context.
