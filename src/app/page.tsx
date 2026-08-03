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
