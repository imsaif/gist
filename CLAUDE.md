# Gist - Project Memory

> A thinking partner for designers. Think before you design. Know what works.

## Project Overview

- **Domain:** gist.design
- **Stack:** Next.js 14+, TypeScript, Tailwind CSS, Claude API
- **Purpose:** Help designers clarify what they're building before opening Figma

## Recent Sessions

### Session: February 6, 2026 (MacBook) - Chat-First Landing Page Redesign

- **Files changed:** 6
- **Pattern:** Landing page redesign
- **Notes:** Replaced 2x3 mode card grid with Claude.ai-style chat-first interface. Added centered chat input with send button, 5 mode pills (Brief, Map, Critique, Stakeholder, IA) with starter prompt dropdowns, cycling "Gist/Think before you design" hero text, and ?q= query param support for all mode pages (chat, critique, stakeholder, ia). Pills show @Mode prefix in input and display contextual prompts below.

### Session: February 1, 2026 (MacBook) - Six Modes Restructure

- **Files changed:** 34
- **Pattern:** Multi-mode architecture
- **Notes:** Replaced 3-mode structure (Brief, Map, Rationale) with 6 modes: Chat (auto-detect), Brief, Map, Critique, Stakeholder, and IA. Removed Rationale mode completely. Created new parsers, components, and pages for Critique, Stakeholder, and IA modes. Added general Chat mode with auto-detection. Redesigned landing page to minimal centered layout with 2x3 card grid. Updated mode switcher in all pages.

### Session: January 30, 2026 (MacBook) - Three Modes Implementation

- **Files changed:** 22
- **Pattern:** Multi-mode architecture
- **Notes:** Implemented three-mode redesign: Brief (existing), Map (new), and Rationale (new). Added types, parsers, system prompts, and components for each mode. Created DesignMap and Rationale component libraries. Updated landing page with side-by-side layout (mode cards left, illustration right). Replaced all emojis with Heroicons across mode dropdowns.

### Session: January 19, 2026 (MacBook) - Chat-First Landing Page

- **Files changed:** 2
- **Pattern:** Landing page redesign
- **Notes:** Redesigned landing page with chat-first interface. Added AI greeting bubble, large input field with rotating placeholder, and clickable prompt chips. Implemented URL query param routing to pass initial message to brief page. Added Suspense boundary for useSearchParams. Kept illustration and value props sections.

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

- `src/app/page.tsx` - Landing page with chat input and mode pills
- `src/app/chat/page.tsx` - General chat with auto-detect mode
- `src/app/brief/page.tsx` - Brief mode chat interface
- `src/app/map/page.tsx` - Map mode for user journey flows
- `src/app/critique/page.tsx` - Critique mode for design feedback
- `src/app/stakeholder/page.tsx` - Stakeholder prep mode
- `src/app/ia/page.tsx` - Information architecture mode
- `src/lib/constants.ts` - System prompts and initial states for all modes
- `src/lib/briefParser.ts` - Parse AI responses for brief updates
- `src/lib/designMapParser.ts` - Parse AI responses for map updates
- `src/lib/critiqueParser.ts` - Parse AI responses for critique updates
- `src/lib/stakeholderParser.ts` - Parse AI responses for stakeholder updates
- `src/lib/iaParser.ts` - Parse AI responses for IA updates
- `src/components/Brief/` - Brief document cards, modal viewer
- `src/components/DesignMap/` - Map panel, flow timeline, step cards
- `src/components/Critique/` - Critique panel, issue cards, image upload
- `src/components/Stakeholder/` - Stakeholder panel, objection cards
- `src/components/IA/` - IA panel, content tree, navigation preview
- `src/components/Chat/PatternCard.tsx` - Pattern identification cards
- `src/lib/patterns/` - Pattern data loader and matcher
- `src/data/patterns.json` - All 28 AI UX patterns

## Architecture Notes

- Six modes: Chat (auto-detect), Brief, Map, Critique, Stakeholder, IA
- Two-panel layout: Chat (left), Artifact (right) - artifact varies by mode
- Chat mode uses single-panel centered layout with mode suggestions
- AI responses contain mode-specific XML tags:
  - Brief: `<brief_update>` for brief state updates
  - Map: `<designmap_update>` for flow step updates
  - Critique: `<critique_update>` for issue updates
  - Stakeholder: `<stakeholder_update>` for objection updates
  - IA: `<ia_update>` for content/navigation updates
  - Chat: `<mode_suggestion>` for mode recommendations
- AI responses can contain `<pattern_identified>` JSON tags for pattern cards
- PatternCard appears inline in chat when AI identifies relevant patterns
- Mock mode (`MOCK_MODE=true`) for testing without API key

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
```
