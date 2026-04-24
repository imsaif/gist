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

### Session 2026-04-24 19:52 (MacBook)

- **Pattern:** Unified site nav across landing, /audited, /spec, /about
- **Status:** Complete
- **Files Changed:** 6
- **Tests Added/Modified:** 0
- **Notes:** Extracted a shared `SiteHeader` component at `src/components/Layout/SiteHeader.tsx` with `active` prop that highlights the current section in brand colour. Wired it onto every public surface so navigation is consistent: landing (`LandingWithAudit.tsx`), `/audited` index + `/audited/[slug]` detail, `/spec`, `/about`. Nav shows Audit (→ `/`), Audited (→ `/audited`), Spec (→ `/spec`). Removed the bespoke `<header>` markup that was hand-duplicated in each page in favour of the shared component — future nav changes are one-file edits. Typecheck clean, all 5 routes return HTTP 200 after the refactor. (Metric note: `Tests Added/Modified: 1` in the auto-generated block is a false positive from the memory script — no new tests were written.)

### Session 2026-04-24 19:29 (MacBook)

- **Pattern:** Submit→Track→Improve loop + /audited gallery (post-AEO repositioning)
- **Status:** Work in progress
- **Files Changed:** 63
- **Tests Added/Modified:** 0
- **Notes:** Two major tracks in one long session. **Track 1 — Submit→Track→Improve→Refine loop (MVP):** shipped end-to-end persistent founder dashboard. Persistence: pivoted from Supabase to Turso/libsql (SQLite local via `file:./local.db`, Turso in prod). Schema: `users`, `products`, `audit_snapshots`, `mention_samples`, `improvement_actions`, `mrr_checkins` (`db/migrations/0001_init.sql`; migrate script fixed to strip leading comment lines per statement). Auth: reused existing Resend OTP, extended `verify-code` to upsert user + set httpOnly `gist_session` cookie via new `src/lib/session.ts`; added `/api/auth/logout`. Dev convenience: `MOCK_MODE=true` in `request-code` skips Resend and writes code to `/tmp/gist-dev-last-code.txt` + console. New pages: `/login` (OTP), `/onboarding` (product setup with auto-suggested MRR from `src/data/categoryBaselines.json` per category + source attribution), `/dashboard` (scorecard tiles, MRR progress with check-in input + delta, top-3 improvement cards with Done/Dismiss, mention-rate sparkline, full gap list). Loop engine: extracted pure `runAudit()` from SSE route into `src/lib/audit/runAudit.ts`; new `src/lib/mentions/runMentionSample.ts` queries ChatGPT + Claude against category prompts and detects mentions via product name or hostname (lazy-init clients to fix build-time page-data collection); new `src/lib/stats/percentile.ts` computes anonymous category percentile across all tracked products' latest snapshots. API: `/api/products` (POST create, one-per-user), `/api/snapshots/trigger` (manual re-audit), `/api/actions/[id]` PATCH (status), `/api/mrr-checkins` (POST). Cron: `/api/cron/weekly-audit` protected by `CRON_SECRET`, iterates active products, writes snapshot + top-3 actions; `vercel.json` schedules Mondays 04:00 UTC. Fixed libsql Row→plain-object mapping in dashboard server component (Next RSC rejected non-plain objects). Added "Track weekly" CTA next to "Resolve conflicts" in `AuditHero.tsx`. **Track 2 — positioning pivot + /audited gallery:** researched Product Hunt "aeo" + industry landscape (Profound $1B, Peec $21M, HubSpot AEO $50/mo, 20+ trackers). Strategic decision: explicitly NOT competing as an AEO tool — ship public gallery of 25 pre-audited founder/dev tools as distribution surfaces, each shareable. Saved repositioning memo to `~/.claude/projects/-Users-imranmohammed/memory/project_gist_repositioning.md` with do/don't list and 30-day success test (25 pages indexed, 1 audit crossing 1k social impressions, 500+ sessions, 50+ inbound audits, 1 audited company engaging). Built: `data/gallery/companies.json` (25 seeded: Linear, Notion, Figma, Vercel, Supabase, Stripe, GitHub, Cursor, Raycast, PostHog, Plausible, Resend, Turso, Railway, Fly.io, Framer, Webflow, Replit, v0, Bolt, Lovable, Gumroad, Beehiiv, Tailwind, shadcn/ui — Anthropic/OpenAI/Perplexity deliberately excluded as week-3 drops). `scripts/build-gallery.ts` iterates the list, calls `runAudit()`, writes flattened `data/gallery/results/<slug>.json` with headline (first fabrication → first critical → first gap), allGaps, draftFile, readability, counts. Flags: `--mock`, `--force`, `--only=`. Installed `simple-icons` (~3200 brand SVGs, MIT) via `src/lib/gallery/logo.ts` resolver with globe fallback for the 5 not in pack. `src/lib/gallery/loadResults.ts` reads results at build time. Pages: `/audited` grid sorted by criticalGaps desc with logo tiles + readability chips + CTA; `/audited/[slug]` with header, headline card (category-specific eyebrow), 3-col evidence row (ChatGPT/Claude/Site), full gaps table with severity + category chips, gist-patch sidebar rendering `draftFile`, score metrics, bottom CTA. OG images at both URLs via `next/og` `ImageResponse` (1200×630, brand-color logo tile, headline quote, gist.design wordmark). Updated `src/app/sitemap.ts` to emit `/audited` + 25 slug URLs. Added gallery link under landing hero in `LandingWithAudit.tsx` (kept Linear HeroResultPreview — option 1 per user). Varied mock generator: `scripts/mockAnalysis.ts` with 7 templated gap variants seeded by slug hash (3–5 gaps per company, different readability scores) so gallery doesn't look like 25 identical cards in mock mode; real audit gives genuinely unique content. All 25 result JSONs committed. Typecheck + `npm run build` clean. Plan file: `/Users/imranmohammed/.claude/plans/im-thinking-about-making-reactive-rocket.md` covers both tracks (originally Supabase+Postgres, pivoted to Turso; later rewritten from dashboard redesign to gallery-first launch plan). Open follow-ups: run gallery for real once OpenAI key is added; wire main-nav entries for Audit + Audited.

