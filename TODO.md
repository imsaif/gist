# Gist v2 - Implementation TODO

> Last updated: January 2025
> Spec: gist-mvp-spec-v2.md
> Domain: gist.design

---

## Current Status

**Completed:**
- [x] Project setup (Next.js, TypeScript, Tailwind)
- [x] Basic chat interface
- [x] Brief state management
- [x] Brief parser (extracts `<brief_update>` from AI responses)
- [x] Document cards (Claude-style file cards)
- [x] Modal document viewer
- [x] Copy/download per document
- [x] Toast notifications
- [x] Mock mode for local testing

**In Progress:**
- [ ] Phase 1: Core MVP with pattern identification

---

## Phase 1: Core MVP (Priority: P0)

### 1.1 Landing Page & Mode Selection
- [x] Create landing page with Gist branding
- [x] Mode selection UI (5 cards: Brief, Critique, Research, Stakeholder, IA)
- [x] "Start from template" link
- [x] Responsive design

**Files:**
- `app/page.tsx` - Mode selection landing page ✓
- `app/brief/page.tsx` - Brief mode chat ✓
- `components/Modes/ModeSelector.tsx` ✓
- `components/Modes/ModeCard.tsx` ✓

### 1.2 Pattern System
- [ ] Create pattern data structure
- [ ] Add all 28 patterns to `data/patterns.json`
- [ ] Pattern categories (Trust, Control, Feedback, Error, Onboarding, I/O, Collab)
- [ ] Pattern matching logic (`lib/patterns/matcher.ts`)
- [ ] Pattern identification in AI responses (`<pattern_identified>` tags)

**Files:**
- `types/patterns.ts` - Pattern interfaces
- `data/patterns.json` - All 28 patterns
- `lib/patterns/patterns.ts` - Pattern data loader
- `lib/patterns/matcher.ts` - Keyword matching logic

### 1.3 Pattern Cards in Chat
- [ ] PatternCard component (inline in conversation)
- [ ] "See examples" button (links to aiuxdesign.guide)
- [ ] "Add to brief" button
- [ ] Pattern category colors

**Files:**
- `components/Chat/PatternCard.tsx`

### 1.4 Enhanced Brief Artifact
- [ ] Update Brief type with new fields (patterns, successCriteria)
- [ ] Recommended Patterns section in artifact
- [ ] Success Criteria section
- [ ] Pattern links in export

**Files:**
- `types/index.ts` - Update Brief interface
- `components/Brief/BriefModal.tsx` - Add pattern section

### 1.5 Updated System Prompt
- [ ] Add pattern identification instructions
- [ ] Add `<pattern_identified>` format
- [ ] Include pattern data in prompt
- [ ] Update brief_update format

**Files:**
- `lib/constants.ts` - Update SYSTEM_PROMPT

### 1.6 PDF Export
- [ ] PDF generation library (react-pdf or similar)
- [ ] Professional layout template
- [ ] Gist branding
- [ ] Pattern sections with QR codes/links

**Files:**
- `lib/export/pdf.ts`
- `app/api/export/pdf/route.ts`

---

## Phase 2: Templates

### 2.1 Template Data Structure
- [ ] Template interface
- [ ] Template categories (AI Features, Common Screens, Flows, Challenges)
- [ ] Pre-loaded context
- [ ] Relevant patterns
- [ ] Starter questions

**Files:**
- `types/templates.ts`
- `data/templates.json`

### 2.2 Initial Templates (5-10)
- [ ] AI Onboarding Flow
- [ ] AI Error Handling
- [ ] Settings Page
- [ ] Dashboard
- [ ] Empty States
- [ ] Authentication Flow
- [ ] "Stakeholder wants feature X"
- [ ] "Users don't trust output"

### 2.3 Template Selection UI
- [ ] Template browser page
- [ ] Template cards with descriptions
- [ ] "Start blank" option
- [ ] Template preview modal

**Files:**
- `app/templates/page.tsx`
- `components/Templates/TemplateCard.tsx`
- `components/Templates/TemplateGrid.tsx`

### 2.4 Template-Informed Conversations
- [ ] Load template context when selected
- [ ] Show relevant patterns upfront
- [ ] Start with template's first question

---

## Phase 3: Critique Mode

### 3.1 Image Upload
- [ ] File upload component
- [ ] Supabase Storage integration
- [ ] Image preview in chat
- [ ] Drag-and-drop support

