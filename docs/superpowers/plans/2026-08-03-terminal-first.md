# Terminal-First gist Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn gist into a terminal product: the `/gist-design` skill gains a wiring step and an honest verification step, and the Next.js app is reduced to a single static page.

**Architecture:** The product is a Claude Code skill in `skills/gist-design/`, installed by `install.sh`. The skill audits a repo, generates `llms.gist` at the project root, points the repo's agent config files at it, and verifies an agent picks it up without being told the file exists. The web app keeps only a marketing homepage. `src/lib/audit/` stays in the repo, unreferenced, as decided in the spec.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, Vitest. Markdown for the skill.

**Spec:** `docs/superpowers/specs/2026-08-03-terminal-first-gist-design.md`

## Global Constraints

- **No em-dashes in end-user copy.** Use commas, periods, colons, or parentheses. This binds `README.md`, `src/app/page.tsx`, and the `layout.tsx` metadata strings. `SKILL.md` is the exception: its step headings already use the `### Step 1 — Read the project` form throughout, so new headings match that style for consistency. Do not add em-dashes to `SKILL.md` body prose.
- **The file is `llms.gist`.** Never `.gist.design`. Canonical location is the project root.
- **Never claim public crawler retrieval.** No copy anywhere may say or imply that publishing the file changes what a search-connected model tells a stranger. The provable claim is local: an agent reads it because a config points at it.
- **The repo is public.** No credential values in any tracked file.
- **`src/lib/audit/` and its tests stay and must keep passing.** So must `src/types/audit.ts` and the `@anthropic-ai/sdk` and `openai` dependencies.
- **After every task:** `npm test` passes and `npx tsc --noEmit` is clean. Do not run `npm run build` while a dev server is running.
- **Commit after every task.** Do not batch.

## File Structure

| File                                      | Responsibility                                                   |
| ----------------------------------------- | ---------------------------------------------------------------- |
| `skills/gist-design/SKILL.md`             | The skill. Gains a Wiring flow; its Verify flow is replaced.     |
| `skills/gist-design/references/wiring.md` | New. Per-agent config targets and the exact pointer line to add. |
| `src/lib/audit/README.md`                 | New. Explains why the directory is intentionally unreferenced.   |
| `src/app/page.tsx`                        | Rewritten as the single static marketing page.                   |
| `src/app/layout.tsx`                      | Metadata updated to the terminal claim.                          |
| `src/app/sitemap.ts`, `src/app/robots.ts` | Reduced to the one remaining route.                              |
| `README.md`                               | Rewritten around the terminal flow.                              |
| `package.json`                            | Web-only dependencies removed.                                   |

---

### Task 1: Replace the Verify flow in SKILL.md

The current Verify flow is self-fulfilling. Step 1 asks the model to "re-describe your product, now informed by the .gist file" while the file is already in its context because it just wrote it. Step 4 tells the user to paste the file into ChatGPT. Neither can fail, so neither proves anything. This task replaces it with a check that can actually fail.

**Files:**

- Modify: `skills/gist-design/SKILL.md` (the `## Verify flow` section, currently lines 189 to 221, ending where `## Adapting to who you're talking to` begins)

**Interfaces:**

- Consumes: nothing from earlier tasks.
- Produces: the section heading `## Verify flow` and the phrase `fresh session`, which Task 2's wiring flow refers to.

- [ ] **Step 1: Read the current section to confirm its exact bounds**

Run:

```bash
sed -n '189,222p' skills/gist-design/SKILL.md
```

Expected: the block starts with `## Verify flow` and the last line before `## Adapting to who you're talking to` is the Step 4 paragraph beginning `"Want to verify this yourself?`.

- [ ] **Step 2: Replace the whole section**

Replace everything from `## Verify flow` up to but not including `## Adapting to who you're talking to` with:

````markdown
## Verify flow

After the file is written and wired in, prove an agent actually picks it up.

The check has one rule: **do not mention the file.** If you name `llms.gist`, or paste its
contents, or say "using the spec we just wrote", the test cannot fail and proves nothing.
The whole point is to find out whether the wiring works when nobody points at it.

### Step 1 — Pick a question only the file answers

Choose something stated in the `llms.gist` and nowhere else in the repo. Prefer the
**Not This**, **Positioning**, or **Open Questions** sections, because boundaries and
negative claims are what AI tools most reliably get wrong.

Verify the answer really is unique to the file before using it:

```bash
grep -ril "<distinctive phrase>" . \
  --exclude=llms.gist --exclude-dir=node_modules --exclude-dir=.git
```

