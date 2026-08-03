# gist: terminal-first

**Date:** 2026-08-03
**Status:** Design, pending approval
**Supersedes:** the audit-first web app as the primary product surface

---

## Summary

gist becomes a terminal product. A developer runs `/gist-design` in their repo, gets an
audit of how AI tools would describe their product, generates an `llms.gist` spec, and
the tool wires that file into the agent configs that will actually read it. The web app
is reduced to a single static page.

The change is driven by a test (below) showing that the current product's central promise
cannot be delivered, while a narrower promise can be delivered and demonstrated on the spot.

---

## The problem

The shipped product promises that publishing an `llms.gist` file at your site root changes
how ChatGPT and Claude describe your product. That promise does not hold.

### What we tested

`aiuxdesign.guide` publishes a real `llms.gist` (15,605 bytes) and a real `llms.txt`
(9,513 bytes). We extracted five claims that appear in the `.gist` and **zero times**
across the site's `/`, `/about`, `/audit`, and `/patterns` HTML, including internal
roadmap notes no marketing site would publish. We then ran three probes against ChatGPT
and Claude with web search enabled:

1. Open: what is this product, who made it, who is it for
2. Affiliation: is it the same as aiuxpatterns.com, shapeof.ai, aiverse.design
3. Internal: what monetization is it considering, what roadmap questions are open

### Results

`llms.gist` was cited **zero times** by either model. `llms.txt` was never fetched either.

- ChatGPT, probe 3: _"not publicly available... the creator has not disclosed this
  information in accessible sources."_ Zero citations.
- Claude, probe 3: _"No publicly available source describes monetization approaches."_
- Claude, probe 1, closing line: _"comparable alternatives worth cross-referencing include
  shapeof.ai, aiverse.design, and aiuxpatterns.com."_ This is exactly the competitor
  blending the file's "Not This" section exists to prevent, occurring while the file was
  live and correct.

### Why

Neither file is linked from anywhere. Zero references in the site HTML, zero in
`sitemap.xml`, zero in `robots.txt`. A crawler cannot reach either file except by guessing
the URL, so no search index contains them, so no model search result can surface them.

### The control

Re-running the same question with the URL named directly in the prompt, same model, same
day, Claude fetched the file and answered perfectly: it listed the monetization options
verbatim and stated the competitor disaffiliation correctly.

**The file works. The content is good. The format is readable. The failure is entirely
discovery.**

A second probe isolated the remaining constraint. Told the convention exists and asked to
check for it, Claude replied that `llms.gist` is _"not something I recognize as an
established convention at all, not a registered well-known URI"_, and its fetch attempt was
refused with `url_not_in_prior_context`.

---

## Two locks

| Lock             | Description                                                          | Ours to fix?                 |
| ---------------- | -------------------------------------------------------------------- | ---------------------------- |
| **Indexability** | Nothing links the file, so no index contains it                      | Yes. Link, sitemap, pointer. |
| **Preference**   | A model must choose an unknown extension over pages it already ranks | No. Standards adoption.      |

Both are **public retrieval** problems. Neither applies when a file is handed directly to
an agent on the local filesystem. That is the basis for the decision below.

Note that `llms.txt`, the adopted convention, performed no better in the same test. Its
adoption is publisher-side (sites publish it, tooling generates it), not consumer-side (no
major vendor has committed to fetching it). Chasing convention status for `.gist` is
therefore judged not worth its cost, and is out of scope.

---

## Decision: terminal-first

gist ships as a Claude Code skill, invoked with `/gist-design` and installed by
`install.sh`. The web app is reduced to one static page.

A standalone CLI (`npx gist-audit`) is **out of scope** for this design. It appeared in an
earlier plan and was never built. Adding it here would turn a deletion into a build, and
nothing in the test result requires it.

Terminal delivery keeps **only the half we can prove**. The agent reads the spec because a
config file points at it. No index, no crawler, no vendor cooperation, no standard.