### Session 2026-04-23 17:23 (MacBook)

- **Pattern:** Aiex-faithful design system port + visual storytelling
- **Status:** Work in progress
- **Files Changed:** 42
- **Tests Added/Modified:** 1
- **Notes:** Long session porting aiex's design system into gist + adding visual storytelling. **Foundation:** copied Satoshi 300/400/500/700/900 woff2 from aiex into `public/fonts/`, swapped `layout.tsx` from fontshare CDN to `next/font/local` with `adjustFontFallback: 'Arial'` to kill CLS. Rebuilt `globals.css`: removed legacy dark/glass tokens (`--bg-*`, `--text-*`, `--accent-*`, `--border-light/medium`, `--msg-*`, `--glass-*`); added aiex tokens (`--background-*`, `--surface-*`, `--ink-*`, `--brand-*`, `--border-primary/secondary/focus/success/error/warning/info/divider`, `--ring-focus*`, `--status-*`, soft slate-tinted shadows, extended radii, `ease-out-expo`); wired full @theme inline; added typography refinements (h1 -0.03em/1.1, h2 -0.02em/1.2, h3-h4 -0.01em/1.3, p 1.6 leading); added light-mode `.glass*` utilities with dark-mode @media + `[data-theme=dark]` overrides (kept glass per user request — Vercel/Apple style); added `.card`/`.card-interactive` solid card pattern, `.bg-grain` SVG-noise overlay, `.eyebrow`, `.chip` utilities. **Project-wide rename via sed**: `bg-bg-*`→`bg-background-*`, `text-text-*`→`text-ink-*`, `accent-*`→`brand-*`, `border-border-light/medium`→`border-border-primary/secondary`, `bg-msg-ai-bg`→`bg-surface-secondary`, `bg-msg-user-bg`→`bg-brand-primary`, `text-msg-user-text`→`text-white` across 31 files. Stripped `.glass*`, `.ambient-orb`, `.hero-gradient-bg` from JSX in 5 files (then user said "I like glass effects" so I restored glass utilities in CSS but not the orbs; existing glass class refs were re-substituted back from solid-card placeholders). Stripped dark-mode hairline artifacts (`border-white/[0.06-0.12]`, `bg-white/[0.03-0.08]`, `divide-white/[0.06]`) and rebound to `border-border-primary`, `bg-background-secondary/tertiary`, `divide-border-primary`. Toast.tsx `bg-text-primary`→`bg-ink-primary`. **Hybrid design philosophy:** glass kept for hero/atmospheric surfaces (sticky nav, hero stat panels, hero-adjacent tables); `.card-interactive` for content cards (3-pillar grid, pricing, "Built on standard" callout, llms.txt comparison). **Grain hero treatment:** added `bg-background-grain bg-grain` wrapper to landing hero in `LandingWithAudit.tsx`; restructured `/spec` and `/about` to extract H1 into a grain hero section above the white content area. **Earlier in session (separate work):** moved email gate from before-audit to after-results (value-first UX), tightened audit rate limits to 1/10min + 3/day per IP via `windowMs` config refactor in `rateLimit.ts`. Fixed dev-server build error caused by stray `npm install user` in `~` (deleted `package.json`/`package-lock.json`/`node_modules` from home dir; Turbopack was treating `~` as workspace root). **Aiex visual refinements (typography/pills/cards):** hero h2 size scaled `text-4xl/5xl extrabold` → `text-5xl/6xl/7xl bold` with description `text-2xl/3xl text-ink-secondary` (matched aiex `font-extrabold`/`text-2xl md:text-3xl`); added `.eyebrow` + `.chip` utilities; pill controls everywhere (`rounded-xl` → `rounded-full` on AuditInput input + button, AuditEmailGate button, all 5 AuditHero buttons including "New audit"/"Change URL"/"Back to results"/"Resolve conflicts"/"Try again", pricing CTAs); replaced glass on 3-step pillar grid + "Built on open standard" callout + pricing tiers + llms.txt comparison cards with `.card-interactive`; reshaped final CTA from centered `glass-strong` to aiex bottom-card pattern (icon tile + text + arrow row). Hero centered + AuditInput `items-start`→`items-center` to fix visible left-alignment of input/button group. AuditInput button: dropped `!url.trim()` from disabled check (was rendering near-invisible disabled grey on initial state — matches aiex's "Subscribe is always navy until submitting" pattern), changed disabled style to `opacity-60`. Input shadow upgraded from invisible inset to `shadow-[0_2px_8px_rgba(51,65,85,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]` outer drop + inner highlight. **Removed pricing section** entirely (Free/Pro/Team tiers gone, Pricing nav links dropped from `/` and `/about`, Pro/Team copy on `/about` rewritten to tier-agnostic). Removed "What AI gets wrong" failure-mode table per user request. **Visual storytelling additions (3 components in one pass):** new `src/components/marketing/HeroResultPreview.tsx` — mocked linear.app audit result card under URL input on landing (Visibility Score 72/100, 3 model chips with scores, 3 conflict rows with severity icons + chips, all `glass-strong rounded-3xl`); replaced icon-only Audit/Fix/Track pillar cards with `PillarCard` wrapper containing visual mockups in a grain-textured top panel (`AuditMock` = horizontal progress-bar scorecard, `FixMock` = before/after `.gist.design` diff with red strikethrough → green replacement, `TrackMock` = inline SVG sparkline with area fill + "+12" trend); added new full-width "Here's what an audit looks like" section after drift panel — header bar with linear.app + Score 72 chip, 3-column model comparison (ChatGPT Fabrication / Claude Aligned / Perplexity Audience drift) with quote excerpts and severity chips, Top conflict callout suggesting `.gist.design` `Not this` entry. **Copy reduction pass at end:** trimmed pillar bodies, drift section paragraph, Built-on-open-standard sentence, example audit intro — kept all substance ("positioning drift", "patches what AI tools miss", "AI visibility score", "materially") per user feedback after first pass cut too aggressively. Self-hosted Satoshi now preloads via Next pipeline at `/_next/static/media/satoshi_*.woff2`. Type checks clean throughout, dev server 200 across `/`, `/spec`, `/about`. **Plan file:** `/Users/imranmohammed/.claude/plans/image-1-i-still-starry-mountain.md` documents the typography/pills/cards refinement plan (executed). New components: `HeroResultPreview` (server component, ~100 lines). New CSS utilities in `globals.css`: `.glass*` rewrites, `.card`, `.card-interactive`, `.bg-grain`, `.eyebrow`, `.chip`, `.animate-fade-in`/`scale-in`/`slide-in-x`. Open question: hero alignment kept centered per user, glass utilities retained per user but ambient orbs not restored (decorative, optional follow-up).