If that returns any file, the question is answerable from the repo and is not a valid
test. Pick another.

### Step 2 — Ask it in a fresh session

Tell the user, in your own words:

> Open a new Claude Code session in this repo and ask: "<question>". Don't mention
> llms.gist. If the answer is right, the wiring works.

A fresh session matters. The current session already has the file in context from writing
it, so asking here tests nothing.

### Step 3 — Read the result honestly

- **Correct.** The wiring works. Say so plainly and stop.
- **Wrong or vague.** The agent is not reading the file. This is a wiring problem, not a
  content problem. Go back to the Wiring flow, confirm the pointer landed in a config the
  user's agent actually loads, and try again.
- **Partly right.** The agent found the file but the section is thin. That is a content
  problem. Name the specific section that needs work.

### Step 4 — Set the expectation about reach

Say this plainly, because the alternative is a promise that does not hold:

> This makes your coding agent describe the product correctly, because its config now
> points at the file. It does not change what ChatGPT tells someone who asks about your
> product on the web. Those models only read pages a search index already contains, and a
> file nothing links to is not in any index.

Do not soften this. Overpromising here is the specific failure this flow exists to avoid.
````

- [ ] **Step 3: Verify the self-fulfilling instructions are gone**

Run:

```bash
grep -n "Paste the file into ChatGPT\|now informed by the .gist file" skills/gist-design/SKILL.md
```

Expected: no output. Both phrases belonged to the removed section.

- [ ] **Step 4: Verify the new section is present and intact**

Run:

```bash
grep -c "do not mention the file\|fresh session\|Wiring flow" skills/gist-design/SKILL.md
```

Expected: `3` or higher.

- [ ] **Step 5: Verify em-dashes appear only in step headings**

Run:

```bash
grep -n '—' skills/gist-design/SKILL.md | grep -v '^[0-9]*:### Step'
```

Expected: no output. Em-dashes are allowed in `### Step N — Title` headings, matching the file's existing style, and nowhere else.

- [ ] **Step 6: Commit**

```bash
git add skills/gist-design/SKILL.md
git commit -m "feat(skill): replace the self-fulfilling verify flow

The old flow asked the model to re-describe the product 'now informed by
the .gist file' while the file was already in its context, and told users
to paste the file into ChatGPT. Neither check could fail.

The new flow asks a question only the file answers, in a fresh session,
without naming the file, and states plainly that this does not change
what a search-connected model says."
```

---

### Task 2: Add the Wiring flow to SKILL.md

Dropping `llms.gist` at the project root has the same flaw as dropping it at the web root: nothing points at it. Claude Code auto-loads `CLAUDE.md`, not `llms.gist`.

**Files:**

- Create: `skills/gist-design/references/wiring.md`
- Modify: `skills/gist-design/SKILL.md` (insert a `## Wiring flow` section immediately before `## Verify flow`; add one line to `## Before you begin`)

**Interfaces:**

- Consumes: the `## Verify flow` heading from Task 1.
- Produces: the section heading `## Wiring flow`, referenced by Task 1's Step 3 recovery path.

- [ ] **Step 1: Create the reference file**

Create `skills/gist-design/references/wiring.md`:

````markdown
# Wiring reference

Which config file each agent actually loads, and what to add to it.

Detect what the repo already has. Do not create config for an agent the user does not use.

| Agent                             | File it loads                                   | Detect with                                       |
| --------------------------------- | ----------------------------------------------- | ------------------------------------------------- |
| Claude Code                       | `CLAUDE.md` at repo root                        | `test -f CLAUDE.md`                               |
| Cursor                            | `.cursor/rules/*.mdc`, or legacy `.cursorrules` | `test -d .cursor/rules \|\| test -f .cursorrules` |
| GitHub Copilot                    | `.github/copilot-instructions.md`               | `test -f .github/copilot-instructions.md`         |
| Codex and other AGENTS.md readers | `AGENTS.md` at repo root                        | `test -f AGENTS.md`                               |

## The pointer line

Append this to whichever files exist. It is the same text for every target:

```markdown
## Product context

Read `llms.gist` at the repo root before describing this product, its positioning, or what
it deliberately does not do. It is the source of truth for those questions.
```

## Rules

- **Append, never rewrite.** These files hold the user's own instructions. Add a section at
  the end. Never reformat, reorder, or delete what is already there.
- **Check before adding.** If `llms.gist` is already referenced in the file, say so and
  change nothing.
