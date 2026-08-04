# Does linking `llms.gist` make it retrievable?

**Date:** 2026-08-04
**Status:** Design, pending approval
**Relates to:** `2026-08-03-terminal-first-gist-design.md` (does not supersede it)

---

## Summary

The 2026-08-03 test showed that a published `llms.gist` is never fetched by ChatGPT or Claude
with web search on. The stated cause was discovery: nothing linked the file, so no index
contained it. That test could not evaluate the fix it implied, because the fix was never
applied.

This experiment applies it. Link the file, make it crawlable, serve it with a sane content
type, and re-run the same probes against the same site.

The terminal-first decision does not depend on the outcome. This measures whether a second,
separate claim could ever be made, not whether the current one is sound.

---

## The question

The terminal-first spec lists two locks:

| Lock             | Description                                                          | Ours to fix?                 |
| ---------------- | -------------------------------------------------------------------- | ---------------------------- |
| **Indexability** | Nothing links the file, so no index contains it                      | Yes. Link, sitemap, pointer. |
| **Preference**   | A model must choose an unknown extension over pages it already ranks | No. Standards adoption.      |

Lock 1 was declared fixable and then never fixed. This experiment fixes it and measures
whether lock 2 alone is enough to keep the file out of answers.

---

## What is already known, stated precisely

From the 2026-08-03 run against `aiuxdesign.guide`:

- `llms.gist` (15,605 bytes) and `llms.txt` (9,513 bytes) were both served and both correct
- Across three probes on two models with web search, both files were fetched **zero times**
- Zero references to either file existed in the site HTML, `sitemap.xml`, or `robots.txt`
- Control: with the URL named directly in the prompt, Claude fetched the file and answered
  perfectly, listing monetization options verbatim
- Asked to check for the convention, Claude replied that `llms.gist` is "not something I
  recognize as an established convention at all", and its speculative fetch was refused with
  `url_not_in_prior_context`

**The limit that motivates this experiment:** `llms.txt` was _also_ unlinked in that run. The
conclusion "llms.txt performed no better, so its adoption is publisher-side" is therefore
evidence about _unlinked_ `llms.txt` only. The linked case has never been tested, for either
file. Any claim about linked files is currently unevidenced in both directions.

---

## Method

Single variable: discoverability. Same site, same files, same probes, same models.

### Setup (on `aiuxdesign.guide`)

1. Link `/llms.gist` and `/llms.txt` from the site HTML. A `<link rel="alternate">` in
   `<head>` plus one visible footer link, so discovery does not depend on the crawler
   honouring `<link>`.
2. Add both URLs to `sitemap.xml`.
3. Confirm `robots.txt` allows both paths and does not block `GPTBot`, `ClaudeBot`,
   `PerplexityBot`, `Googlebot`, or `Bingbot`.
4. **Serve `.gist` as `text/plain; charset=utf-8`.** An unknown extension is served as
   `application/octet-stream` by default on most hosts, which crawlers download rather than
   index, or skip outright. Without this step a null result is uninterpretable, because it
   cannot be distinguished from a MIME configuration error.
5. Record the change date. Do not touch the file contents, so the only difference from the
   2026-08-03 baseline is reachability.

### Instrumentation

Three signals, in increasing order of what they prove:

1. **Was it crawled?** Google Search Console URL Inspection on both URLs, plus Crawl Stats.
   Note the honest limit: GSC covers Googlebot only. Coverage of `GPTBot`, `ClaudeBot`, and
   `PerplexityBot` requires server-side access logs, and Vercel's retention on the current
   plan may be too short to catch them. If logs are unavailable, say so in the result rather
   than inferring crawler behaviour from model output.
2. **Was it indexed?** GSC index status for `/llms.gist`. This is the signal that separates
   the two locks and is the main reason to run the experiment at all.
3. **Was it used?** Re-run the three 2026-08-03 probes verbatim on ChatGPT and Claude with
   web search enabled, and count citations of either file.

### Probes (unchanged from the baseline)

1. Open: what is this product, who made it, who is it for
2. Affiliation: is it the same as aiuxpatterns.com, shapeof.ai, aiverse.design
3. Internal: what monetization is it considering, what roadmap questions are open

Probe 3 remains the strongest signal, because its answers appear only in the file and nowhere
in the site HTML. Probe 2 remains the sharpest failure case, since Claude previously
recommended all three competitors by name while the file's disaffiliation section was live
and correct.

### Timing

Allow at least 14 days between setup and the probe re-run, and do not re-run until GSC shows
a crawl of the URL. Probing before a crawl measures nothing and would produce a false
negative that looks like a real one.

---

## Pre-registered predictions

Written before the run so the result cannot be rationalised afterwards.

- Crawled: **likely**, once linked and served as `text/plain`
- Indexed: **uncertain**, roughly even odds. An unknown extension serving raw markdown is an
  unusual thing for an index to keep
- Cited in probe 1 or 2: **unlikely**. These are general questions, and the homepage and
  third-party pages outrank a raw file
- Cited in probe 3: **the interesting one**. Nothing else on the open web answers it, so if
  the file is indexed and still not cited, preference is doing the work, not discovery

---

## Decision rules

Fixed in advance, so each outcome has a predetermined reading.

| Result                          | Reading                                                   | Action                                                                                                               |
| ------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Not crawled                     | Setup failure, not a finding                              | Fix robots/sitemap/content type and re-run. Do not report as evidence.                                               |
| Crawled, not indexed            | Lock 1 is deeper than "add a link"                        | Record it. The publish path stays closed. Consider whether an `.md` extension changes indexing.                      |
| Indexed, zero citations         | **Lock 2 confirmed, with evidence**                       | Strongest realistic outcome. Publish the finding. Terminal-first is vindicated on evidence rather than by inference. |
| Indexed, cited in probe 3 only  | Discovery was the binding constraint for specific queries | Do not rebuild the web product. Re-test at larger n before any claim reaches copy.                                   |
| Indexed, cited in probes 1 or 2 | The 2026-08-03 conclusion is materially incomplete        | Stop. Re-open the terminal-first decision before shipping any further positioning.                                   |

---

## Non-goals

- Rebuilding the audit gallery, the paid tier, or any removed web surface
- Changing llmsgist.org copy, the `/gist-design` skill, or the terminal-first decision on the
  strength of a single site's result
- Making `.gist` a recognised standard
- Telling users to link their files

**The last one is the real risk.** Instructing users to link the file implies the work pays
off, and that is the precise overclaim the terminal-first change removed. No instruction to
link ships to users, in the skill or in copy, until this returns a positive result at n > 1.

---

## Threats to validity

- **n = 1.** One site, one domain, one authority profile. A positive result here is a reason
  to test more sites, not a reason to make a claim.
- **Confounded authority.** `aiuxdesign.guide` has its own ranking profile. A file that
  surfaces there may not surface for a new domain with no backlinks.
- **Model drift.** The baseline was captured 2026-08-03. Both vendors ship retrieval changes
  frequently, so a difference at re-run may be a model change rather than the linking change.
  Mitigation: re-run at least one probe against a control URL that was not modified, and note
  the model versions and dates on both runs.
- **Scratch loss.** The original probe scripts lived in a session scratch directory that has
  since been deleted. The prompts are recorded above and in the 2026-08-03 spec, but the
  exact scripts are gone and will need rewriting. Transcripts of the new run should be
  committed this time rather than left in scratch.

---

## Cost

Setup is roughly an hour on the aiex side, mostly the link, the sitemap entry, and the
content-type header. The rest is waiting. The expensive part is the 14-day delay, not the
work.