### What this claims

> Your coding agent will describe your product correctly, and we will prove it in your
> terminal before you leave.

### What this explicitly does not claim

> Publishing this file changes what ChatGPT tells a prospect about you.

Keeping that line sharp is the point of the redesign. Blurring it rebuilds the current
overpromise with extra steps.

---

## The flow

### 1. Audit

Read the repo (README, package.json or equivalent, CLAUDE.md, docs/, routes, components).
Describe the product the way an AI tool would from that evidence alone, and name the gaps.

**Status: already built** in `skills/gist-design/`.

### 2. Generate

Write `llms.gist` at the project root from the audit plus a short conversation.

**Status: already built.**

### 3. Wire it in

New. This is the step the test proved decisive, translated to the local case.

Dropping a file at the project root has the same flaw as dropping it at the web root:
nothing points at it. Claude Code auto-loads `CLAUDE.md`, not `llms.gist`. Cursor needs it
in `.cursor/rules`. Copilot reads `.github/copilot-instructions.md`.

The flow ends by adding a one-line pointer to whichever agent configs the repo actually
has. Detect, do not assume. If none exist, say so and offer to create the one matching the
user's agent.

### 4. Verify

New, and deliberately not self-fulfilling.

The web equivalent of this check was worthless: paste the URL, watch the model fetch it,
declare success. That proves the file parses, not that anything finds it.

In the terminal it is genuinely testable. Start a fresh agent session, ask a question only
the spec answers, and **never mention `llms.gist`**. If the agent answers correctly, the
wiring works. This is the same shape as the probes that failed on the web, run where they
can actually pass.

The verification question should be drawn from content unique to the spec, preferring the
"Not This" and boundary sections, since those are what models most reliably get wrong.

---

## Surface changes

**Kept**

- `skills/gist-design/` and its references
- `install.sh`
- `examples/*.gist`
- `.claude-plugin/`
- `README.md`
- One static page on llmsgist.org: what it is, the install command, one example `llms.gist`.
  No app, no API, no database, no auth.

**Removed**

- Routes: `/audit`, `/fix`, `/create`, `/audited/*`, `/request-private`, `/login`,
  `/onboarding`, `/dashboard`
- All of `src/app/api/*`
- `src/lib/db.ts`, `db/`, the Turso dependency, auth, session handling, the rate limiter
- Resend integration and the weekly cron
- Most of `src/components/`

This is predominantly a deletion, not a build. The audit and generation steps already
exist in the skill.

---

## Open decisions

### 1. `src/lib/audit/` : delete or keep dormant

This is the strongest code in the repo: deterministic (temperature 0, pinned model
snapshots), validating JSON parser, scoring derived in code so the judge cannot drift, and
a fix for a prompt-injection path where provider error text fed back into the next call.

The skill's audit reads a repo rather than querying two models, so it is not a like-for-like
port. If the two-model comparison is ever wanted from the terminal flow, this is where it
lives.

**Recommendation:** keep the directory and its tests, unreferenced, with a note explaining
why. Deleting it discards the only implementation of the comparison and its hardening.

### 2. Acquisition

Removing the gallery removes the shareable artifact. The prior positioning note states that
the audit is the marketing and the file is the artifact. Terminal distribution plus a static
page is the chosen replacement, and this is the weakest-evidenced part of the plan. It
should be revisited with real numbers rather than treated as settled.

---

## Non-goals

- Making `llms.gist` a recognized web standard
- Public crawler retrieval of the file
- Any claim that publishing changes what a search-connected model says
- Rebuilding the audit gallery, the paid tier, or the tracking dashboard

---

## Evidence appendix

Probe scripts and raw output are in the session scratch directory. The three findings that
drive this design:

1. Zero fetches of `llms.gist` or `llms.txt` across two models and three probes.
2. Perfect answers from the same model when the URL was supplied directly.
3. Zero inbound links to either file from the publishing site.