- **If no config file exists,** do not guess. Ask which agent they use, then create only
  that one file containing only the pointer section.
- **`.cursor/rules/` takes an `.mdc` file,** not plain markdown. Write
  `.cursor/rules/llms-gist.mdc` with this frontmatter above the pointer section:

  ```
  ---
  description: Product context and positioning
  alwaysApply: true
  ---
  ```

- **Report exactly what changed.** List each file touched and say the file is not read
  until a new agent session starts.
````

- [ ] **Step 2: Add the Wiring flow section to SKILL.md**

Insert immediately before the `## Verify flow` line:

```markdown
## Wiring flow

Run this after writing the file, before verifying.

A file at the project root is not read just because it is there. Claude Code auto-loads
`CLAUDE.md`. Cursor reads `.cursor/rules`. Copilot reads
`.github/copilot-instructions.md`. None of them look for `llms.gist` on their own, so the
file has to be pointed at.

Read `references/wiring.md` for the per-agent targets, the exact pointer text, and the
rules about appending rather than rewriting.

### Step 1 — Detect

Check which agent config files the repo actually has. Do not assume, and do not create
config for an agent the user does not use.

### Step 2 — Append the pointer

Add the pointer section from `references/wiring.md` to each config file found. Append it at
the end. Never reformat or remove anything already in those files.

If the file already references `llms.gist`, leave it alone and say so.

### Step 3 — Handle the empty case

If no agent config exists, ask which agent they use and create only that one file, with
only the pointer section in it.

### Step 4 — Report

List every file you touched, then say:

> The pointer takes effect in a new session. Your current one already has the file loaded
> from writing it.

Then move to the Verify flow.
```

- [ ] **Step 3: Register the reference in the "Before you begin" list**

In `## Before you begin`, after the line referencing `references/file-format.md`, add:

```markdown
4. Read the wiring reference at `references/wiring.md` for which config files each coding agent loads and the exact pointer text to append.
```

Renumber the following list items so the sequence stays continuous.

- [ ] **Step 4: Reconcile the closing steps of `## Writing the file`**

Found during Task 1. The closing list of `## Writing the file` still ends with instructions
written for the old flow, and step 4 now directly contradicts the new Verify flow, which
says "do not mention the file" and "if you paste its contents, the test cannot fail and
proves nothing."

Replace the numbered items 3 and 4 at the end of `## Writing the file` (currently around
line 333) with:

```markdown
3. Run the wiring flow so an agent will actually load the file.
4. Then run the verify flow to confirm it did.
```

Leave items 1 and 2 of that list alone, including the `llms.txt` reference block. That block
adds a pointer inside a file the user already publishes, which is a different thing from
claiming a crawler will find `llms.gist` on its own.

Verify:

```bash
grep -c "Paste the file into ChatGPT" skills/gist-design/SKILL.md
```

Expected: `0`.

- [ ] **Step 5: Verify both pieces landed**

Run:

```bash
test -f skills/gist-design/references/wiring.md && echo "reference: ok"
grep -c "^## Wiring flow" skills/gist-design/SKILL.md
grep -n "references/wiring.md" skills/gist-design/SKILL.md
```

Expected: `reference: ok`, then `1`, then at least two line numbers (one in Before you begin, one in the Wiring flow).

- [ ] **Step 6: Verify ordering**

Run:

```bash
grep -n "^## Wiring flow\|^## Verify flow" skills/gist-design/SKILL.md
```

Expected: two lines, with Wiring flow on the lower line number. Wiring must precede Verify.

- [ ] **Step 7: Commit**

```bash
git add skills/gist-design/SKILL.md skills/gist-design/references/wiring.md
git commit -m "feat(skill): add the wiring flow

A file at the project root is not read just because it is there. Claude
Code loads CLAUDE.md, Cursor loads .cursor/rules, Copilot loads
.github/copilot-instructions.md, and none look for llms.gist on their
own. The flow detects which configs the repo has and appends a pointer,
never rewriting what is already in them."
```

---

### Task 3: End-to-end run of the skill against a scratch repo

The first two tasks changed instructions, which unit tests cannot cover. This task is the real check on whether the flow works. It runs headlessly via `claude -p`, which starts a fresh session per invocation and loads `CLAUDE.md` from the working directory, so it exercises the same loading path a user's session would.

**Files:**

- Create: nothing in this repo. Work happens in `/tmp/gist-e2e`.
- Modify: `docs/superpowers/specs/2026-08-03-terminal-first-gist-design.md` (append a results section)

