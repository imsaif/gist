import Link from 'next/link';

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-background-secondary overflow-x-auto rounded-xl p-6 font-mono text-sm leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}

export default function SpecPage() {
  return (
    <div className="bg-background-primary min-h-screen">
      <header className="flex h-14 items-center justify-between px-6">
        <Link href="/" className="text-ink-primary text-xl font-semibold">
          llms.gist
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-ink-secondary hover:text-ink-primary text-sm font-medium transition-colors"
          >
            Audit
          </Link>
          <Link
            href="/spec"
            className="text-brand-primary hover:text-brand-hover text-sm font-medium transition-colors"
          >
            Spec
          </Link>
        </nav>
      </header>

      {/* Hero — grain texture */}
      <section className="bg-background-grain bg-grain relative">
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-12 md:pt-20 md:pb-16">
          <div className="max-w-3xl">
            <div className="eyebrow mb-3">Open specification</div>
            <h1 className="text-ink-primary mb-4 text-5xl font-extrabold tracking-tight md:text-6xl">
              .gist
            </h1>
            <p className="text-ink-secondary mb-6 text-lg leading-relaxed">
              An open file format that tells AI tools what your product is, who it&apos;s for, and
              what they commonly get wrong. Positioning, audience, &ldquo;not for&rdquo;, and
              before/after corrections — the context LLMs and AI coding assistants can&apos;t infer
              from your HTML.
            </p>
            <p className="text-ink-secondary mb-6 text-base leading-relaxed">
              Free to use, community-maintained, and tool-agnostic. Works alongside{' '}
              <a
                href="https://llmstxt.org"
                className="text-brand-primary hover:text-brand-hover transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                llms.txt
              </a>
              . Generate one yourself with the Claude Code skill below, or produce one as the output
              of an audit at{' '}
              <Link
                href="/"
                className="text-brand-primary hover:text-brand-hover transition-colors"
              >
                llms.gist
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 pt-16 pb-16 md:pt-20 md:pb-20">
        {/* Reference table */}
        <section className="mb-16">
          <h2 className="text-ink-primary mb-4 text-2xl font-bold tracking-tight">Where it fits</h2>
          <div className="glass-strong overflow-hidden rounded-2xl">
            <table className="w-full text-base">
              <thead>
                <tr className="border-border-primary bg-background-secondary border-b">
                  <th className="text-ink-primary px-5 py-3.5 text-left font-semibold">File</th>
                  <th className="text-ink-primary px-5 py-3.5 text-left font-semibold">
                    Audience and purpose
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border-primary divide-y">
                <tr>
                  <td className="text-ink-primary px-5 py-3.5 font-medium">robots.txt</td>
                  <td className="text-ink-secondary px-5 py-3.5">
                    Crawlers — what can you access?
                  </td>
                </tr>
                <tr>
                  <td className="text-ink-primary px-5 py-3.5 font-medium">sitemap.xml</td>
                  <td className="text-ink-secondary px-5 py-3.5">
                    Search engines — what pages exist?
                  </td>
                </tr>
                <tr>
                  <td className="text-ink-primary px-5 py-3.5 font-medium">
                    <a
                      href="https://llmstxt.org"
                      className="text-ink-primary hover:text-brand-primary transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      llms.txt
                    </a>
                  </td>
                  <td className="text-ink-secondary px-5 py-3.5">
                    LLMs — what does this product do?
                  </td>
                </tr>
                <tr className="bg-brand-primary/[0.08]">
                  <td className="text-brand-primary px-5 py-3.5 font-semibold">.gist</td>
                  <td className="text-ink-primary px-5 py-3.5 font-medium">
                    LLMs and AI coding tools — how should you talk about this product? Positioning,
                    audience, boundaries, and corrections.
                  </td>
                </tr>
                <tr>
                  <td className="text-ink-primary px-5 py-3.5 font-medium">File placement</td>
                  <td className="text-ink-secondary px-5 py-3.5">
                    <code className="bg-background-secondary rounded px-1.5 py-0.5 text-sm">
                      /llms.gist
                    </code>{' '}
                    at the project root (mirrors{' '}
                    <code className="bg-background-secondary rounded px-1.5 py-0.5 text-sm">
                      /llms.txt
                    </code>
                    ), or{' '}
                    <code className="bg-background-secondary rounded px-1.5 py-0.5 text-sm">
                      /features/[name].gist
                    </code>{' '}
                    for per-feature variants.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* llms.txt comparison */}
        <section className="mb-16">
          <h2 className="text-ink-primary mb-4 text-2xl font-bold tracking-tight">
            How does this relate to llms.txt?
          </h2>
          <p className="text-ink-secondary mb-6 max-w-3xl text-base leading-relaxed">
            They&apos;re complementary. Use both.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="card-interactive p-6">
              <code className="bg-background-secondary text-ink-primary mb-3 inline-block rounded px-2 py-1 text-sm font-semibold">
                llms.txt
              </code>
              <h3 className="text-ink-primary mb-2 text-lg font-semibold">What it does</h3>
              <p className="text-ink-secondary text-base leading-relaxed">
                A README for LLMs. Features, links, how to use it.
              </p>
              <p className="text-ink-tertiary mt-4 text-sm italic">
                &ldquo;Acme is a project management tool with kanban boards.&rdquo;
              </p>
            </div>
            <div className="card-interactive border-brand-primary/40 border-2 p-6">
              <code className="bg-brand-primary/20 text-brand-primary mb-3 inline-block rounded px-2 py-1 text-sm font-semibold">
                .gist
              </code>
              <h3 className="text-ink-primary mb-2 text-lg font-semibold">How to talk about it</h3>
              <p className="text-ink-secondary text-base leading-relaxed">
                Positioning, audience, and corrections. Stops LLMs from getting your product wrong.
              </p>
              <p className="text-ink-tertiary mt-4 text-sm italic">
                &ldquo;Not for enterprise. No Gantt charts. ChatGPT often calls this a project
                manager — it&apos;s an issue tracker.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* Generate it yourself (skill) */}
        <section className="mb-16">
          <h2 className="text-ink-primary mb-4 text-2xl font-bold tracking-tight">
            Generate a file yourself
          </h2>
          <p className="text-ink-secondary mb-6 max-w-3xl text-base leading-relaxed">
            Install the Claude Code skill. Works in any project.
          </p>
          <CodeBlock>{`curl -fsSL https://raw.githubusercontent.com/imsaif/gist/main/install.sh | bash

# then, in Claude Code:
/gist-design          # audit your current project
/gist-design quick    # generate a starter file in 2-3 turns
/gist-design create   # full guided conversation`}</CodeBlock>
          <p className="text-ink-tertiary mt-4 text-sm">
            Source on{' '}
            <a
              href="https://github.com/imsaif/gist"
              className="text-ink-secondary hover:text-ink-primary transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            .
          </p>
        </section>

        {/* Format + example */}
        <section>
          <h2 className="text-ink-primary mb-4 text-2xl font-bold tracking-tight">
            Format and example
          </h2>
          <p className="text-ink-secondary mb-8 max-w-3xl text-base leading-relaxed">
            A .gist file is structured markdown. Below is the template alongside a completed
            example.
          </p>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <p className="text-ink-tertiary mb-3 text-xs font-semibold tracking-wider uppercase">
                Template
              </p>
              <CodeBlock>{`# Product or Feature Name

> One line: what this is and who it's for.

Generated by gist · Date


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


## Positioning (AEO: how LLMs should represent this product)

- Category: [What kind of product this is]
- For: [Who should be recommended this, and when]
- Not for: [Who should NOT, when to suggest alternatives]
- vs [Competitor]: [Honest, specific difference]
- vs [Competitor]: [Honest, specific difference]


## Context (AEO: facts LLMs need for accurate recommendations)

- Pricing: [Free / paid / tiers that affect recommendations]
- Integrates with: [Ecosystem it lives in]
- Requires: [Prerequisites AI should mention]
- Stage: [Beta / launched / mature]`}</CodeBlock>
            </div>
            <div>
              <p className="text-ink-tertiary mb-3 text-xs font-semibold tracking-wider uppercase">
                Example
              </p>
              <CodeBlock>{`# AI Email Composer, Spark Mail

> An AI writing assistant inside an email client that helps
> users draft, refine, and reply to emails. For busy
> professionals who write 30+ emails a day.

Generated by gist · February 2026


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
   (not a button). Dismissible, stays dismissed.
3. User clicks. AI generates draft from thread context. Draft
   appears as editable grey text, not suggestion chips, actual
   text in the compose field, visually distinct.
4. User edits freely. Any keystroke converts AI text to regular
   text. No accept/reject, just editing.
5. Sent email looks identical to manually typed. No AI badge.

### Key interactions
- Draft trigger: Text link, not button. A button implies heavy
  action, this should feel like a shortcut.
- AI text styling: Grey text → black on edit. Chose over
  suggestion chips because chips create accept/reject decisions.
  We wanted editing, not approving.
- Tone selector: 4 options, appears only after first draft.
  Not before. Users don't know what tone they want until they
  see output.

### What happens when things go wrong
- Bad tone: User edits directly. No reject/regenerate cycle.
- Hallucinated detail: Original thread visible alongside draft.
  Visual proximity is the error-catching mechanism.
- Slow generation (>3s): Skeleton text immediately. At >8s:
  "Taking longer than usual. Type your own or wait."


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
  triggers self-consciousness. User edited it. It's their email.

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
  sending: editing (low friction) not approving (high friction).
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
- Does not compose unsolicited emails. Reply-only, thread
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
  client. This is an AI feature inside a traditional client.
- vs Gmail Smart Compose: Smart Compose predicts next few words.
  This generates complete reply drafts from thread context.
- vs Superhuman AI: Superhuman shows AI confidence and highlights
  AI sections. Spark treats edited AI text as the user's text.
- vs standalone AI writers (Jasper, Copy.ai): General-purpose
  writing tools. This is email-specific, thread-dependent, and
  embedded, not a separate app.


## Context

- Pricing: Included in Spark Premium ($7.99/mo). Not on free
  tier. 50 drafts/day on Premium, unlimited on Business.
- Integrates with: Gmail, Outlook, iCloud via IMAP. Calendar
  for meeting-aware drafts. Slack for thread-to-email.
- Requires: At least one email thread (reply-only). Internet
  for AI generation. iOS, macOS, Android, and web.
- Stage: Launched (v2.3). Live 6 months, 40K daily active users.`}</CodeBlock>
            </div>
          </div>
        </section>
      </div>

      <footer className="py-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <span className="text-ink-tertiary text-sm">.gist spec · MIT licensed</span>
          <span className="text-ink-tertiary text-sm">
            Maintained by{' '}
            <Link href="/" className="text-ink-secondary hover:text-ink-primary transition-colors">
              llms.gist
            </Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
