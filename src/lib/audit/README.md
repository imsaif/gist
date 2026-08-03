# Dormant: two-model audit pipeline

**This directory is intentionally unreferenced.** Nothing in the app imports it. It is kept
deliberately, not by accident, and its tests still run in CI.

## What it does

Fetches a URL, asks ChatGPT and Claude to describe the product, and has a judge model
compare the answers against the site to find contradictions, fabrications, category drift,
audience mismatch, and pricing confusion.

## Why it was kept when the web app was removed

Four properties here are expensive to rebuild and easy to get wrong:

- **Determinism.** `providers.ts` pins model snapshots and runs at `temperature: 0`, so the
  same URL produces byte-identical output.
- **Validated parsing.** `parse.ts` drops malformed gaps instead of throwing away the whole
  response.
- **Prompt-injection fix.** `sanitizeErrorForPrompt()` in `parse.ts` closes a path where
  untrusted provider error text was fed back into the next model call.
- **Scoring in code.** `summary.ts` derives Good, Partial, or Poor in `deriveSummary()` and
  overwrites the judge's self-reported score, so the judge cannot drift.

The `/gist-design` skill audits by reading a repo, not by querying two models. It is not a
replacement for this, so deleting this would lose the comparison entirely.

## What reviving it needs

1. An HTTP entry point or CLI wrapper. The old one was `src/app/api/audit/route.ts`,
   removed in the terminal-first change. Recover it from git history if needed.
2. `ANTHROPIC_API_KEY` and `OPENAI_API_KEY`.
3. A rate limiter. The old one was DB-backed on purpose, because an in-memory map is
   bypassable across serverless instances.

## What was removed

`buildFile.ts` went with the web app. It turned an audit result into the editable file the
`/fix` page rendered, and it was the only file here that depended on the deleted
`src/types/file.ts` and `src/lib/createPrompt.ts`. It was a bridge to that editor, not part
of the comparison pipeline. Recover it from git history if a similar bridge is ever needed.

## Do not

- Delete this directory as dead-code cleanup.
- Delete `src/types/audit.ts`, which these modules import.
- Remove `@anthropic-ai/sdk` or `openai` from `package.json` while this is here.
- Reintroduce an import from anywhere outside `src/lib/audit/` and `src/types/audit.ts`.
  Everything else the app once provided is gone, and a new dependency would break the tree
  silently.