**Interfaces:**

- Consumes: the Wiring flow and Verify flow from Tasks 1 and 2.
- Produces: a recorded result. Nothing downstream depends on its outcome, but a failure here means Tasks 1 or 2 need revisiting.

- [ ] **Step 1: Build a scratch repo with a distinctive, checkable fact**

The fact must not appear anywhere in the repo except the file the skill will write.

```bash
rm -rf /tmp/gist-e2e && mkdir -p /tmp/gist-e2e && cd /tmp/gist-e2e && git init -q
cat > README.md <<'EOF'
# Kettleback

A CLI that renames screenshot files using their visible text.

Kettleback reads the image, extracts any text it can see, and renames the
file to a slug of that text. It runs entirely on device.
EOF
cat > CLAUDE.md <<'EOF'
# Kettleback

Go CLI. Run tests with `go test ./...`.
EOF
git add -A && git commit -qm "init"
```

- [ ] **Step 2: Install the skill from this working copy**

```bash
mkdir -p ~/.claude/skills
rm -rf ~/.claude/skills/gist-design
cp -r ~/gist/skills/gist-design ~/.claude/skills/gist-design
test -f ~/.claude/skills/gist-design/references/wiring.md && echo "wiring reference installed"
```

Expected: `wiring reference installed`. If missing, Task 2 did not complete.

- [ ] **Step 3: Run the skill headlessly, supplying the answer up front**

Headless mode has nobody to answer questions, so the distinctive fact goes in the prompt.

```bash
cd /tmp/gist-e2e
claude -p "Run the gist-design skill in quick mode on this repo. When you need to know what AI tools get wrong about it, use exactly this: Kettleback is not an OCR library, it never uploads images, and it will not batch more than 50 files at once. Write the llms.gist file, then complete the wiring flow." \
  --permission-mode acceptEdits > /tmp/gist-e2e-run.log 2>&1
tail -30 /tmp/gist-e2e-run.log
```

- [ ] **Step 4: Check the file and the wiring both landed**

```bash
cd /tmp/gist-e2e
test -f llms.gist && echo "file: ok" || echo "file: MISSING"
grep -c "llms.gist" CLAUDE.md
grep -c "50" llms.gist
git diff --stat CLAUDE.md
```

Expected: `file: ok`, a `llms.gist` count of 1 or higher in `CLAUDE.md`, at least one `50` in `llms.gist`, and a diff showing lines added to `CLAUDE.md` but none removed.

If any original `CLAUDE.md` line was removed, the append-never-rewrite rule in `references/wiring.md` was violated and Task 2 needs a stronger instruction. Report this as a finding rather than fixing it here.

- [ ] **Step 5: Run the positive check in a fresh session**

Each `claude -p` is a fresh session. The question never names the file.

```bash
cd /tmp/gist-e2e
claude -p "What is the maximum number of files this tool will process at once?" > /tmp/gist-e2e-positive.log 2>&1
cat /tmp/gist-e2e-positive.log
grep -c "50" /tmp/gist-e2e-positive.log
```

Expected: the answer states 50, so the grep count is 1 or higher.

- [ ] **Step 6: Run the negative control**

Remove the pointer and ask the identical question. This is what makes the check falsifiable.

```bash
cd /tmp/gist-e2e && cp CLAUDE.md /tmp/CLAUDE.md.bak
python3 - <<'EOF'
import re
s = open("CLAUDE.md").read()
s = re.sub(r"\n## Product context\n.*?(?=\n## |\Z)", "\n", s, flags=re.S)
open("CLAUDE.md", "w").write(s)
EOF
grep -c "llms.gist" CLAUDE.md
claude -p "What is the maximum number of files this tool will process at once?" > /tmp/gist-e2e-negative.log 2>&1
cat /tmp/gist-e2e-negative.log
grep -c "50" /tmp/gist-e2e-negative.log
cp /tmp/CLAUDE.md.bak CLAUDE.md
```

The `llms.gist` count in `CLAUDE.md` must be `0` before the question runs.

- [ ] **Step 7: Interpret the result honestly**

Three outcomes, and all three are reportable results. Do not tune the test to produce a particular one.

- **Positive passes, negative fails.** The wiring is doing the work. This is the intended result.
- **Positive passes, negative also passes.** The agent found `llms.gist` on its own, most likely by globbing or grepping the repo, without needing the pointer. This is a real and useful finding: it means the wiring step is redundancy rather than the load-bearing mechanism. Record it plainly. Do not weaken the negative control to manufacture a failure.
- **Positive fails.** The wiring is not working. Record what `CLAUDE.md` contained and what the agent answered. This means Task 2 needs revisiting.

