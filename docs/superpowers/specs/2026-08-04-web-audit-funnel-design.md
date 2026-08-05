# Web audit funnel

**Date:** 2026-08-04
**Status:** Design, pending approval
**Builds on:** `2026-08-03-terminal-first-gist-design.md`

---

## Summary

A visitor pastes a public GitHub URL. gist audits the repo, shows how an AI reads it today,
asks a few targeted questions about what the repo cannot say, generates an `llms.gist`, and
hands over a download. The screen ends by pointing at the terminal, which is the only place
the file can be connected and verified.

This exists to solve acquisition. Today the audit, which is the part that lands, sits behind
an install. This moves it in front.

---

## Why this before the drift check

The drift check is specced (`2026-08-04-product-intent-drift-check-design.md`) and gives gist
a reason to be run twice. That is retention, and retention does not help at zero external
users. This is deliberately sequenced first and the drift check is parked as specced but not
planned.

---

## What this is not

The deleted web app audited a **website** by asking ChatGPT and Claude what they knew about
it. That measured web knowledge, which `llms.gist` provably cannot change, and that mismatch
is why the terminal-first change removed it.

This audits a **repo**. Same mechanism, honest domain: everything it reports is something the
file actually fixes.

Not in scope, and not reinstated: accounts, auth, sessions, Turso, the paid tier, the fix
flow, the tracking dashboard, and the public gallery. No result is publicly addressable and
nothing is browsable.

A rate limiter does return, on KV rather than a relational database. So does a server-side
`GITHUB_TOKEN`, which is ours rather than the visitor's and grants nothing beyond public
read.

---

## Decisions

| Question            | Decision                                                    |
| ------------------- | ----------------------------------------------------------- |
| Visitor input       | Public GitHub URL. No visitor login at any point            |
| Visitor output      | A downloadable `llms.gist`                                  |
| Audit engine        | Structural facts in code, one model call for the semantics  |
| Result persistence  | None. Ephemeral, no shareable URL, no gallery               |
| Storage             | No database. Function-level cache plus a KV counter         |
| Model calls per run | Two, and the second is gated behind answering the questions |

---

## Flow

```
paste repo URL
   ↓  free    GitHub API: README, package metadata, file tree
   ↓  free    structural facts (has README, length, docs/, description, file count)
   ↓  1 call  reading + gap list
   ↓          the diagnosis
   ↓  free    questions selected from gaps via a table in code
   ↓          3 to 5 questions, progressive form
   ↓  1 call  generate llms.gist from repo context + answers
   ↓          download, then the handoff to the terminal
```

Abandoners cost one call. The expensive half only fires for someone who answered.

---

## Surfaces

The entry field lives in the homepage hero, in place of the install command. The flow itself
is a client component with four phases: input, diagnosis, questions, done. No per-result
URLs, nothing to cache at the page level, nothing to invalidate.

The install command moves below the fold rather than away, and reappears in the handoff.

Two stateless API routes:

- `POST /api/audit` takes `{ owner, repo }`, returns `{ reading, gaps, questions }`
- `POST /api/generate` takes `{ repoContext, answers }`, returns `{ file }`

The browser carries state between them, which is why nothing relational appears in this
design. The only server-side state is a KV counter for rate limiting and a function-level
cache, neither of which stores a result anyone can address.

---

## Components

### 1. GitHub reader

**In:** owner, repo. **Out:** README text, package metadata, file tree. **Depends on:** a
server-side `GITHUB_TOKEN`.

Three calls per audit. Public repos only. A private repo returns a clear message, not an
error page.

**The token is required, not an optimisation.** Unauthenticated GitHub API allows 60 requests
per hour per IP, and on Vercel those come from shared serverless IPs rather than the
visitor's. At three calls per audit that is roughly 20 audits per hour for the whole site
before GitHub returns 403. A token lifts it to 5,000 per hour. This is a normal-operation
ceiling, not an abuse ceiling, so it cannot be deferred.

The token is ours and server-side only. It is not user auth, grants no access to private
repos, and never reaches the browser. Use a fine-grained token with public read only, so a
leak exposes nothing that is not already public.

### 2. Structural scanner

**In:** the reader's output. **Out:** structural facts. **Depends on:** nothing. Pure.

Facts only, the things code is genuinely better at than a model: does a README exist, how
long is it, is there a `docs/` directory, does package metadata carry a description, how many
source files. These feed the prompt as context and short-circuit trivial cases. A repo with
no README needs no model call to diagnose.

**Deliberately not semantic.** An earlier draft had this scanner detect missing negative
claims by keyword. That was wrong. "Designed for teams who hate configuration" is an audience
statement matching no obvious pattern, and "does not" appears constantly in unrelated
sentences. Keyword matching would put wrong questions in front of the visitor.

### 3. Reader model call

**In:** repo context plus structural facts. **Out:** `{ reading, gaps[] }`. Temperature 0,
pinned snapshot.

```json
{
  "reading": "A React component library for building dashboards.",
  "gaps": [{ "id": "no_negative_audience", "evidence": "README names no audience it excludes" }]
}
```

Three properties copied from the dormant pipeline because they were expensive to get right: a
pinned snapshot at temperature 0 so the same repo gives the same reading, a validating parser
that drops malformed gaps rather than discarding the whole response, and no untrusted text
re-entering a later prompt unsanitised.

**Repo content is data, not instructions.** A README is untrusted input. The prompt must say
so explicitly. Same class of problem as the injection path already closed in `parse.ts`.

### 4. Question selector

