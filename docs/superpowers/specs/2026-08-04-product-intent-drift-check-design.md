# Product intent drift check

**Date:** 2026-08-04
**Status:** Design, pending approval
**Builds on:** `2026-08-03-terminal-first-gist-design.md`

---

## Summary

`llms.gist` records what a product deliberately is not. Nothing currently notices when the
code stops agreeing with it. This adds a fourth mode to the skill, `/llms-gist check`, which
reads the negative claims in `llms.gist`, matches them against the repo as it stands, and
reports possible contradictions for the user to resolve.

The check never asserts a contradiction. It pairs a claim with a match and asks. That is what
keeps it honest, and it is also what removes the false-positive problem, since the tool stops
making a judgment it could be wrong about.

This is the first feature that gives gist a reason to be run more than once.

---

## Why this and not the alternatives

The terminal-first change left two things open: acquisition, and the fact that `/gist-design`
is a one-shot tool. Someone runs it, gets a file, and never returns. A check that stays useful
as the product moves is the retention half of that problem.

It also stays inside the provable claim. No index, no crawler, no vendor cooperation, no web
retrieval. It reads a file in a repo and searches the repo. Same class of claim as the current
product.

**Explicitly not in this design:** reviving `src/lib/audit/` to query ChatGPT, Claude, and
Perplexity from the terminal. That is a separate feature with its own API-key cost and its own
claim risk, and it measures a domain `llms.gist` cannot fix. It should be decided on its own
merits, not carried in on the back of this.

---

## Prerequisite: rename the skill

The skill directory is `skills/gist-design/`, which produces `/gist-design`. This is a leftover
from before the 2026-04-30 rebrand, when the product was about design decisions. It is now
about product context, so the name misdescribes the tool.

`CLAUDE.md` currently justifies keeping it: "The skill directory stays `skills/gist-design/` on
purpose, renaming breaks already-installed plugins."

**That justification is not supported by evidence.** Checked 2026-08-04 against
`github.com/imsaif/gist`:

| Signal                   | Value                       |
| ------------------------ | --------------------------- |
| Stars / forks / watchers | 0 / 0 / 0                   |
| Repo page views (14d)    | 0                           |
| Clones (14d)             | 126, from 67 unique cloners |

Zero page views alongside 67 unique cloners indicates automation rather than people. The daily
shape supports this: 51 clones from 9 sources on Aug 3, and 21 clones from 21 distinct sources
on Aug 2. Vercel also clones on every deploy, and deploys were heavy on Aug 3.

Honest limits on that reading: a person running `curl | bash` clones without loading the repo
page, so clones cannot be cleanly separated from installs, and the telemetry that could have
resolved this was deleted with the API routes. This is the absence of positive evidence, not
proof of zero installs. A stale install also fails loudly with an unknown command, and the fix
is re-running one curl line.

**Decision:** rename to `skills/llms-gist/`, command `/llms-gist`.

`/llms-gist` over `/gist` because "gist" is GitHub's own term for code snippets. A product
whose thesis is "do not let AI blur you with something else" should not take the most
collidable name available.

Touched by the rename: `skills/gist-design/` to `skills/llms-gist/`, `install.sh`,
`.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, the README, and the
locked-naming section of `CLAUDE.md`, which must record that this decision was overturned on
evidence rather than silently changed.

**Naming rules this design follows:**

- The file is always `llms.gist`, at the project root, in every repo
- `.gist` is the format, used for example files such as `linear.gist`
- Working state lives in `.llmsgist/`, never `.gist/`, which would collide with the extension
- `gist.design` and `.gist.design` appear nowhere

---

## Scope

**Watched:** negative claims only.

- `### Not This` entries
- `Not for:` lines in Positioning
- `Not trying to` entries in Intent

**Not watched:** Product Overview, Interaction Model, Design Decisions, Open Questions.

Contradiction is only well defined for a negative claim. A code change can violate "not for
status categories are fixed and cannot be reordered". Almost nothing clearly violates "the goal is to
triage an issue in under five seconds". Watching positive claims produces noise, and noise is
what makes people stop running a check.

**Contradiction, not staleness.** The check does not report that the file is old, or that new
features are undocumented. It reports only that the repo appears to do something the file says
it deliberately does not do.

**Current state, not diff.** Every run asks one question: does this repo, as it stands,
contradict anything in `llms.gist`? No commit SHAs, no file hashes of the repo, nothing that
can go stale. Since the check runs on demand, drift-since-last-run buys little and costs an
invalidation problem.

---

## Components