### Session 2026-04-22 20:17 (MacBook)

- **Pattern:** General updates
- **Status:** Work in progress
- **Files Changed:** 5
- **Tests Added/Modified:** 1
- **Notes:** Rebranded product from "Gist / gist.design" (single tool) to "gistaudit" (audit product built on the open gist.design spec). Landing hero reframed around auditing ChatGPT/Claude/Perplexity output and tracking drift; replaced "Why gist.design" table with "What AI gets wrong" failure modes; added Pricing section (Free/Pro $29/Team $99) with weekly re-runs and drift alerts. Rewrote /spec as an open-specification page with "Where it fits" reference table; updated /about to reflect audit-first positioning; synced layout.tsx metadata + OG/Twitter tags to the new gistaudit brand.

### Session 2026-03-31 17:25 (MacBook)

- **Pattern:** General updates
- **Status:** Work in progress
- **Files Changed:** 6
- **Tests Added/Modified:** 0
- **Notes:** Added custom Gist icon (globe+sparkle SVG) as favicon with prefers-color-scheme and inline GistIcon component in nav. Added "gist.design vs llms.txt" section to landing page clarifying complementary positioning. Tightened all landing page copy across every section — cut verbose descriptions to punchy one-liners.

### Session 2026-03-24 16:49 (MacBook)

- **Pattern:** General updates
- **Status:** Work in progress
- **Files Changed:** 19
- **Tests Added/Modified:** 2
- **Notes:** Redesigned audit from gap-finding to conflict-detection: analysis now compares what ChatGPT and Claude say against each other and the site content, only flagging real contradictions, fabrications, category conflicts, audience mismatches, missing differentiators, pricing confusion, and shared inaccuracies. Added evidence quotes (ChatGPT says/Claude says/Site says) to each conflict. Fixed audit-to-fix navigation by rendering GapFixer inline (no more localStorage/sessionStorage page handoff). Added two-column layout with right-side gap checklist, back navigation between questions and done screen, and back-to-audit-results link. Submitted gist-design skill PR to anthropics/skills (#753). Removed Perplexity provider.

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