**Files:**
- `components/Chat/ImageUpload.tsx`
- `lib/supabase/storage.ts`

### 3.2 Critique Artifact
- [ ] CritiqueArtifact interface
- [ ] What's Working section
- [ ] What's Missing section (with pattern recommendations)
- [ ] Specific Improvements
- [ ] Priority Fixes

**Files:**
- `types/artifacts.ts`
- `components/Artifact/CritiqueArtifact.tsx`

### 3.3 Critique System Prompt
- [ ] Image analysis instructions
- [ ] Pattern-based critique format
- [ ] Critique update tags

**Files:**
- `lib/ai/prompts/critique.ts`

---

## Phase 4: Additional Modes

### 4.1 Research Mode
- [ ] ResearchArtifact interface
- [ ] Assumptions section
- [ ] Research questions
- [ ] Interview script generator
- [ ] Participant criteria

**Files:**
- `app/(modes)/research/page.tsx`
- `components/Artifact/ResearchArtifact.tsx`
- `lib/ai/prompts/research.ts`

### 4.2 Stakeholder Mode
- [ ] StakeholderArtifact interface
- [ ] Objections section
- [ ] Counter-arguments
- [ ] Evidence needed
- [ ] Talking points

**Files:**
- `app/(modes)/stakeholder/page.tsx`
- `components/Artifact/StakeholderArtifact.tsx`
- `lib/ai/prompts/stakeholder.ts`

### 4.3 IA Mode
- [ ] IAArtifact interface
- [ ] Content inventory
- [ ] Hierarchy visualization
- [ ] Mermaid diagram generation
- [ ] Navigation model

**Files:**
- `app/(modes)/ia/page.tsx`
- `components/Artifact/IAArtifact.tsx`
- `lib/ai/prompts/ia.ts`

---

## Phase 5: Pro Features

### 5.1 Authentication
- [ ] Supabase Auth setup
- [ ] Login/signup pages
- [ ] Auth context provider
- [ ] Protected routes

**Files:**
- `app/login/page.tsx`
- `lib/supabase/auth.ts`
- `components/Auth/AuthProvider.tsx`

### 5.2 Session Management
- [ ] Session database schema
- [ ] Save session API
- [ ] Load session API
- [ ] Session history page

**Files:**
- `app/dashboard/page.tsx`
- `app/api/sessions/route.ts`

### 5.3 Stripe Integration
- [ ] Stripe checkout
- [ ] Webhook handling
- [ ] Usage limits for free tier
- [ ] Pro feature gating

**Files:**
- `app/pricing/page.tsx`
- `app/api/webhooks/stripe/route.ts`
- `lib/stripe/client.ts`

### 5.4 Shareable URLs
- [ ] Public session view
- [ ] Custom share URLs
- [ ] Unbranded PDF for Pro

**Files:**
- `app/s/[session-id]/page.tsx`

### 5.5 Notion Export
- [ ] Notion API integration
- [ ] Structured page creation
- [ ] Toggle sections
- [ ] Pattern link embedding

**Files:**
- `lib/export/notion.ts`
- `app/api/export/notion/route.ts`

---

## Testing Checklist

### Functional Tests
- [ ] Mode selection works
- [ ] Brief mode conversation flows correctly
- [ ] Patterns identified during conversation
- [ ] Pattern cards display properly
- [ ] Brief updates in real-time
- [ ] All export formats work
- [ ] Templates load correctly
- [ ] Mobile responsive layout
- [ ] Links to aiuxdesign.guide work

### AI Behavior Tests
- [ ] Asks clarifying questions
- [ ] Identifies patterns when relevant
- [ ] Doesn't force patterns into every response
- [ ] One question at a time
- [ ] Challenges assumptions appropriately
- [ ] Brief updates are accurate

### Edge Cases
- [ ] Empty messages handled
- [ ] API errors show friendly message
- [ ] Very long conversations handled
- [ ] Export with incomplete brief works

---

## Notes

- Pattern library URL: https://aiuxdesign.guide
- All patterns should link back to aiuxdesign.guide
- PDF exports include Gist branding (removable for Pro)
- Free tier: 5 brief sessions/month, 1 each other mode
- Pro: $15/month unlimited

---

## Quick Reference

**Start dev server:**
```bash
cd /Users/imranmohammed/gist && npm run dev
```

**Current mock mode:** `MOCK_MODE=true` in `.env.local`

**Spec file:** `/Users/imranmohammed/Downloads/gist-mvp-spec-v2.md`
