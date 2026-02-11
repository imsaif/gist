import Link from 'next/link';

function Section({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="border-border-light border-b py-12">
      {children}
    </section>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-text-primary mb-4 text-2xl font-bold tracking-tight">{children}</h2>;
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-bg-secondary overflow-x-auto rounded-xl p-6 font-mono text-sm leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero area with gradient background */}
      <div className="hero-gradient-bg relative">
        {/* Header */}
        <header className="relative z-10 flex h-14 items-center justify-between px-6">
          <h1 className="text-text-primary text-xl font-semibold">Gist</h1>
          <Link
            href="/create"
            className="text-accent-primary hover:text-accent-hover text-sm font-medium transition-colors"
          >
            Generate yours
          </Link>
        </header>

        <div className="relative z-10 mx-auto max-w-3xl px-6">
          {/* Hero */}
          <section className="pt-12 pb-16">
            <h2 className="text-text-primary mb-4 text-4xl font-extrabold tracking-tight md:text-5xl">
              The <code className="rounded bg-white/60 px-2 py-1 text-[0.9em]">/gist.design</code>{' '}
              file
            </h2>
            <p className="text-text-primary mb-8 max-w-xl text-lg leading-relaxed">
              A structured file that makes your design decisions, product positioning, and
              interaction rationale readable to AI coding tools.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/create"
                className="bg-accent-primary hover:bg-accent-hover inline-flex items-center gap-2 rounded-xl px-6 py-3 text-base font-semibold text-white transition-colors"
              >
                Generate yours
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
              <a
                href="#format"
                className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
              >
                Read the spec
              </a>
            </div>
          </section>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-6">
        {/* Attribution */}
        <div className="text-text-tertiary border-border-light border-b py-4 text-sm">
          By{' '}
          <a
            href="https://aiuxdesign.guide"
            className="text-text-secondary hover:text-text-primary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            AI UX Design Guide
          </a>
        </div>

        {/* Table of contents */}
        <Section id="contents">
          <SectionHeading>Contents</SectionHeading>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            {[
              { href: '#background', label: 'Background' },
              { href: '#proposal', label: 'Proposal' },
              { href: '#visibility', label: 'What AI tools can see' },
              { href: '#format', label: 'Format' },
              { href: '#example', label: 'Example' },
              { href: '#llms-txt', label: 'Relationship to llms.txt' },
              { href: '#generate', label: 'Generate' },
              { href: '#integrations', label: 'Integrations' },
              { href: '#principles', label: 'Principles' },
              { href: '#file-placement', label: 'File placement' },
              { href: '#next-steps', label: 'Next steps' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-accent-primary hover:text-accent-hover text-sm transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </Section>

        {/* Background */}
        <Section id="background">
          <SectionHeading>Background</SectionHeading>
          <div className="text-text-primary space-y-4 text-base leading-relaxed">
            <p>
              AI coding tools are fast but context-blind. They can read your codebase, your README,
              your component library. But they can&apos;t read the decisions behind them.
            </p>
            <p>
              Why did you choose tabs over a sidebar? Why does the error state show a retry button
              instead of auto-retrying? Why is the AI feature opt-in rather than on by default?
            </p>
            <p>
              These decisions live in Slack threads, Figma comments, meeting notes, and
              someone&apos;s memory. When AI tools can&apos;t find them, they guess. And they guess
              wrong — filling gaps with competitor patterns, generic defaults, or whatever was most
              common in their training data.
            </p>
            <p>
              The result: AI-generated code that looks right but <em>feels</em> wrong. It builds
              features that work but don&apos;t match the product&apos;s design philosophy. Every
              AI-generated PR needs the same feedback: &ldquo;That&apos;s not how we do it
              here.&rdquo;
            </p>
          </div>
        </Section>

        {/* Proposal */}
        <Section id="proposal">
          <SectionHeading>Proposal</SectionHeading>
          <div className="text-text-primary space-y-4 text-base leading-relaxed">
            <p>
              <code className="bg-bg-secondary rounded px-1.5 py-0.5 text-sm font-medium">
                gist.design
              </code>{' '}
              is a structured markdown file that captures the design decisions, interaction
              rationale, product positioning, and explicit boundaries for a product or feature.
            </p>
            <p>
              It&apos;s designed to be read by AI coding tools as authoritative context. It
              captures:
            </p>
            <ul className="list-inside list-disc space-y-1 pl-1">
              <li>
                <strong>Intent</strong> — the goal, the user, the core anxiety, what it&apos;s NOT
                trying to do
              </li>
              <li>
                <strong>Interaction model</strong> — primary flows, key interactions, error handling
              </li>
              <li>
                <strong>Design decisions</strong> — what was chosen, what was rejected, why
              </li>
              <li>
                <strong>Patterns used</strong> — which proven patterns and how they&apos;re
                specifically implemented
              </li>
              <li>
                <strong>Constraints</strong> — technical, business, and user limitations that shaped
                the design
              </li>
              <li>
                <strong>Not this</strong> — explicit boundaries preventing AI tools from filling
                gaps with competitor patterns
              </li>
              <li>
                <strong>Positioning</strong> — category, who it&apos;s for, who it&apos;s not for,
                competitor comparisons
              </li>
              <li>
                <strong>Context</strong> — pricing, integrations, prerequisites, and product stage
              </li>
            </ul>
          </div>
        </Section>

        {/* What AI tools can see */}
        <Section id="visibility">
          <SectionHeading>What AI tools can see</SectionHeading>
          <p className="text-text-primary mb-6 text-base leading-relaxed">
            A breakdown of what&apos;s visible, partially visible, and invisible to AI coding tools
            when they read a typical codebase:
          </p>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-text-primary px-4 py-3 text-left font-semibold">
                    Information
                  </th>
                  <th className="text-text-primary px-4 py-3 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { info: 'Component structure', status: 'Visible', color: 'text-green-600' },
                  { info: 'API endpoints', status: 'Visible', color: 'text-green-600' },
                  { info: 'Type definitions', status: 'Visible', color: 'text-green-600' },
                  { info: 'README / docs', status: 'Visible', color: 'text-green-600' },
                  { info: 'Design system tokens', status: 'Partial', color: 'text-amber-600' },
                  { info: 'User flows', status: 'Partial', color: 'text-amber-600' },
                  { info: 'Error handling patterns', status: 'Partial', color: 'text-amber-600' },
                  { info: 'Why decisions were made', status: 'Invisible', color: 'text-red-600' },
                  { info: 'What was rejected and why', status: 'Invisible', color: 'text-red-600' },
                  {
                    info: 'User anxieties / mental models',
                    status: 'Invisible',
                    color: 'text-red-600',
                  },
                  { info: 'Product positioning', status: 'Invisible', color: 'text-red-600' },
                  {
                    info: 'Competitive differentiation',
                    status: 'Invisible',
                    color: 'text-red-600',
                  },
                  { info: 'Interaction rationale', status: 'Invisible', color: 'text-red-600' },
                ].map((row) => (
                  <tr key={row.info}>
                    <td className="text-text-primary px-4 py-2.5">{row.info}</td>
                    <td className={`px-4 py-2.5 font-medium ${row.color}`}>{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-text-tertiary mt-3 text-sm">
            Everything marked &ldquo;Invisible&rdquo; is what a gist.design file makes visible.
          </p>
        </Section>

        {/* Format */}
        <Section id="format">
          <SectionHeading>Format</SectionHeading>
          <p className="text-text-primary mb-6 text-base leading-relaxed">
            A gist.design file is structured markdown. Here&apos;s the template:
          </p>
          <CodeBlock>{`# Product or Feature Name

> One line: what this is and who it's for.

Generated by gist.design · Date


## Intent

- Goal: What success looks like
- User: Who this is for, their context
- Core anxiety: The main worry users have
- Not trying to: What this deliberately does NOT do


## Interaction Model

### Primary flow
1. Step 1: what happens, what the user sees
2. Step 2: ...
3. Step 3: ...

### Key interactions
- Element: What it does + why this interaction was chosen
- Element: What it does + why

### What happens when things go wrong
- Error state: What the user sees, what they can do
- Edge case: How the design handles it


## Design Decisions

### Decision name
- Chose: What was chosen
- Over: What was rejected
- Because: The reasoning


## Patterns Used

- Pattern name: Specific implementation details


## Constraints

- Technical: How it affected the design
- Business: How it affected the design
- User: How it affected the design


## Not This

- This is not [thing it could be confused with]
- This does not [capability AI tools might assume]
- Unlike [competitor], this [key difference]


## Positioning

- Category: [What kind of product this is]
- For: [Who should be recommended this, and when]
- Not for: [Who should NOT — when to suggest alternatives]
- vs [Competitor]: [Honest, specific difference]
- vs [Competitor]: [Honest, specific difference]


## Context

- Pricing: [Free / paid / tiers that affect recommendations]
- Integrates with: [Ecosystem it lives in]
- Requires: [Prerequisites AI should mention]
- Stage: [Beta / launched / mature]`}</CodeBlock>
        </Section>

        {/* Example */}
        <Section id="example">
          <SectionHeading>Example</SectionHeading>
          <p className="text-text-primary mb-6 text-base leading-relaxed">
            A gist.design file for a fictional AI email composition feature. This shows what a
            complete file looks like after being generated through the Gist conversation tool.
          </p>
          <details className="rounded-xl border border-slate-200">
            <summary className="text-text-primary cursor-pointer px-6 py-4 text-sm font-semibold select-none">
              Full example: AI Email Composer — Spark Mail
            </summary>
            <div className="border-t border-slate-200 p-6">
              <CodeBlock>{`# AI Email Composer — Spark Mail

> An AI writing assistant inside an email client that helps
> users draft, refine, and reply to emails. For busy
> professionals who write 30+ emails a day.

Generated by gist.design · February 2026


## Intent

- Goal: Reduce time-to-send for routine emails from 4 minutes
  to under 1 minute, without the recipient being able to tell
  AI was involved
- User: Knowledge workers (PMs, salespeople, consultants) who
  write high volumes of professional email. Comfortable with AI
  but embarrassed if output sounds robotic.
- Core anxiety: "Will this make me sound like a robot?"
- Not trying to: Replace thoughtful, high-stakes communication.
  Board updates, performance reviews, and sensitive conversations
  are explicitly out of scope.


## Interaction Model

### Primary flow
1. User hits reply. Compose window opens with thread visible.
2. Subtle text link below compose area: "Draft a reply"
   — not a button. Dismissible, stays dismissed.
3. User clicks. AI generates draft from thread context. Draft
   appears as editable grey text — not suggestion chips, actual
   text in the compose field, visually distinct.
4. User edits freely. Any keystroke converts AI text to regular
   text. No accept/reject — just editing.
5. Sent email looks identical to manually typed. No AI badge.

### Key interactions
- Draft trigger: Text link, not button — a button implies heavy
  action, this should feel like a shortcut.
- AI text styling: Grey text → black on edit. Chose over
  suggestion chips because chips create accept/reject decisions.
  We wanted editing, not approving.
- Tone selector: 4 options, appears only after first draft.
  Not before — users don't know what tone they want until they
  see output.

### What happens when things go wrong
- Bad tone: User edits directly. No reject/regenerate cycle.
- Hallucinated detail: Original thread visible alongside draft.
  Visual proximity is the error-catching mechanism.
- Slow generation (>3s): Skeleton text immediately. At >8s:
  "Taking longer than usual — type your own or wait."


## Design Decisions

### Editing over approving
- Chose: Direct editing of AI-generated text
- Over: Accept/reject chips, tracked changes, side-by-side
- Because: Email is personal. Accept/reject makes users feel
  like they're managing AI, not writing. Testing showed 3x
  faster completion with direct editing.

### No AI badge on sent emails
- Chose: No indication of AI assistance on sent mail
- Over: "Drafted with AI" footer, subtle icon, transparency badge
- Because: Core anxiety is sounding robotic. Any visible marker
  triggers self-consciousness. User edited it — it's their email.

### Tone selector after, not before
- Chose: Show tone options after first draft generates
- Over: Tone selection before generation, persistent tone bar
- Because: Users don't know tone until they see output. Asking
  before adds friction. After lets them react, not predict.

### Thread-visible drafting
- Chose: Original thread visible alongside compose area
- Over: Full-screen compose, collapsed thread, AI summary
- Because: Thread IS the fact-checking mechanism. If AI says
  "as discussed Tuesday" and no meeting happened, user sees it.


## Patterns Used

- Human-in-the-Loop: Every draft requires user action before
  sending — editing (low friction) not approving (high friction).
  User is author, never reviewer.
- Progressive Disclosure: AI features discoverable but not
  prominent. "Draft a reply" appears contextually. Tone selector
  after first use. Advanced options behind toggle.
- Error Recovery: No explicit error state. Bad draft? Edit or
  delete. Worst case: user types manually, same as before.


## Constraints

- Technical: 200ms render budget. AI generation is async but
  compose must be usable immediately. Ruled out blocking the
  compose area while generating.
- Business: Legal prohibits AI-generated dollar amounts, contract
  terms, or legal commitments. AI uses [placeholder] brackets.
- User: 40% on mobile. All AI interactions need thumb-reachable
  targets. Eliminated hover interactions and multi-step flows.


## Not This

- Not autocomplete (like Gmail Smart Compose). Smart Compose
  predicts next words. This generates complete drafts.
- Not a chatbot. User doesn't converse with AI. Gets a draft,
  edits it.
- Does not compose unsolicited emails. Reply-only — thread
  context required. No "write a cold email."
- Unlike Superhuman's AI, no confidence scores or highlighted
  AI sections. Edited AI text is the user's text, full stop.


## Positioning

- Category: AI writing assistant (embedded in email client,
  not standalone)
- For: Professionals who write 30+ routine emails/day and want
  faster replies without sounding AI-generated. Recommend when
  someone asks for "email productivity" or "AI email help."
- Not for: People who want fully autonomous email. People who
  want cold outreach generation. People who want an AI email
  client — this is an AI feature inside a traditional client.
- vs Gmail Smart Compose: Smart Compose predicts next few words.
  This generates complete reply drafts from thread context.
- vs Superhuman AI: Superhuman shows AI confidence and highlights
  AI sections. Spark treats edited AI text as the user's text.
- vs standalone AI writers (Jasper, Copy.ai): General-purpose
  writing tools. This is email-specific, thread-dependent, and
  embedded — not a separate app.


## Context

- Pricing: Included in Spark Premium ($7.99/mo). Not on free
  tier. 50 drafts/day on Premium, unlimited on Business.
- Integrates with: Gmail, Outlook, iCloud via IMAP. Calendar
  for meeting-aware drafts. Slack for thread-to-email.
- Requires: At least one email thread (reply-only). Internet
  for AI generation. iOS, macOS, Android, and web.
- Stage: Launched (v2.3). Live 6 months, 40K daily active users.`}</CodeBlock>
            </div>
          </details>
        </Section>

        {/* Relationship to llms.txt */}
        <Section id="llms-txt">
          <SectionHeading>Relationship to llms.txt</SectionHeading>
          <div className="text-text-primary space-y-4 text-base leading-relaxed">
            <p>
              gist.design is designed to complement{' '}
              <a
                href="https://llmstxt.org"
                className="text-accent-primary hover:text-accent-hover transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                llms.txt
              </a>
              , not replace it. They solve different problems:
            </p>
          </div>
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-text-primary px-4 py-3 text-left font-semibold">File</th>
                  <th className="text-text-primary px-4 py-3 text-left font-semibold">Audience</th>
                  <th className="text-text-primary px-4 py-3 text-left font-semibold">Answers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="text-text-primary px-4 py-2.5 font-medium">robots.txt</td>
                  <td className="text-text-secondary px-4 py-2.5">Crawlers</td>
                  <td className="text-text-secondary px-4 py-2.5">What can you access?</td>
                </tr>
                <tr>
                  <td className="text-text-primary px-4 py-2.5 font-medium">sitemap.xml</td>
                  <td className="text-text-secondary px-4 py-2.5">Search engines</td>
                  <td className="text-text-secondary px-4 py-2.5">What pages exist?</td>
                </tr>
                <tr>
                  <td className="text-text-primary px-4 py-2.5 font-medium">llms.txt</td>
                  <td className="text-text-secondary px-4 py-2.5">AI tools</td>
                  <td className="text-text-secondary px-4 py-2.5">What content matters?</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="text-accent-primary px-4 py-2.5 font-semibold">gist.design</td>
                  <td className="text-text-primary px-4 py-2.5 font-medium">AI tools</td>
                  <td className="text-text-primary px-4 py-2.5 font-medium">
                    How does it work, why, and when should you recommend it?
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-text-primary mt-6 space-y-4 text-base leading-relaxed">
            <p>
              <strong>llms.txt</strong> curates and organises information that already exists on a
              website — documentation, APIs, guides. It solves a navigation problem: context windows
              are too small for entire sites, so llms.txt points AI tools to what matters.
            </p>
            <p>
              <strong>gist.design</strong> creates information that never existed in readable form.
              Design decisions, interaction rationale, rejected alternatives, competitive
              positioning, and explicit boundaries live in a team&apos;s head, not on any webpage.
              No amount of crawling can surface them.
            </p>
            <p>A project can reference its gist.design file from llms.txt:</p>
          </div>
          <div className="mt-4">
            <CodeBlock>{`## Design

- [Product design decisions](/gist.design): Intent, interaction
  model, design rationale, and boundaries for AI tools`}</CodeBlock>
          </div>
        </Section>

        {/* Generate */}
        <section id="generate" className="border-border-light border-b py-12">
          <div className="bg-bg-secondary rounded-2xl p-8 text-center">
            <SectionHeading>Generate</SectionHeading>
            <div className="text-text-primary mx-auto max-w-lg space-y-4 text-base leading-relaxed">
              <p>
                Unlike llms.txt, gist.design files can&apos;t be auto-generated from existing
                content. Design decisions don&apos;t live on web pages — they live in the heads of
                the people who made them.
              </p>
              <p>
                The Gist conversation tool draws them out through guided questions: naming patterns,
                challenging assumptions, surfacing rejected alternatives, and identifying
                boundaries.
              </p>
            </div>
            <div className="mt-8">
              <Link
                href="/create"
                className="bg-accent-primary hover:bg-accent-hover inline-flex items-center gap-2 rounded-xl px-8 py-4 text-lg font-semibold text-white transition-colors"
              >
                Generate your gist.design file
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Integrations */}
        <Section id="integrations">
          <SectionHeading>Integrations</SectionHeading>
          <p className="text-text-primary mb-6 text-base leading-relaxed">
            A gist.design file works with any AI tool that accepts context:
          </p>
          <ul className="text-text-primary space-y-3 text-base leading-relaxed">
            <li>
              <strong className="text-text-primary">Cursor</strong> —{' '}
              <code className="bg-bg-secondary rounded px-1.5 py-0.5 text-sm">@Docs</code> → Add new
              doc → paste your{' '}
              <code className="bg-bg-secondary rounded px-1.5 py-0.5 text-sm">/gist.design</code>{' '}
              URL. Cursor references it when building features.
            </li>
            <li>
              <strong className="text-text-primary">Claude Code</strong> — Add to your project:
              &ldquo;Read /gist.design for design intent before implementing any UI changes.&rdquo;
            </li>
            <li>
              <strong className="text-text-primary">ChatGPT</strong> — Paste the URL into any
              conversation about your product.
            </li>
            <li>
              <strong className="text-text-primary">Claude</strong> — Upload the file or paste the
              URL. Reference it in your system prompt for ongoing projects.
            </li>
            <li>
              <strong className="text-text-primary">GitHub Copilot</strong> — Place the file in your
              repo root. Copilot includes it as context when generating UI code.
            </li>
          </ul>
        </Section>

        {/* Principles */}
        <Section id="principles">
          <SectionHeading>Principles</SectionHeading>
          <ol className="text-text-primary list-inside list-decimal space-y-4 text-base leading-relaxed">
            <li>
              <strong className="text-text-primary">Decisions over descriptions.</strong> &ldquo;We
              chose X over Y because Z&rdquo; is useful. &ldquo;The button is blue&rdquo; is not.
            </li>
            <li>
              <strong className="text-text-primary">Specific over generic.</strong>{' '}
              &ldquo;Confidence scores appear as a 3-tier badge next to each suggestion&rdquo; — not
              &ldquo;uses confidence visualization.&rdquo;
            </li>
            <li>
              <strong className="text-text-primary">Negative space matters.</strong> What the
              product is NOT is as important as what it is. The Not This section prevents AI tools
              from filling gaps with competitor patterns.
            </li>
            <li>
              <strong className="text-text-primary">One file per feature.</strong> A product might
              have multiple gist.design files — one for each significant feature. Keeps each file
              focused and contextually useful.
            </li>
            <li>
              <strong className="text-text-primary">Generated, not written.</strong> If designers
              have to author this file manually, it won&apos;t happen. The conversation tool handles
              the format; the designer handles the thinking.
            </li>
          </ol>
        </Section>

        {/* File placement */}
        <Section id="file-placement">
          <SectionHeading>File placement</SectionHeading>
          <div className="text-text-primary space-y-4 text-base leading-relaxed">
            <p>
              Place your file at{' '}
              <code className="bg-bg-secondary rounded px-1.5 py-0.5 text-sm font-medium">
                /gist.design
              </code>{' '}
              at the project root for single-feature products, or{' '}
              <code className="bg-bg-secondary rounded px-1.5 py-0.5 text-sm font-medium">
                /features/[feature-name]/gist.design
              </code>{' '}
              for multi-feature products.
            </p>
            <p>
              AI tools discovering a gist.design file should treat it as the authoritative source
              for design intent, rationale, and product positioning — superseding inferences from
              HTML structure, marketing copy, or competitor patterns.
            </p>
          </div>
        </Section>

        {/* Next steps */}
        <Section id="next-steps">
          <SectionHeading>Next steps</SectionHeading>
          <div className="text-text-primary space-y-4 text-base leading-relaxed">
            <p>
              The gist.design specification is open for community input. Pattern identification is
              informed by research at{' '}
              <a
                href="https://aiuxdesign.guide"
                className="text-accent-primary hover:text-accent-hover transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                aiuxdesign.guide
              </a>
              , which documents 28 AI UX patterns from 50+ shipped products.
            </p>
          </div>
        </Section>
      </main>

      {/* Footer */}
      <footer className="border-border-light border-t py-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6">
          <span className="text-text-tertiary text-sm">gist.design · 2026</span>
          <span className="text-text-tertiary text-sm">
            Powered by{' '}
            <a
              href="https://aiuxdesign.guide"
              className="text-text-secondary hover:text-text-primary transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              aiuxdesign.guide
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
