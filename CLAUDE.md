# gist - Project Memory

> Audit how AI tools describe your product, then generate the `llms.gist` file that fixes what they get wrong.

## Project Overview

- **Domain:** llmsgist.org (migrated from gist.design)
- **Repo:** github.com/imsaif/gist (public, MIT) — never write credential values into tracked files
- **Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, libsql/Turso, Vitest
- **Models:** OpenAI `gpt-4o-2024-11-20` + Anthropic `claude-sonnet-4-5-20250929` for the audit, `claude-haiku-4-5-20251001` as the judge, `claude-sonnet-4-6` for `/api/chat`
- **Distribution:** Claude Code plugin (`install.sh` → `/gist-design`) + the web app

## Naming (locked — mirrors llms.txt)

- Extension / format: **`.gist`** (never `.gist.design`)
- Canonical filename at project root: **`llms.gist`** (mirrors `/llms.txt`)
- Brand: **gist** / **llms.gist**. Crawler UA: `GistBot`
- The skill directory stays `skills/gist-design/` on purpose — renaming breaks already-installed plugins

## Product Flow

Audit-first. Enter a URL → fetch the site → ask ChatGPT and Claude what the product is → a judge model finds gaps → generate an `llms.gist` that closes them.

Gap categories: `contradiction`, `fabrication`, `category_conflict`, `shared_inaccuracy`, `audience_mismatch`, `missing_differentiator`, `pricing_confusion`. Severity is **two tiers only**, `critical` | `high` (medium was deliberately removed; if it would have been minor, it isn't a gap).

The `/create` chat + file-preview builder still exists but is legacy, not the main path.

### Legacy `/create` path (demoted, still live and tested)

- Two-panel layout: chat left, file preview right
- AI responses carry XML tags parsed by `src/lib/fileParser.ts`: `<file_update>`, `<before_after_update>`, `<pattern_identified>`
- Entry-state selection (building-new vs existing-product) happens before the first message
- `/api/chat` accepts `fileState` + `currentFeatureId` for context injection, `max_tokens: 4096`
- `PatternCard` renders inline in chat when the AI identifies a relevant pattern
- Supporting files: `src/lib/createPrompt.ts`, `src/lib/export/markdown.ts`, `src/lib/export/developerBrief.ts`, `src/lib/patterns/` (loader + matcher)

## Routes

- `/` — gallery catalog + audit hero toggle
- `/audit` — full report. `/fix` — gap fixer (CTAs route to `/request-private`; the free download is gated)
- `/audited`, `/audited/[slug]`, `/audited/[slug]/llms.gist` — public gallery
- `/spec`, `/about`, `/request-private` ($39 tier, Stripe link sent manually)
- `/create` (legacy builder), `/login` + `/onboarding` + `/dashboard` (magic-code auth, Submit→Track→Improve loop)
- API: `/api/audit`, `/api/chat`, `/api/auth/*`, `/api/products`, `/api/snapshots/trigger`, `/api/actions/[id]`, `/api/mrr-checkins`, `/api/verify`, `/api/submit-gallery`, `/api/request-private`, `/api/cron/weekly-audit`

## Key Files

**Audit pipeline** (`src/lib/audit/`)

- `runAudit.ts` — orchestrates fetch → providers → judge
- `providers.ts` — pinned model snapshots, `temperature: 0` everywhere (same URL produces byte-identical output)
- `prompts.ts`, `parse.ts` — `parseGapAnalysis()` drops malformed gaps; `sanitizeErrorForPrompt()` closes a prompt-injection vector where provider error text fed back into the next call
- `summary.ts` — `deriveSummary()` computes Good/Partial/Poor **in code**, overwriting the judge's self-report so it can't drift
- `fetcher.ts`, `llmsTxt.ts` (the flow is gated on whether the site has an `llms.txt`), `buildFile.ts`, `sseParser.ts`

**Components** — `src/components/Audit/` (AuditHero, AuditInput, AuditJourney, ConflictChips, GapItem, LLMResponseCard, CleanAuditCallout, NoLlmsTxtVerdict), plus `Gallery/`, `Create/`, `Layout/SiteHeader.tsx`, `Verification/`, `PatternCard.tsx`, `Toast.tsx`

**Types** — `src/types/audit.ts` (Gap, GapCategory, ReadabilityScore), `file.ts`, `index.ts`, `patterns.ts`

**Data** — `data/gallery/results/*.json` + `companies.json`; `examples/*.gist`; `src/data/patterns.json` (28 AI UX patterns)

**DB** — `src/lib/db.ts` + `db/migrations/`. Tables: `users`, `products`, `audit_snapshots`, `mention_samples`, `improvement_actions`, `mrr_checkins`, `rate_limit_events`. The rate limiter is DB-backed on purpose: an in-memory Map is bypassable across Vercel cold starts and instances.

## Commands

```bash
npm run dev            # dev server
npm run build          # prebuild runs migrate-on-deploy.ts first
npm test               # vitest — 257 tests / 14 files green as of 2026-07-31
npm run db:migrate
npm run build-gallery  # regenerate gallery data from audit results
```

Env vars (names only): `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `DATABASE_URL`, `DATABASE_AUTH_TOKEN`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `GALLERY_SUBMIT_TO_EMAIL`, `REQUEST_PRIVATE_TO_EMAIL`, `HMAC_SECRET`, `CRON_SECRET`, `MOCK_MODE`, `DISABLE_RATE_LIMIT`.

## Conventions

- No em-dashes in user-facing copy. Use commas, periods, colons, or parens
- Parser pattern: `addX` appends to arrays, `updateX` merges by ID
- Mock mode (`MOCK_MODE=true`) runs the app without API keys
- Tailwind v4 dropped v3's default `cursor: pointer` on `<button>`; it's restored in a `globals.css` base layer, don't re-add it per component
- Don't run `npm run build` while the dev server is running (it clobbers `.next/`); use `npx tsc --noEmit`

## Open Question

`/dashboard`, `/api/cron/weekly-audit`, and the snapshots/MRR tables contradict the Apr 2026 positioning constraint "no dashboards, no auto re-audit cron, don't compete with AEO trackers." It's unresolved whether that was a deliberate reversal. **Ask before extending or removing that surface.**

## Session History

Full per-session history lives in **`docs/SESSION-LOG.md`** (not auto-loaded, to keep this file lean).
`/save` appends a terse summary there. Read it only when you need historical context.