- [ ] **Step 8: Record the outcome in the spec**

Append to `docs/superpowers/specs/2026-08-03-terminal-first-gist-design.md`:

```markdown
## E2E run 2026-08-03

Method: headless `claude -p` in a scratch repo, fact present only in the generated
`llms.gist`.

- Question asked: "What is the maximum number of files this tool will process at once?"
- With the pointer in `CLAUDE.md`: <answer, and whether it contained 50>
- With the pointer removed: <answer, and whether it contained 50>
- Conclusion: <one of the three outcomes from Step 7>
```

Fill every placeholder with the actual observed output. Leaving a `<...>` in place is a failure of this step.

- [ ] **Step 9: Commit**

```bash
cd ~/gist
git add docs/superpowers/specs/2026-08-03-terminal-first-gist-design.md
git commit -m "docs: record the end-to-end verification run"
```

---

### Task 4: Mark `src/lib/audit/` dormant

Decided in the spec: the directory stays, unreferenced, because it is the only implementation of the two-model comparison and carries hardening that would be expensive to rebuild.

**Files:**

- Create: `src/lib/audit/README.md`

**Interfaces:**

- Consumes: nothing.
- Produces: nothing. Documentation only.

- [ ] **Step 1: Confirm the audit tests currently pass**

```bash
npx vitest run src/lib/audit --reporter=dot
```

Expected: all files pass. Record the test count.

- [ ] **Step 2: Write the README**

Create `src/lib/audit/README.md`:

```markdown
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
```

- [ ] **Step 3: Verify the guardrails named in the README are true**

```bash
grep -rn "sanitizeErrorForPrompt" src/lib/audit/parse.ts | head -2
grep -rn "deriveSummary" src/lib/audit/summary.ts | head -2
grep -rn "temperature" src/lib/audit/providers.ts | head -3
```

Expected: each returns at least one line. If any is missing, correct the README rather than the code. The README must describe what is actually there.

- [ ] **Step 4: Commit**

```bash
git add src/lib/audit/README.md
git commit -m "docs: mark src/lib/audit as intentionally dormant

Records why it survives the terminal-first change: determinism, validated
parsing, the prompt-injection fix, and scoring derived in code. Names the
files that must not be deleted along with it."
```

---

### Task 5: Reduce the web app to one static page

**Files:**

- Modify: `src/app/page.tsx` (replace all 86 lines)
- Modify: `src/app/layout.tsx` (metadata only)
- Modify: `src/app/sitemap.ts`, `src/app/robots.ts`

**Interfaces:**

- Consumes: nothing.
- Produces: a homepage with no imports from `src/lib/` or `src/components/`, which Task 6 relies on when deleting those trees.

- [ ] **Step 1: Replace the homepage**

Replace the entire contents of `src/app/page.tsx`:

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'llms.gist: product context your coding agent actually reads',
  description:
    'Audit how AI tools describe your product, write an llms.gist spec, and wire it into the config files your coding agent loads.',
};