Three units with separate responsibilities, so each can be understood and tested alone.

### 1. Claim extractor

**Input:** the text of an `llms.gist` file.
**Output:** a list of claims, each with text, section, line, derived terms, and derived paths.
**Depends on:** nothing.

Runs inside Claude Code, where the model is already in the session, so extraction is free and
needs no API key. Invoked at the end of the Write step, and again by the check whenever the
baseline is stale.

This unit is deliberately standalone because it has a second consumer. See Research below.

### 2. Matcher

**Input:** a baseline and a list of repo file paths.
**Output:** matches, each pairing a claim with the files that matched it.
**Depends on:** nothing. Pure function. No model, no network, no clock.

This is a script inside the skill directory, not prose instructions. A skill is markdown and
markdown cannot be unit tested, so if the agent does the matching by following instructions,
two runs on the same repo can disagree and nothing is verifiable. gist already runs vitest with
78 tests, so a pure matcher lands in an existing test culture.

**Location:** `skills/llms-gist/scripts/match.ts`, with `match.test.ts` beside it. It must live
inside the skill directory because `install.sh` copies only that directory, so anything outside
it is not present on an installed machine. `vitest.config.ts` sets no `include`, so the default
pattern already picks up a test file at that path with no config change.

Excludes `node_modules`, `dist`, `.next`, `.git`, and lockfiles. Caps reported matches per
claim rather than dumping every hit.

### 3. Resolution flow

**Input:** matches.
**Output:** an updated `llms.gist`, an updated ignore list, or nothing.
**Depends on:** the existing conversational update flow in the skill.

The agent handles this, because it is the part that genuinely needs judgment.

---

## Data: `.llmsgist/baseline.json`

Written by the extractor at the end of the Write step.

```json
{
  "version": 1,
  "gistHash": "sha256:9f2a...",
  "generated": "2026-08-04",
  "claims": [
    {
      "id": "c_7d41a9",
      "text": "Status categories are fixed and cannot be reordered.",
      "section": "Positioning",
      "line": 34,
      "terms": ["statusCategory", "reorderCategory", "workflowCategory", "categoryOrder"],
      "paths": ["src/settings/**", "src/admin/**"]
    }
  ],
  "ignored": [
    {
      "claimId": "c_7d41a9",
      "match": "src/legacy/CategoryShim.ts",
      "reason": "Deprecated compat shim, deleted next release",
      "date": "2026-08-04"
    }
  ]
}
```

**`id` is a hash of the normalized claim text, not the line number.** Line numbers shift when
anything above them is edited, and an ignore bound to a line number silently starts suppressing
a different claim. Hashing the text means an ignore follows its claim when it moves, and stops
applying when the claim is reworded, which is correct, because a reworded claim deserves a
fresh look.

**`gistHash` is the staleness guard.** The check hashes `llms.gist` before doing anything. On
mismatch it re-extracts claims first. Without this, hand-editing `llms.gist` leaves the check
enforcing claims that were deleted, which is worse than not running it.

**`paths` narrows where terms count.** "Configurable" appears in unrelated code everywhere.
Scoping each claim to the directories where a violation would actually live is the main defense
against noise.

**`ignored` requires a reason.** An unexplained ignore is indistinguishable from a bug six
months later.

---

## Flow

### Entry states

Detected the same way the skill already detects States A, B, and C.

**No `llms.gist`.** Nothing to check. Say so and offer the real first step: run `/llms-gist`.
Not an error, not an empty report.

**`llms.gist` but no baseline.** The common case for anyone who ran gist before this existed,
or wrote the file by hand. Extract claims on the spot, write the baseline, continue into the
check. No user action.

**Both present.** Hash check, then match.

### Output

```
/llms-gist check

llms.gist ......... 6 negative claims
Baseline .......... current
Scanned ........... src/**, app/** (312 files)

⚠  1 possible contradiction

   llms.gist:34  Positioning
   "Status categories are fixed and cannot
    be reordered."

   matched  src/settings/CategoryOrderEditor.tsx
            src/settings/statusCategory.ts

   One of these is out of date:
     1  The decision changed. Update llms.gist.
     2  The decision stands. This shouldn't ship.
     3  Not a real conflict. Ignore it.

✓  5 claims still hold
```

Two fixed rules for this output. It says **possible contradiction**, never contradiction, since
the matcher compares terms and does not know intent. And it reports the claims that still hold,
so a clean run says something rather than printing nothing.

### Resolution

**1, the decision changed.** Enters the existing conversational update flow, rewrites the claim,
re-extracts, updates the baseline.

