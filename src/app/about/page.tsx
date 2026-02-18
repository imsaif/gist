import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — gist.design',
  description: 'gist.design is a web standard for making product decisions readable to AI tools.',
};

export default function AboutPage() {
  return (
    <div className="bg-bg-primary min-h-screen">
      {/* Header */}
      <header className="glass-nav sticky top-0 z-50 flex h-14 items-center justify-between px-6">
        <Link href="/" className="text-text-primary text-xl font-semibold">
          Gist
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/spec"
            className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
          >
            Spec
          </Link>
          <Link href="/about" className="text-accent-primary text-sm font-medium">
            About
          </Link>
          <Link
            href="/create"
            className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
          >
            Create
          </Link>
        </nav>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
        <h1 className="text-text-primary mb-8 text-4xl font-extrabold tracking-tight">
          About gist.design
        </h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-text-primary mb-3 text-xl font-semibold">What this is</h2>
            <p className="text-text-secondary text-base leading-relaxed">
              gist.design is a web standard and toolset for making product decisions readable to AI
              tools. It produces a{' '}
              <code className="bg-bg-secondary rounded px-1.5 py-0.5 text-sm">/gist.design</code>{' '}
              markdown file that sits at a project root — like{' '}
              <code className="bg-bg-secondary rounded px-1.5 py-0.5 text-sm">llms.txt</code> but
              for product intent, interaction flows, rationale, and boundaries instead of
              documentation.
            </p>
          </section>

          <section>
            <h2 className="text-text-primary mb-3 text-xl font-semibold">The problem</h2>
            <div className="text-text-secondary space-y-3 text-base leading-relaxed">
              <p>
                AI agents misrepresent products — blending with competitors, inventing features,
                describing things wrong. Coding assistants build the wrong thing — they see
                structure but not intent, features but not rationale.
              </p>
              <p>
                Every product has implicit decisions that never get written down. When AI tools
                encounter these gaps, they fill them with guesses from training data. The result is
                code that looks right but implements the wrong thing.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-text-primary mb-3 text-xl font-semibold">How it works</h2>
            <p className="text-text-secondary mb-4 text-base leading-relaxed">
              A guided conversation asks about your product decisions, positioning, and boundaries.
              The tool captures your thinking and produces a structured file that AI tools read
              automatically.
            </p>
            <p className="text-text-secondary text-base leading-relaxed">
              There are two ways to generate a file:
            </p>
            <ul className="text-text-secondary mt-3 list-inside list-disc space-y-2 text-base leading-relaxed">
              <li>
                <strong className="text-text-primary">Claude Code skill</strong> — runs inside your
                terminal, writes the file directly to your project root. Recommended for developers.
              </li>
              <li>
                <strong className="text-text-primary">Web app</strong> — same guided conversation at{' '}
                <Link
                  href="/create"
                  className="text-accent-primary hover:text-accent-hover transition-colors"
                >
                  gist.design/create
                </Link>
                . Works for anyone on the team.
              </li>
            </ul>
            <p className="text-text-secondary mt-3 text-base leading-relaxed">
              Both produce identical files. The file format is the product. The tools are creation
              channels.
            </p>
          </section>

          <section>
            <h2 className="text-text-primary mb-3 text-xl font-semibold">
              Connection to aiuxdesign.guide
            </h2>
            <p className="text-text-secondary text-base leading-relaxed">
              gist.design is powered by{' '}
              <a
                href="https://aiuxdesign.guide"
                className="text-accent-primary hover:text-accent-hover transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                aiuxdesign.guide
              </a>
              , which documents 28+ AI UX patterns from 50+ shipped products. During conversation,
              the AI identifies patterns you are implementing and includes them in your file with
              links back to the pattern library.
            </p>
          </section>

          <section>
            <h2 className="text-text-primary mb-3 text-xl font-semibold">Who built this</h2>
            <p className="text-text-secondary text-base leading-relaxed">
              gist.design is built by{' '}
              <a
                href="https://github.com/imsaif"
                className="text-accent-primary hover:text-accent-hover transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Imran
              </a>
              . The project is open for community input. If you have feedback or want to contribute
              to the spec, reach out on GitHub.
            </p>
          </section>

          <hr className="border-white/[0.06]" />

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://github.com/imsaif/gist"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent-primary hover:bg-accent-hover inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-base font-semibold text-white transition-colors"
            >
              Install Claude Code skill
            </a>
            <Link
              href="/create"
              className="text-text-secondary hover:text-text-primary text-base font-medium transition-colors"
            >
              or generate in browser
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6">
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