const INSTALL = 'curl -fsSL https://raw.githubusercontent.com/imsaif/gist/main/install.sh | bash';

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-ink-primary text-4xl font-bold tracking-[-0.02em]">llms.gist</h1>

      <p className="text-ink-secondary mt-6 text-lg leading-relaxed">
        AI tools describe your product from whatever they can find. That is usually your README and
        your homepage, which say what it does but not who it is for, what it deliberately does not
        do, or how it differs from the product it keeps getting confused with.
      </p>

      <p className="text-ink-secondary mt-4 text-lg leading-relaxed">
        gist audits how your repo reads to an AI tool, writes an <code>llms.gist</code> file that
        fills the gaps, and points your coding agent at it.
      </p>

      <h2 className="text-ink-primary mt-12 text-sm font-semibold tracking-wide uppercase">
        Install
      </h2>
      <pre className="border-border-primary bg-background-secondary mt-3 overflow-x-auto rounded-lg border p-4 text-sm">
        <code>{INSTALL}</code>
      </pre>
      <p className="text-ink-tertiary mt-3 text-sm">
        Then run <code>/gist-design</code> in any repo.
      </p>

      <h2 className="text-ink-primary mt-12 text-sm font-semibold tracking-wide uppercase">
        What it writes
      </h2>
      <pre className="border-border-primary bg-background-secondary mt-3 overflow-x-auto rounded-lg border p-4 text-sm leading-relaxed">
        <code>{`# Linear

> A keyboard-first issue tracker with an opinionated workflow.

## Positioning

- Not for: teams who need custom workflows or configurable issue types.
- vs Jira: Jira is customizable, Linear is opinionated. No custom
  workflows, no configurable issue types.

### Not This

- This is not Jira with a faster UI. Cycles auto-schedule and roll
  unfinished work forward, so there are no sprint ceremonies.`}</code>
      </pre>

      <h2 className="text-ink-primary mt-12 text-sm font-semibold tracking-wide uppercase">
        What it does not do
      </h2>
      <p className="text-ink-secondary mt-3 leading-relaxed">
        This makes your coding agent describe the product correctly, because its config points at
        the file. It does not change what ChatGPT tells someone who asks about your product on the
        web. Those models read pages a search index already contains, and a file nothing links to is
        not in any index.
      </p>

      <footer className="border-border-primary text-ink-tertiary mt-16 border-t pt-6 text-sm">
        <a className="hover:text-ink-primary" href="https://github.com/imsaif/gist">
          github.com/imsaif/gist
        </a>
      </footer>
    </main>
  );
}
```

- [ ] **Step 2: Update the layout metadata**

In `src/app/layout.tsx`, replace the `title` and `description` values inside the exported `metadata` object with:

```ts
  title: 'llms.gist: product context your coding agent actually reads',
  description:
    'Audit how AI tools describe your product, write an llms.gist spec, and wire it into the config files your coding agent loads.',
```

Leave `baseUrl`, `metadataBase`, fonts, and everything else untouched.

- [ ] **Step 3: Reduce the sitemap to the one route**

Replace the exported array in `src/app/sitemap.ts` so it contains a single entry for `baseUrl` and nothing else. Keep the existing `baseUrl` constant and the `MetadataRoute.Sitemap` return type.

- [ ] **Step 4: Check robots.ts**

```bash
cat src/app/robots.ts
```

If it disallows or references any route being deleted, remove those lines. Keep the `sitemap` field pointing at `${baseUrl}/sitemap.xml`.

- [ ] **Step 5: Confirm the page has no app imports**

```bash
grep -n "^import" src/app/page.tsx
```

Expected: only `import type { Metadata } from 'next';`. Any import from `@/lib` or `@/components` blocks Task 6.

- [ ] **Step 6: Typecheck**

```bash
npx tsc --noEmit
```

Expected: clean. Errors here are pre-existing in files Task 6 deletes; note them and continue.

- [ ] **Step 7: Verify no em-dashes**

```bash
grep -c '—' src/app/page.tsx
```

Expected: `0`.

- [ ] **Step 8: Commit**

```bash
git add src/app/page.tsx src/app/layout.tsx src/app/sitemap.ts src/app/robots.ts
git commit -m "feat(web): reduce the site to one static page

The homepage now states the local claim and explicitly disclaims public
retrieval, which is the promise the current copy could not keep."
```

---

### Task 6: Delete the web app surfaces

Largest task, and the one to check most carefully. Deletion order matters: consumers before the modules they import, so the tree never references a missing file.

**Files:**

- Delete: routes, API handlers, DB, auth, and the components and libs that served only them.

**Interfaces:**

- Consumes: the import-free homepage from Task 5.
- Produces: a tree where the only remaining `src/lib/` subtree is `audit/`.

- [ ] **Step 1: Snapshot the current test count**

```bash
npm test 2>&1 | tail -4
```

Record the file and test counts. The audit tests must survive; the rest go with their code.

- [ ] **Step 2: Delete the routes and pages**

```bash
git rm -r -q \
  src/app/api \
  src/app/audit src/app/fix src/app/create src/app/audited \
  src/app/request-private src/app/login src/app/onboarding src/app/dashboard \
  src/app/about src/app/spec
```

`/about` and `/spec` go too. The spec calls for one page, and the file-format documentation ships with the skill in `skills/gist-design/references/file-format.md`.

- [ ] **Step 3: Delete the components that served them**

```bash
git rm -r -q \
  src/components/Audit src/components/Create src/components/Gallery \
  src/components/Verification src/components/Layout src/components/Export \
  src/components/ui src/components/PatternCard.tsx src/components/Toast.tsx \
  src/components/HowItWorks.tsx src/components/LogoMarquee.tsx src/components/GistIcon.tsx
