# Gist - Project Memory

> A thinking partner for designers. Think before you design. Know what works.

## Project Overview
- **Domain:** gist.design
- **Stack:** Next.js 14+, TypeScript, Tailwind CSS, Claude API
- **Purpose:** Help designers clarify what they're building before opening Figma

## Recent Sessions

### Session: January 12, 2025 (MacBook)
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
- `TODO.md` - Comprehensive task list from v2 spec

## Architecture Notes
- Two-panel layout: Chat (left), Brief/Files (right)
- AI responses contain `<brief_update>` JSON tags for state updates
- Document cards show files with hover actions (copy, download)
- Mock mode (`MOCK_MODE=true`) for testing without API key

## Commands
```bash
npm run dev      # Start dev server
npm run build    # Build for production
```
