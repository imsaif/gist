# Gist - Project Memory

> A thinking partner for designers. Think before you design. Know what works.

## Project Overview

- **Domain:** gist.design
- **Stack:** Next.js 14+, TypeScript, Tailwind CSS, Claude API
- **Purpose:** Help designers clarify what they're building before opening Figma

## Recent Sessions

### Session: January 13, 2026 (MacBook) - Landing Page Redesign

- **Files changed:** 19
- **Pattern:** Landing page and branding
- **Notes:** Redesigned landing page with absurd.design illustrations, side-by-side hero layout, and Heroicons for value props. Updated branding to match aiuxdesign.guide (Satoshi font, dark slate colors). Fixed text accessibility (WCAG AA compliance). Added mode switcher to chat header.

### Session: January 13, 2026 (MacBook) - Pattern System

- **Files changed:** 12
- **Pattern:** Pattern identification system
- **Notes:** Built complete pattern system with 28 AI UX patterns across 7 categories. Created PatternCard component for inline display in chat, pattern matching logic (keyword + semantic), and updated system prompt with pattern identification instructions. Patterns now appear during conversation and can be added to brief.

### Session: January 12, 2026 (MacBook) - Code Quality Setup

- **Files changed:** 21
- **Pattern:** Code quality tooling
- **Notes:** Set up Prettier with Tailwind plugin, configured Husky pre-commit hooks with lint-staged, created .env.example. Formatted entire codebase. All commits now auto-lint and format staged files.

### Session: January 12, 2025 (MacBook) - Initial Scaffold

- **Files changed:** 18
- **Pattern:** Initial scaffold + Mode selection UI
- **Notes:** Scaffolded Gist MVP from spec v1. Built chat interface with brief state management, document cards (Claude-style), modal viewer, toast notifications, and mock mode for local testing. Added mode selection UI with 5 modes (Brief active, others coming soon). Moved chat to /brief route.

## Key Files

- `src/app/page.tsx` - Landing page with mode selection
- `src/app/brief/page.tsx` - Brief mode chat interface
- `src/lib/constants.ts` - System prompt and initial states
- `src/lib/briefParser.ts` - Parse AI responses for brief updates
- `src/components/Brief/` - Document cards, modal viewer
- `src/components/Modes/` - Mode selection components
- `src/components/Chat/PatternCard.tsx` - Pattern identification cards
- `src/lib/patterns/` - Pattern data loader and matcher
- `src/data/patterns.json` - All 28 AI UX patterns
- `TODO.md` - Comprehensive task list from v2 spec

## Architecture Notes

- Two-panel layout: Chat (left), Brief/Files (right)
- AI responses contain `<brief_update>` JSON tags for state updates
- AI responses can contain `<pattern_identified>` JSON tags for pattern cards
- Document cards show files with hover actions (copy, download)
- PatternCard appears inline in chat when AI identifies relevant patterns
- Mock mode (`MOCK_MODE=true`) for testing without API key

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
```