```

- [ ] **Step 4: Delete the libs and data that served only the deleted routes**

`src/lib/audit/` is **not** in this list and must not be, with one exception.

**The exception is `src/lib/audit/buildFile.ts`.** It is the only file in that directory
that imports `@/types/file` and `@/lib/createPrompt`, both deleted below. It has no test,
and its only consumer is `src/app/fix/page.tsx`, also deleted. It bridges an audit result
into the web file editor, so it is not part of the two-model comparison being preserved.
Leaving it would break the dormant tree the moment its dependencies go.

```bash
git rm -q src/lib/audit/buildFile.ts

git rm -r -q \
  src/lib/db.ts src/lib/auth.ts src/lib/auth.test.ts src/lib/session.ts \
  src/lib/rateLimit.ts src/lib/email-validation.ts src/lib/email-validation.test.ts \
  src/lib/createPrompt.ts src/lib/createPrompt.test.ts \
  src/lib/fileParser.ts src/lib/fileParser.test.ts \
  src/lib/export src/lib/patterns src/lib/gallery src/lib/mentions src/lib/stats \
  src/lib/test-helpers.ts \
  src/types/file.ts src/types/index.ts src/types/patterns.ts \
  src/data/patterns.json \
  db scripts/migrate.ts scripts/migrate-on-deploy.ts scripts/build-gallery.ts \
  scripts/mockAnalysis.ts scripts/sanity-check-audit.ts \
  data
