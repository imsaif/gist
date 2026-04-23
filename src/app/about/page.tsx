import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — gistaudit',
  description:
    'gistaudit tracks how ChatGPT, Claude, and Perplexity describe your product, and helps you fix what they get wrong.',
};

export default function AboutPage() {
  return (
    <div className="bg-background-primary min-h-screen">
      {/* Header */}
      <header className="glass-nav sticky top-0 z-50 flex h-14 items-center justify-between px-6">
        <Link href="/" className="text-ink-primary text-xl font-semibold">
          gistaudit
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/spec"
            className="text-ink-secondary hover:text-ink-primary text-sm font-medium transition-colors"
          >
            Spec
          </Link>
          <Link href="/about" className="text-brand-primary text-sm font-medium">
            About
          </Link>
        </nav>
      </header>

      {/* Hero — grain texture */}
      <section className="bg-background-grain bg-grain relative">
        <div className="mx-auto max-w-2xl px-6 pt-16 pb-12 md:pt-24 md:pb-16">
          <h1 className="text-ink-primary text-5xl font-extrabold tracking-tight md:text-6xl">
            About gistaudit
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-6 py-16 md:py-20">
        <div className="space-y-8">
          <section>
            <h2 className="text-ink-primary mb-3 text-xl font-semibold">What this is</h2>
            <p className="text-ink-secondary text-base leading-relaxed">
              gistaudit shows you how AI tools describe your product — and tracks it over time.
              Audit your URL, see what ChatGPT, Claude, and Perplexity say, and get a downloadable
              fix file that patches the context LLMs are missing.
            </p>
          </section>

          <section>
            <h2 className="text-ink-primary mb-3 text-xl font-semibold">The problem</h2>
            <div className="text-ink-secondary space-y-3 text-base leading-relaxed">
              <p>
                LLMs answer millions of &ldquo;what should I use for X?&rdquo; questions every day.
                The description they give of your product decides whether you get recommended,
                ignored, or confused with a competitor. Most of the time, they get it wrong — and no
                one tells you.
              </p>
              <p>
                AI coding tools have the same problem. They read your HTML but not your design
                decisions, rejected alternatives, or boundaries — so they guess. The result is code
                that looks right but implements the wrong thing.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-ink-primary mb-3 text-xl font-semibold">How it works</h2>
            <p className="text-ink-secondary mb-3 text-base leading-relaxed">
              You give us a URL. We audit your product through every major LLM and score the output
              across positioning, category accuracy, feature claims, and audience fit. Gaps become a
              downloadable{' '}
              <code className="bg-background-secondary rounded px-1.5 py-0.5 text-sm">
                .gist.design
              </code>{' '}
              file you can drop into your repo or paste into Cursor, Claude Code, or ChatGPT.
            </p>
            <p className="text-ink-secondary text-base leading-relaxed">
              Run an audit any time you ship a meaningful change — a new positioning paragraph, a
              new feature, a competitor launch — and see how the AI tools your buyers use respond.
            </p>
          </section>

          <section>
            <h2 className="text-ink-primary mb-3 text-xl font-semibold">
              Built on an open standard
            </h2>
            <p className="text-ink-secondary text-base leading-relaxed">
              The fix file is{' '}
              <Link
                href="/spec"
                className="text-brand-primary hover:text-brand-hover transition-colors"
              >
                gist.design
              </Link>
              , an open format for AI-readable product context. Anyone can author one by hand or
              with the Claude Code skill. gistaudit produces one as the output of every audit. The
              spec is MIT-licensed and tool-agnostic.
            </p>
          </section>

          <section>
            <h2 className="text-ink-primary mb-3 text-xl font-semibold">
              Connection to aiuxdesign.guide
            </h2>
            <p className="text-ink-secondary text-base leading-relaxed">
              Pattern references in the fix file link to{' '}
              <a
                href="https://aiuxdesign.guide"
                className="text-brand-primary hover:text-brand-hover transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                aiuxdesign.guide
              </a>
              , which documents 36 AI UX patterns from shipped products.
            </p>
          </section>

          <section>
            <h2 className="text-ink-primary mb-3 text-xl font-semibold">Who built this</h2>
            <p className="text-ink-secondary text-base leading-relaxed">
              Built by{' '}
              <a
                href="https://github.com/imsaif"
                className="text-brand-primary hover:text-brand-hover transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Imran
              </a>
              . Feedback and spec contributions welcome via GitHub.
            </p>
          </section>

          <hr className="border-border-primary" />

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/"
              className="bg-brand-primary hover:bg-brand-hover inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-base font-semibold text-white transition-colors"
            >
              Run a free audit
            </Link>
            <Link
              href="/spec"
              className="text-ink-secondary hover:text-ink-primary text-base font-medium transition-colors"
            >
              or read the spec
            </Link>
          </div>
        </div>
      </div>

      <footer className="py-12">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6">
          <span className="text-ink-tertiary text-sm">gistaudit · 2026</span>
          <span className="text-ink-tertiary text-sm">
            Built on the open{' '}
            <Link
              href="/spec"
              className="text-ink-secondary hover:text-ink-primary transition-colors"
            >
              gist.design
            </Link>{' '}
            spec
          </span>
        </div>
      </footer>
    </div>
  );
}