**In:** gap IDs. **Out:** questions. **Depends on:** nothing. Pure, table-driven.

A fixed map from gap ID to question, so `no_negative_audience` always produces "Who is this
deliberately not for?" The model decides which gaps exist. Code decides what to ask. This
keeps the interview reviewable and stops the model inventing its own.

### 5. Generator

**In:** repo context plus answers. **Out:** an `llms.gist`. One call, temperature 0, output
validated against required sections.

**The rule that matters: an unanswered question produces a marked placeholder, never an
invented claim.** If nobody stated who the product is not for, the file says that section
needs input. It does not guess.

This is enforced in code, not left to the prompt. On 2026-08-04 a fabricated boundary about
Linear reached this repo's README, both example files, the reference copy inside the
installed skill, and the homepage, where the demo struck through a true statement and offered
a false one as the correction. A product whose thesis is that fabricated product claims are
the problem cannot ship a generator that fabricates them.

The file also carries its own provenance, following the existing quick-mode precedent: a note
that it was generated from limited input, and a pointer to the fuller terminal flow.

### 6. Download and handoff

A Blob in the browser, filename `llms.gist`, plus copy to clipboard. Nothing stored.

The web cannot Connect and cannot Verify, so the final screen says so plainly:

> Put this at your project root. Then `curl -fsSL llmsgist.org/i | bash` and run `/llms-gist`
> to connect it to your agent and check that it actually worked.

---

## Cost and abuse

Dropping the shareable URL removed the page cache that was bounding cost, so without something
in its place every visit is two uncached model calls on an unauthenticated endpoint.

**Cache the audit function, not the page.** `unstable_cache` keyed by `owner/repo`. The same
repo audited twice costs nothing and the result is never publicly addressable. Generation
stays uncached, since it depends on the visitor's answers.

**Failures must never populate the cache.** Cache on success only, inside the try, and let
errors propagate uncached. On aiex, `/news` cached a two-item static fallback when Prisma
errored and served it for an hour, and `unstable_noStore()` in a catch block did not prevent
it. The same mistake here would serve a broken audit for a repo until the cache expired.

**A rate limiter ships in v1.** An earlier draft deferred it, arguing that the old limiter was
DB-backed and reinstating that was most of what the terminal-first change removed. That
conflated two different things. The old limiter needed Turso because Turso was already there;
the requirement is a counter that survives across serverless instances, not a relational
database.

Use Upstash Redis or Vercel KV with `@upstash/ratelimit`: one package, one env var, a sliding
window in roughly twenty lines, and a free tier that covers this comfortably. That is not the
deleted infrastructure returning, and it is far cheaper than discovering the bill.

An in-memory `Map` is still not acceptable, for the reason recorded when the original limiter
was replaced: it is bypassed across cold starts and across instances, so it protects nothing
on Vercel.

Two limits, because they protect different things:

- **Per IP**, a sliding window on `/api/audit`, so one visitor cannot walk through many repos
- **Global per hour** on `/api/generate`, a spend ceiling that fails closed with an honest
  message rather than an unbounded bill

The function cache and the fact that generation requires answering questions both reduce
exposure, but neither is a limit, and neither should be described as one.

---

## Failure modes

Each returns a distinct message. None leaves a spinner that never resolves.

| Failure                 | Handling                                                  |
| ----------------------- | --------------------------------------------------------- |
| Malformed URL           | Inline validation before any request                      |
| Repo not found          | "We could not find that repo. Is it public?"              |
| Private repo            | Explicit message. Public repos only in v1                 |
| GitHub rate limit       | Ask them to retry later. Do not cache                     |
| Empty or missing README | Short-circuit before the model call. That is the finding  |
| Model error or timeout  | Retry once, then fail clearly. Do not cache               |
| Malformed model JSON    | Drop bad gaps, keep valid ones, fail only if none survive |
| Generation fails        | Keep the diagnosis on screen. Do not lose their answers   |

---

## Testing

Unit, on the pure units:

- Structural scanner against fixture repos
- Gap-JSON validator, including malformed and partial fixtures
- Gap-to-question table, asserting stable selection
- File assembly from answers
- The placeholder rule: an unanswered question must never produce a claim

Failure paths get their own tests, one per row above.

Verified locally against failing dependencies before deploy: a stopped network, a 404 repo,
and a forced model error. This follows the rule set after three broken states were shipped
iterating a `/news` fix against production, all of which would have surfaced in
`next build && next start` locally.

---

## Resolved 2026-08-05

**The entry point is the homepage hero**, replacing the install command as the primary
action. The audit is what lands, so it goes in front.

The install command does not disappear. It stays visible further down for anyone who already
knows they want it, for example someone arriving from the README, and it is required in the
handoff after download. Removing it entirely would leave a returning visitor with nowhere to
go.

**The number of questions follows the repo.** Questions are the gaps, so a repo with five
gaps gets five questions and a repo with none skips straight to generation. Zero questions is
a valid path, and in that case the diagnosis says the repo is already clear and the file is
generated immediately.

**Capped at five, ranked by inferential impact.** A repo with no README has every gap, and an
uncapped rule would open with a twelve-question form that nobody finishes. Ranking is by how
much the absence changes what an agent infers, so a missing audience or boundary outranks a
missing rationale. The cap is a product decision, not a technical one, and it should be
revisited once there is completion-rate data.

**The file does not state that it was generated on the web.** The placeholder rule already
carries the signal: any section without an answer is marked as needing input, so the file
declares its own incompleteness where a reader or an agent will actually encounter it. A
separate provenance note would be redundant with a signal that is already load-bearing.
