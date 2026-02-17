import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  RocketLaunchIcon,
  SwatchIcon,
  ExclamationTriangleIcon,
  CommandLineIcon,
  ChatBubbleLeftRightIcon,
  ScaleIcon,
  ViewfinderCircleIcon,
  NoSymbolIcon,
  DocumentIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

function Section({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="py-16 md:py-20">
      {children}
    </section>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-text-primary mb-4 text-3xl font-bold tracking-tight">{children}</h2>;
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
    <div className="bg-bg-primary min-h-screen">
      {/* Hero area with gradient background */}
      <div className="hero-gradient-bg relative">
        {/* Header */}
        <header className="relative z-10 flex h-14 items-center justify-between px-6">
          <h1 className="text-text-primary text-xl font-semibold">Gist</h1>
          <nav className="flex items-center gap-6">
            <Link
              href="/audit"
              className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
            >
              Audit
            </Link>
            <Link
              href="/create"
              className="text-accent-primary hover:text-accent-hover text-sm font-medium transition-colors"
            >
              Create
            </Link>
          </nav>
        </header>

        <div className="relative z-10 mx-auto max-w-3xl px-6">
          {/* Hero */}
          <section className="pt-12 pb-16">
            <h2 className="text-text-primary mb-4 text-4xl font-extrabold tracking-tight md:text-5xl">
              AI tools are describing your product right now. Are they getting it right?
            </h2>
            <p className="text-text-primary mb-8 max-w-xl text-lg leading-relaxed">
              Run a free audit to see how ChatGPT, Claude, and Perplexity describe your product.
              Then fix the gaps with a{' '}
              <code className="bg-bg-secondary rounded px-1.5 py-0.5 text-[0.9em]">
                gist.design
              </code>{' '}
              file.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/audit"
                className="bg-accent-primary hover:bg-accent-hover inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-base font-semibold text-white transition-colors"
              >
                Run free audit
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
              <Link
                href="/create"
                className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
              >
                Skip to create
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

      {/* How it works */}
      <div className="bg-bg-primary">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <h2 className="text-text-primary mb-8 text-center text-3xl font-bold tracking-tight">
            How it works
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="border-border-light bg-bg-primary overflow-hidden rounded-2xl border">
              <div
                className="bg-bg-secondary flex h-48 items-center justify-center"
                style={{
                  background:
                    'var(--bg-secondary) radial-gradient(circle, rgba(129,140,248,0.15) 0%, transparent 70%)',
                }}
              >
                <MagnifyingGlassIcon className="text-accent-primary h-10 w-10" />
              </div>
              <div className="p-5 text-center">
                <h3 className="text-text-primary mb-1 text-lg font-semibold">Audit</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  See how 3 LLMs describe your product from your website alone. Find the gaps.
                </p>
              </div>
            </div>
            <div className="border-border-light bg-bg-primary overflow-hidden rounded-2xl border">
              <div
                className="bg-bg-secondary flex h-48 items-center justify-center"
                style={{
                  background:
                    'var(--bg-secondary) radial-gradient(circle, rgba(129,140,248,0.15) 0%, transparent 70%)',
                }}
              >
                <PencilSquareIcon className="text-accent-primary h-10 w-10" />
              </div>
              <div className="p-5 text-center">
                <h3 className="text-text-primary mb-1 text-lg font-semibold">Fill gaps</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Generate a gist.design file through guided conversation. Capture what AI tools
                  miss.
                </p>
              </div>
            </div>
            <div className="border-border-light bg-bg-primary overflow-hidden rounded-2xl border">
              <div
                className="bg-bg-secondary flex h-48 items-center justify-center"
                style={{
                  background:
                    'var(--bg-secondary) radial-gradient(circle, rgba(129,140,248,0.15) 0%, transparent 70%)',
                }}
              >
                <ShieldCheckIcon className="text-accent-primary h-10 w-10" />
              </div>
              <div className="p-5 text-center">
                <h3 className="text-text-primary mb-1 text-lg font-semibold">Verify and deploy</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Re-run the audit with your gist.design file. See the before/after improvement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Who this is for */}
      <div className="bg-bg-primary">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <h2 className="text-text-primary mb-8 text-center text-3xl font-bold tracking-tight">
            Who this is for
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                role: 'Product teams',
                pain: "AI coding tools keep building features wrong because they can't read your design decisions.",
                icon: UserGroupIcon,
              },
              {
                role: 'Founders',
                pain: 'LLMs describe your product as a clone of your competitor because your positioning is invisible.',
                icon: RocketLaunchIcon,
              },
              {
                role: 'Designers',
                pain: 'Your "chose X over Y because Z" rationale lives in Figma comments and Slack threads, not where AI tools can find it.',
                icon: SwatchIcon,
              },
            ].map((item) => (
              <div
                key={item.role}
                className="border-border-light bg-bg-primary overflow-hidden rounded-2xl border"
              >
                <div
                  className="bg-bg-secondary flex h-48 items-center justify-center"
                  style={{
                    background:
                      'var(--bg-secondary) radial-gradient(circle, rgba(129,140,248,0.15) 0%, transparent 70%)',
                  }}
                >
                  <item.icon className="text-accent-primary h-10 w-10" />
                </div>
                <div className="p-5 text-center">
                  <h3 className="text-text-primary mb-1 text-lg font-semibold">{item.role}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{item.pain}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6">
        {/* Background */}
        <Section id="background">
          <SectionHeading>Background</SectionHeading>
          <p className="text-text-primary text-base leading-relaxed">
            AI tools can read your code but not the decisions behind it. They fill gaps with
            competitor patterns, generic defaults, and wrong positioning.
          </p>
        </Section>

        {/* What this file solves */}
        <Section id="failure-modes">
          <SectionHeading>What this file solves</SectionHeading>
          <div className="border-border-light overflow-hidden rounded-2xl border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-border-light bg-bg-secondary border-b">
                  <th className="text-text-primary px-5 py-3.5 text-left font-semibold">
                    <span className="inline-flex items-center gap-1.5">
                      <ExclamationTriangleIcon className="text-text-secondary h-4 w-4" />
                      Without gist.design
                    </span>
                  </th>
                  <th className="text-text-primary px-5 py-3.5 text-left font-semibold">
                    <span className="inline-flex items-center gap-1.5">
                      <ShieldCheckIcon className="text-accent-primary h-4 w-4" />
                      What prevents it
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border-light divide-y">
                {[
                  {
                    failure:
                      'AI coding tool builds auto-execute when you designed for user approval',
                    fix: 'Design Decisions: "chose X over Y because Z"',
                  },
                  {
                    failure:
                      'AI fills gaps with competitor patterns your product deliberately avoids',
                    fix: 'Not This: explicit boundaries on what this is not',
                  },
                  {
                    failure: 'LLM recommends your product to the wrong audience',
                    fix: "Positioning: who it's for and who it's not for",
                  },
                  {
                    failure: 'LLM describes your product as a clone of a competitor',
                    fix: 'Positioning: vs comparisons with honest differences',
                  },
                ].map((row) => (
                  <tr key={row.failure}>
                    <td className="text-text-primary px-5 py-3 text-[15px]">{row.failure}</td>
                    <td className="text-text-secondary px-5 py-3 text-[15px]">{row.fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Proposal */}
        <Section id="proposal">
          <SectionHeading>Proposal</SectionHeading>
          <p className="text-text-primary text-base leading-relaxed">
            <code className="bg-bg-secondary rounded px-1.5 py-0.5 text-sm font-medium">
              gist.design
            </code>{' '}
            is a structured markdown file that captures design decisions, interaction rationale,
            product positioning, and explicit boundaries. AI coding tools read it from the codebase
            to build features that match design intent. LLMs read it to give accurate
            recommendations instead of guessing from training data.
          </p>
        </Section>
      </div>

      {/* Format & Example — wider container for side-by-side code blocks */}
      <div className="mx-auto max-w-6xl px-6">
        <Section id="format">
          <SectionHeading>Format &amp; Example</SectionHeading>
          <details className="border-border-light bg-bg-secondary overflow-hidden rounded-xl border">
            <summary className="text-text-primary cursor-pointer px-6 py-4 text-sm font-semibold select-none">
              View template &amp; example
            </summary>
            <div className="border-border-light border-t p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-text-tertiary mb-2 text-xs font-semibold tracking-wider uppercase">
                    Template
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
                <div id="example">
                  <p className="text-text-tertiary mb-2 text-xs font-semibold tracking-wider uppercase">
                    Example
                  </p>
                  <CodeBlock>{`# AI Email Composer, Spark Mail

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
            </div>
          </details>
        </Section>
      </div>

      <div className="mx-auto max-w-3xl px-6">
        {/* Relationship to llms.txt */}
        <Section id="llms-txt">
          <SectionHeading>Relationship to llms.txt</SectionHeading>
          <p className="text-text-primary mb-6 text-base leading-relaxed">
            <a
              href="https://llmstxt.org"
              className="text-accent-primary hover:text-accent-hover transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              llms.txt
            </a>{' '}
            curates existing content; gist.design creates information that never existed in readable
            form.
          </p>
          <div className="border-border-light overflow-hidden rounded-2xl border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-border-light bg-bg-secondary border-b">
                  <th className="text-text-primary px-5 py-3.5 text-left font-semibold">File</th>
                  <th className="text-text-primary px-5 py-3.5 text-left font-semibold">
                    Audience
                  </th>
                  <th className="text-text-primary px-5 py-3.5 text-left font-semibold">Answers</th>
                </tr>
              </thead>
              <tbody className="divide-border-light divide-y">
                <tr>
                  <td className="text-text-primary px-5 py-3 text-[15px] font-medium">
                    robots.txt
                  </td>
                  <td className="text-text-secondary px-5 py-3 text-[15px]">Crawlers</td>
                  <td className="text-text-secondary px-5 py-3 text-[15px]">
                    What can you access?
                  </td>
                </tr>
                <tr>
                  <td className="text-text-primary px-5 py-3 text-[15px] font-medium">
                    sitemap.xml
                  </td>
                  <td className="text-text-secondary px-5 py-3 text-[15px]">Search engines</td>
                  <td className="text-text-secondary px-5 py-3 text-[15px]">What pages exist?</td>
                </tr>
                <tr>
                  <td className="text-text-primary px-5 py-3 text-[15px] font-medium">llms.txt</td>
                  <td className="text-text-secondary px-5 py-3 text-[15px]">LLMs</td>
                  <td className="text-text-secondary px-5 py-3 text-[15px]">
                    What content matters?
                  </td>
                </tr>
                <tr className="bg-bg-secondary">
                  <td className="text-accent-primary px-5 py-3 text-[15px] font-semibold">
                    gist.design
                  </td>
                  <td className="text-text-primary px-5 py-3 text-[15px] font-medium">
                    AI coding tools + LLMs
                  </td>
                  <td className="text-text-primary px-5 py-3 text-[15px] font-medium">
                    How does it work, why, and when should you recommend it?
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* Generate */}
        <section id="generate" className="py-16 md:py-20">
          <div className="bg-bg-secondary rounded-2xl p-8 text-center">
            <SectionHeading>Generate</SectionHeading>
            <p className="text-text-primary mx-auto max-w-lg text-base leading-relaxed">
              Design decisions live in people&apos;s heads, not on web pages. The Gist conversation
              tool draws them out through guided questions and generates a single file.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/audit"
                className="bg-accent-primary hover:bg-accent-hover inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-lg font-semibold text-white transition-colors"
              >
                Run free audit
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
              <Link
                href="/create"
                className="text-text-secondary hover:text-text-primary text-base font-medium transition-colors"
              >
                or generate directly
              </Link>
            </div>
          </div>
        </section>

        {/* Integrations */}
        <Section id="integrations">
          <SectionHeading>Integrations</SectionHeading>
          <div className="text-text-primary space-y-6 text-base leading-relaxed">
            <div>
              <p className="text-text-tertiary mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
                <CommandLineIcon className="h-4 w-4" />
                AI coding tools
              </p>
              <ul className="space-y-2">
                <li>
                  <strong className="text-text-primary">Cursor</strong>:{' '}
                  <code className="bg-bg-secondary rounded px-1.5 py-0.5 text-sm">@Docs</code> → Add
                  new doc → paste your gist.design URL
                </li>
                <li>
                  <strong className="text-text-primary">Claude Code</strong>: Add to CLAUDE.md:
                  &ldquo;Read /gist.design before implementing UI changes&rdquo;
                </li>
                <li>
                  <strong className="text-text-primary">GitHub Copilot</strong>: Place file in repo
                  root
                </li>
              </ul>
            </div>
            <div>
              <p className="text-text-tertiary mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
                <ChatBubbleLeftRightIcon className="h-4 w-4" />
                LLMs
              </p>
              <ul className="space-y-2">
                <li>
                  <strong className="text-text-primary">ChatGPT / Claude</strong>: Paste URL or
                  upload file for accurate product recommendations
                </li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Principles */}
        <Section id="principles">
          <SectionHeading>Principles</SectionHeading>
          <div className="text-text-primary space-y-5 text-base leading-relaxed">
            <div className="bg-bg-secondary/50 flex items-start gap-3 rounded-xl p-4">
              <ScaleIcon className="text-accent-primary mt-0.5 h-5 w-5 shrink-0" />
              <p>
                <strong className="text-text-primary">Decisions over descriptions.</strong>{' '}
                &ldquo;We chose X over Y because Z&rdquo; is useful. &ldquo;The button is
                blue&rdquo; is not.
              </p>
            </div>
            <div className="bg-bg-secondary/50 flex items-start gap-3 rounded-xl p-4">
              <ViewfinderCircleIcon className="text-accent-primary mt-0.5 h-5 w-5 shrink-0" />
              <p>
                <strong className="text-text-primary">Specific over generic.</strong>{' '}
                &ldquo;Confidence scores appear as a 3-tier badge next to each suggestion,&rdquo;
                not &ldquo;uses confidence visualization.&rdquo;
              </p>
            </div>
            <div className="bg-bg-secondary/50 flex items-start gap-3 rounded-xl p-4">
              <NoSymbolIcon className="text-accent-primary mt-0.5 h-5 w-5 shrink-0" />
              <p>
                <strong className="text-text-primary">Negative space matters.</strong> What the
                product is NOT is as important as what it is. The Not This section prevents AI tools
                from filling gaps with competitor patterns.
              </p>
            </div>
            <div className="bg-bg-secondary/50 flex items-start gap-3 rounded-xl p-4">
              <DocumentIcon className="text-accent-primary mt-0.5 h-5 w-5 shrink-0" />
              <p>
                <strong className="text-text-primary">One file per feature.</strong> A product might
                have multiple gist.design files, one for each significant feature. Keeps each file
                focused and contextually useful.
              </p>
            </div>
            <div className="bg-bg-secondary/50 flex items-start gap-3 rounded-xl p-4">
              <SparklesIcon className="text-accent-primary mt-0.5 h-5 w-5 shrink-0" />
              <p>
                <strong className="text-text-primary">Generated, not written.</strong> If designers
                have to author this file manually, it won&apos;t happen. The conversation tool
                handles the format; the designer handles the thinking.
              </p>
            </div>
          </div>
        </Section>

        {/* File placement */}
        <Section id="file-placement">
          <SectionHeading>File placement</SectionHeading>
          <p className="text-text-primary text-base leading-relaxed">
            Place at{' '}
            <code className="bg-bg-secondary rounded px-1.5 py-0.5 text-sm font-medium">
              /gist.design
            </code>{' '}
            in the project root, or{' '}
            <code className="bg-bg-secondary rounded px-1.5 py-0.5 text-sm font-medium">
              /features/[feature-name]/gist.design
            </code>{' '}
            for multi-feature products.
          </p>
        </Section>

        {/* Next steps */}
        <Section id="next-steps">
          <SectionHeading>Next steps</SectionHeading>
          <p className="text-text-primary text-base leading-relaxed">
            The spec is open for community input. Pattern identification is informed by research at{' '}
            <a
              href="https://aiuxdesign.guide"
              className="text-accent-primary hover:text-accent-hover transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              aiuxdesign.guide
            </a>
            .
          </p>
        </Section>
      </div>

      {/* Footer */}
      <footer className="py-12">
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
