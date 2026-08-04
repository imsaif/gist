import type { Metadata } from 'next';
import { CopyInstall } from '@/components/CopyInstall';

export const metadata: Metadata = {
  title: 'llms.gist: product context your coding agent actually reads',
  description:
    'Audit how AI tools describe your product, write an llms.gist spec, and wire it into the config files your coding agent loads.',
};

const INSTALL = 'curl -fsSL llmsgist.org/install.sh | bash';

const ICON = 'h-6 w-6';
const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const STEPS = [
  {
    n: '01',
    name: 'Audit',
    body: 'gist reads your repo the way an AI tool would, then tells you how that reads back.',
    icon: (
      <svg viewBox="0 0 24 24" className={ICON} aria-hidden="true" {...STROKE}>
        <circle cx="11" cy="11" r="6.5" />
        <path d="M16 16l4.5 4.5" />
      </svg>
    ),
  },
  {
    n: '02',
    name: 'Write',
    body: 'It writes llms.gist at the project root: who this is for, and what it deliberately is not.',
    icon: (
      <svg viewBox="0 0 24 24" className={ICON} aria-hidden="true" {...STROKE}>
        <path d="M13.5 3H6.5A1.5 1.5 0 005 4.5v15A1.5 1.5 0 006.5 21h11a1.5 1.5 0 001.5-1.5V8.5z" />
        <path d="M13.5 3v5.5H19" />
        <path d="M8.5 13h7M8.5 16.5h4.5" />
      </svg>
    ),
  },
  {
    n: '03',
    name: 'Wire',
    body: 'It appends a pointer to the agent configs your repo actually has. It detects them, it does not assume.',
    icon: (
      <svg viewBox="0 0 24 24" className={ICON} aria-hidden="true" {...STROKE}>
        <path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 10-5.7-5.7L11.5 6.8" />
        <path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 105.7 5.7l1.5-1.5" />
      </svg>
    ),
  },
  {
    n: '04',
    name: 'Verify',
    body: 'It asks a fresh session a question only the file answers. This is the step that can fail.',
    icon: (
      <svg viewBox="0 0 24 24" className={ICON} aria-hidden="true" {...STROKE}>
        <path d="M12 3l7 3v5.5c0 4.2-2.9 7.6-7 9.5-4.1-1.9-7-5.3-7-9.5V6z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

const CORRECTIONS = [
  {
    guess: 'reorder the workflow categories',
    file: 'Status categories are fixed. Statuses can be added and renamed inside a category, but the categories themselves cannot be reordered.',
  },
  {
    guess: 'carry unfinished work over by hand',
    file: 'Cycles auto-schedule and roll unfinished work forward, so there are no sprint ceremonies.',
  },
];

export default function Home() {
  return (
    <div className="bg-background-primary min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="text-ink-primary text-lg font-bold tracking-[-0.02em]">llms.gist</span>
        <a
          href="https://github.com/imsaif/gist"
          className="border-border-primary text-ink-primary hover:bg-background-secondary inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49l-.01-1.9c-2.78.62-3.37-1.2-3.37-1.2-.46-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 015 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.35 4.79-4.58 5.05.36.32.68.94.68 1.9l-.01 2.82c0 .27.18.6.69.49A10.05 10.05 0 0022 12.25C22 6.58 17.52 2 12 2z" />
          </svg>
          GitHub
        </a>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        {/* Hero */}
        <section className="pt-12 pb-4 text-center md:pt-20">
          <h1 className="text-ink-primary mx-auto max-w-[20ch] text-[2.5rem] leading-[1.08] font-bold tracking-[-0.03em] md:text-[3.5rem]">
            llms.gist is a product expert inside your terminal
          </h1>

          <p className="text-ink-secondary mx-auto mt-6 max-w-[52ch] text-[17px] leading-relaxed">
            Your agent reads your code, so it knows what your product does. It cannot know who you
            built it for or what you deliberately left out, so it fills those in anyway. gist asks
            you, then writes the answers where your agent will read them.
          </p>

          <div className="mx-auto mt-9 max-w-lg">
            <CopyInstall command={INSTALL} />
          </div>
          <p className="text-ink-tertiary mt-4 text-sm">
            Then run <span className="font-mono">/gist-design</span> in any repo.
          </p>
          <a
            href="#example"
            className="text-ink-primary hover:text-ink-secondary mt-6 inline-flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M8 5l11 7-11 7z" />
            </svg>
            See what it catches
          </a>
        </section>

        {/* Four steps. Numbered because the order is a real dependency chain:
            you cannot verify before you wire. */}
        <section className="mt-16 grid gap-4 md:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.n} className="bg-background-tertiary rounded-2xl p-7">
              <div className="text-ink-primary">{step.icon}</div>
              <h3 className="text-ink-primary mt-5 font-bold tracking-[-0.01em]">
                <span className="text-ink-tertiary font-mono text-xs">{step.n}</span> {step.name}
              </h3>
              <p className="text-ink-secondary mt-2 text-[15px] leading-relaxed">{step.body}</p>
            </div>
          ))}
        </section>

        {/* The signature: a proof-mark correction on the inverse surface */}
        <section
          id="example"
          className="bg-surface-inverse mt-4 scroll-mt-8 rounded-2xl p-8 md:p-10"
        >
          <p className="eyebrow !text-white/40">Example: an agent given only the repo</p>

          <p className="mt-6 max-w-[54ch] font-mono text-[14px] leading-[1.95] text-white/90">
            Linear is a project management tool in the same space as Jira. Teams{' '}
            <span className="correction">reorder the workflow categories</span> to match their
            process, then plan each sprint and{' '}
            <span className="correction">carry unfinished work over by hand</span>.
          </p>

          <div className="mt-8 border-t border-white/10 pt-7">
            <p className="eyebrow !text-white/40">
              Each wrong guess, and the line in llms.gist that prevents it
            </p>
            <ul className="mt-6 space-y-5">
              {CORRECTIONS.map((c) => (
                <li
                  key={c.guess}
                  className="grid gap-2 md:grid-cols-[1fr_1.4fr] md:items-baseline md:gap-8"
                >
                  <p className="decoration-correction font-mono text-[13px] leading-relaxed text-white/35 line-through decoration-2">
                    {c.guess}
                  </p>
                  <p className="border-correction border-l-2 pl-4 font-mono text-[13px] leading-relaxed text-white/80">
                    {c.file}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <footer className="border-border-primary text-ink-tertiary mt-16 flex items-center justify-between border-t py-8 text-sm">
          <span>llms.gist</span>
          <a
            href="https://github.com/imsaif/gist"
            className="hover:text-ink-primary transition-colors"
          >
            github.com/imsaif/gist
          </a>
        </footer>
      </main>
    </div>
  );
}
