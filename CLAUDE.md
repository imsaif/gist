# gist - Project Memory

> Audit how AI tools describe your product, then generate the `llms.gist` file that fixes what they get wrong.

## Project Overview

- **Domain:** llmsgist.org (migrated from gist.design)
- **Repo:** github.com/imsaif/gist (public, MIT), never write credential values into tracked files
- **Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, Vitest
- **Models:** OpenAI `gpt-4o-2024-11-20` + Anthropic `claude-sonnet-4-5-20250929` for the dormant audit in `src/lib/audit/`, `claude-haiku-4-5-20251001` as its judge
- **Distribution:** Claude Code plugin only (`install.sh` → `/gist-design`). The web app was removed in the terminal-first change (2026-08-03)

## Naming (locked — mirrors llms.txt)

- Extension / format: **`.gist`** (never `.gist.design`)
- Canonical filename at project root: **`llms.gist`** (mirrors `/llms.txt`)
- Brand: **gist** / **llms.gist**. Crawler UA: `GistBot`
- The skill directory stays `skills/gist-design/` on purpose — renaming breaks already-installed plugins

## Product Flow

Four steps, run by the `/gist-design` skill in this order: audit the repo (read README,
package metadata, existing agent config files, and key source to describe the product the
way an AI tool would); generate `llms.gist` at the project root from what the audit finds;
append a pointer to whichever agent config files the repo has (`CLAUDE.md`, `.cursor/rules`,
`.github/copilot-instructions.md`, `AGENTS.md`); then verify in a fresh session by asking a
question only the file answers, without naming the file.

## Routes

One static page at `/`. Everything else was removed in the terminal-first change
(2026-08-03). See `docs/superpowers/specs/2026-08-03-terminal-first-gist-design.md`.

## Key Files

- `skills/gist-design/SKILL.md` — the skill: audit the repo, generate `llms.gist`, append a
  pointer to the agent config files the repo has, then verify in a fresh session without
  naming the file
- `skills/gist-design/references/file-format.md` — the `.gist` file spec
- `skills/gist-design/references/patterns.md` — the 36 AI UX patterns the skill can name
- `skills/gist-design/references/wiring.md` — per-agent config targets and the pointer text
- `src/lib/audit/` — dormant, intentionally unreferenced. Read its README before touching it.

## Commands

```bash
npm run dev            # dev server
npm run build          # next build
npm test               # vitest — 78 tests / 6 files green as of 2026-08-03
```

Env vars (names only): `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`. Both are only needed to revive the dormant audit in `src/lib/audit/`; the site itself needs none.

## Conventions

- No em-dashes in user-facing copy. Use commas, periods, colons, or parens
- Parser pattern: `addX` appends to arrays, `updateX` merges by ID
- Tailwind v4 dropped v3's default `cursor: pointer` on `<button>`; it's restored in a `globals.css` base layer, don't re-add it per component
- Don't run `npm run build` while the dev server is running (it clobbers `.next/`); use `npx tsc --noEmit`
- Never claim in copy that publishing the file changes what a search-connected model says. The provable claim is local.

## Session History

Full per-session history lives in **`docs/SESSION-LOG.md`** (not auto-loaded, to keep this file lean).
`/save` appends a terse summary there. Read it only when you need historical context.