**2, the decision stands.** Leaves the file alone. The file was right and the code is the
problem. This branch is the reason the feature is a guard on decisions rather than a
documentation updater.

**3, not a real conflict.** Appends to `ignored` with a required reason.

### Discovery

The Verify flow ends the first run, so the handoff goes there:

> Your `llms.gist` is wired in and verified. When the product moves, run `/llms-gist check` and
> I will tell you if the code has drifted from what this file claims.

That line is the entire mechanism converting gist from one-shot to recurring. Without it nobody
learns the mode exists.

---

## Failure modes

**False positives** are what kill adoption. Three defenses: `paths` scoping, the word
"possible" in every report, and a required reason on every ignore.

**False negatives** get no defense. Matching cannot find a contradiction that shares no
vocabulary with its claim. A claim of "no sprint ceremonies" will not match `Iteration.tsx`
with a `cadence` field. **This limitation must appear in the skill's own output, not only in
docs.** A check that implies completeness it does not have is the same overclaim this product
exists to avoid, in miniature. Re-running the full skill inside Claude Code, where the model
reads rather than matches, is the deeper pass.

**A file with no negative claims** is itself a finding. Report that the file has nothing
checkable, which usually means the boundaries were never written, and offer to add them.

**Ignore rot.** An ignore pointing at a deleted path is dead weight. Prune it and say so.

**Large repos.** Cap per-claim output. Never dump every match.

---

## Testing

The matcher is a pure function, so it carries the test burden:

- Claim extraction from a fixture `llms.gist`
- Term matching with and without `paths` scoping
- The `gistHash` staleness path triggers re-extraction
- Ignore suppression
- Ignore pruning when a path no longer exists
- The empty-claims case
- Exclusion of `node_modules`, `dist`, `.next`, `.git`, lockfiles

The extractor and resolution flow run inside the agent and are verified by running the skill
against a fixture repo, not by unit tests.

---

## How this feeds research

dwc publishes deterministic studies, for example auditing 123 public frontends and reporting
that 74% would fail a basic quality check. The gist equivalent is not scanning public repos for
`llms.gist` files, since almost none exist. It is the inverse, and it is the stronger claim:

> **How many public repos document what their product is NOT?**

Scan N public repos for any negative claim in README and docs. The predicted answer is close to
zero, and that result is direct evidence for gist's thesis: intent is absent, not merely hard
to find.

**This is why the claim extractor is specified as a standalone unit.** The component that pulls
negative claims out of an `llms.gist` is the same component pointed at a README to measure
their absence. Built once, it serves the product feature and the study. Designed any other way,
the study becomes a second implementation.

No study is in scope here. The requirement this design carries is only that the extractor takes
markdown text and returns claims, with no dependency on `llms.gist` structure beyond the
section names it looks for, so it can be aimed at arbitrary documents later.

---

## Library, noted and deferred

dwc distributes 45 free skills as standalone slash commands with zero dependencies, installed
one at a time, as a distribution surface. A gist equivalent would most likely be a library of
exemplar `llms.gist` files, since `examples/*.gist` and `references/patterns.md` already exist
in the repo.

Two things to settle before that becomes work:

1. The terminal-first spec lists "rebuilding the audit gallery" as a non-goal. A library of
   exemplar files written by us is a different artifact from a gallery of audits of other
   companies, but the distinction is thin enough to be worth stating deliberately rather than
   discovering in review.
2. A library is an acquisition bet, and acquisition is the open question the terminal-first
   spec flagged as its weakest-evidenced part. It deserves its own decision with its own
   evidence, not inclusion by adjacency.

Out of scope for this design. Recorded so it is not lost.

---

## Non-goals

- Staleness detection, undocumented features, or "your file is old"
- Reviving the multi-model audit in `src/lib/audit/`
- An npm package, MCP server, CI action, or watch mode. Everything here is a subset of that
  shape, so it remains available later without rework
- Any claim that this check is complete. It finds obvious violations reliably and quiet ones
  not at all
- Rebuilding the audit gallery or the paid tier

---

## Open questions

- Should `.llmsgist/baseline.json` be committed or gitignored? Committing shares ignores across
  a team and makes the check reproducible in CI later. Not committing avoids merge conflicts on
  a generated file. Leaning toward committing, since the ignore list carries human decisions
  that are worth reviewing.
- Should step 03, wiring, be verified before this ships? The realistic-repo E2E is still
  outstanding. This feature does not depend on wiring being the mechanism, so it is not a
  blocker, but building further on an unverified step makes later failures ambiguous.