```

- [ ] **Step 5: Confirm the audit tree is untouched**

```bash
ls src/lib/audit/ && ls src/types/
grep -rn "@/types/file\|@/lib/createPrompt" src/lib/audit/
```

Expected: `src/lib/audit/` still holds its modules, its six test files, and `README.md`, with `buildFile.ts` gone. `src/types/` holds only `audit.ts`. The grep returns nothing, which is the check that the dormant tree has no dependency on deleted code.

- [ ] **Step 6: Find every dangling import**

```bash
npx tsc --noEmit
```

Expected: errors only in files still importing deleted modules. Fix each by deleting the importing file if it belonged to a removed surface, or by removing the import if the file survives. Repeat until clean.

- [ ] **Step 7: Run the tests**

```bash
npm test 2>&1 | tail -4
```

Expected: all remaining tests pass. Only `src/lib/audit/*.test.ts` should remain, six files.

- [ ] **Step 8: Build**

```bash
npm run build
```

Do not run this with a dev server running. Expected: success, with `/` as effectively the only route besides the metadata routes.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "refactor: delete the web app surfaces

Removes the audit, fix, create, gallery, request-private, auth, and
dashboard routes, all API handlers, the Turso layer, the rate limiter,
and the components and libs that served only them.

src/lib/audit and src/types/audit.ts are deliberately kept, unreferenced,
per the spec. /about and /spec are removed because the file-format
documentation ships with the skill."
```

---

### Task 7: Clean dependencies and rewrite the docs

**Files:**

- Modify: `package.json`, `.env.example`, `README.md`, `CLAUDE.md`, `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `vercel.json`

**Interfaces:**

- Consumes: the deleted tree from Task 6.
- Produces: nothing downstream.

- [ ] **Step 1: Remove the dependencies nothing imports now**

Remove from `package.json` `dependencies`: `@libsql/client`, `resend`, `cheerio`, `simple-icons`, `framer-motion`, `@heroicons/react`.

**Keep `@anthropic-ai/sdk` and `openai`.** `src/lib/audit/` imports both, and its tests must keep passing.

Remove the `prebuild` script, which ran the deleted `scripts/migrate-on-deploy.ts`, and the `db:migrate` and `build-gallery` scripts.

- [ ] **Step 2: Verify each removal is actually unused**

```bash
for p in @libsql/client resend cheerio simple-icons framer-motion @heroicons/react; do
  echo "$p: $(grep -rl "$p" src/ scripts/ 2>/dev/null | wc -l | tr -d ' ') importers"
done
```

Expected: `0 importers` for each. Any nonzero means that package is still in use. Do not remove it.

- [ ] **Step 3: Reinstall and re-verify**

```bash
rm -rf node_modules package-lock.json && npm install
npm test 2>&1 | tail -4
npx tsc --noEmit
npm run build
```

Expected: tests pass, typecheck clean, build succeeds.

- [ ] **Step 4: Reduce `.env.example`**

Only `ANTHROPIC_API_KEY` and `OPENAI_API_KEY` remain, both marked as needed solely to revive `src/lib/audit/`:

```bash
cat > .env.example <<'EOF'
# Only needed to revive the dormant two-model audit in src/lib/audit/.
# The site itself is static and needs no environment variables.
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
OPENAI_API_KEY=sk-your-openai-key-here
EOF
```

- [ ] **Step 5: Rewrite the README**

`README.md` keeps exactly these sections, in this order. Delete everything else, including
the whole "Development (web app)" database, migration, and gallery content.

1. `# gist` and the one-line summary
2. `## Quick start` — the `curl` install line and `/gist-design`, unchanged from today
3. `## Why` — keep the existing prose and the robots.txt / sitemap.xml / llms.txt / .gist
   comparison block
4. `## How it works` — new. Four subsections named Audit, Generate, Wire it in, Verify, one
   short paragraph each, matching `SKILL.md`
5. `## What the file captures` — keep as is
6. `## Examples` — keep as is
7. `## Using the file with your tools` — keep the table, and add this line beneath it:
   `The Wire it in step now does this for you. The table is here for reference and for tools the skill does not yet detect.`
8. `## What this does not do` — new, and it must contain this paragraph verbatim:

   ```markdown
   This makes your coding agent describe your product correctly, because its config points
   at the file. It does not change what ChatGPT tells someone who asks about your product
   on the web. Those models read pages a search index already contains, and a file nothing
   links to is not in any index.
   ```

9. `## Development` — `npm install`, `npm run dev`, `npm test`, and one line noting that
   `src/lib/audit/` is dormant and has its own README
10. `## License` — keep as is

No em-dashes anywhere in the file.

- [ ] **Step 6: Update CLAUDE.md**

Make exactly these changes. Leave every other section alone.

- **Delete** the `## Tracking Surface` section. `/dashboard` and the cron are gone.
- **Replace** the `## Routes` section with:

  ```markdown
  ## Routes

  One static page at `/`. Everything else was removed in the terminal-first change
  (2026-08-03). See `docs/superpowers/specs/2026-08-03-terminal-first-gist-design.md`.
  ```

- **Replace** the `## Product Flow` body with a four-step description matching `SKILL.md`:
  audit the repo, generate `llms.gist`, append a pointer to the agent config files the repo
  has, then verify in a fresh session without naming the file.
- **Replace** the `## Key Files` section with the skill paths, and add these two lines:

  ```markdown
  - `skills/gist-design/references/wiring.md` — per-agent config targets and the pointer text
  - `src/lib/audit/` — dormant, intentionally unreferenced. Read its README before touching it.
  ```

- **Keep unchanged:** the Naming section, Conventions, and the Session History pointer.
- **Add** to Conventions:

  ```markdown
  - Never claim in copy that publishing the file changes what a search-connected model says. The provable claim is local.
  ```

- [ ] **Step 7: Update the plugin descriptions**

In `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`, update `description` to describe the terminal flow including wiring. Leave `homepage` as `https://llmsgist.org`.

- [ ] **Step 8: Check vercel.json**

```bash
cat vercel.json
```

Remove any cron entry, which pointed at the deleted `/api/cron/weekly-audit`.

- [ ] **Step 9: Final verification**

```bash
npm test 2>&1 | tail -4
npx tsc --noEmit
npm run build
grep -c '—' README.md
grep -rn "gist\.design" README.md CLAUDE.md src/ 2>/dev/null | grep -v "skills/gist-design"
```

Expected: tests pass, typecheck clean, build succeeds, zero em-dashes in the README, and no stale `gist.design` references outside the deliberately-named skill directory.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "chore: drop web-only dependencies and rewrite the docs

Removes libsql, resend, cheerio, simple-icons, framer-motion, and
heroicons, none of which have importers after the deletion. Keeps the
Anthropic and OpenAI SDKs because src/lib/audit still imports them.

README and CLAUDE.md rewritten around the terminal flow, including the
explicit statement that this does not change what a search-connected
model says."
```

---

## Post-plan checks

- [ ] `npm test` green, only the six `src/lib/audit/*.test.ts` files remaining
- [ ] `npx tsc --noEmit` clean
- [ ] `npm run build` succeeds
- [ ] `/gist-design` runs end to end in a scratch repo: audits, writes `llms.gist`, appends the pointer, and a fresh session answers a file-only question correctly
- [ ] Removing the pointer makes that same question fail, proving the check is real
- [ ] No copy in `README.md`, `CLAUDE.md`, `SKILL.md`, or the homepage claims publishing changes what a search-connected model says
