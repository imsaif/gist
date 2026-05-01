import { ReactNode } from 'react';
import Link from 'next/link';
import GistIcon from '@/components/GistIcon';
import { AuditHero } from '@/components/Audit';

interface LandingWithAuditProps {
  marketingSections: ReactNode;
}

export function LandingWithAudit({ marketingSections }: LandingWithAuditProps) {
  return (
    <div className="bg-background-primary min-h-screen">
      {/* Header */}
      <header className="flex h-14 items-center justify-between px-6">
        <h1 className="text-ink-primary flex items-center gap-2 text-xl font-semibold">
          <GistIcon className="h-6 w-6" />
          llms.gist
        </h1>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-ink-primary text-sm font-medium transition-colors">
            Audit
          </Link>
          <Link
            href="/spec"
            className="text-ink-secondary hover:text-ink-primary text-sm font-medium transition-colors"
          >
            Spec
          </Link>
          <Link
            href="/about"
            className="text-ink-secondary hover:text-ink-primary text-sm font-medium transition-colors"
          >
            About
          </Link>
        </nav>
      </header>

      {/* Hero — always-visible H1 + URL input */}
      <div className="relative mx-auto max-w-5xl px-6">
        <section className="pt-20 pb-10 text-center md:pt-28">
          <h2 className="text-ink-primary mb-6 text-4xl leading-[1.05] font-bold tracking-[-0.03em] md:text-5xl lg:text-6xl">
            AI doesn&apos;t know your product.
            <br />
            <span className="text-brand-primary">llms.gist makes sure it knows.</span>
          </h2>
          <p className="text-ink-secondary mx-auto mb-10 max-w-md text-base leading-relaxed">
            Audit what ChatGPT and Claude say about you. Fix the gaps with an{' '}
            <code className="bg-background-secondary rounded px-1 py-0.5 text-sm font-medium">
              llms.gist
            </code>{' '}
            file in your repo.
          </p>
          <AuditHero />
        </section>
      </div>

      {marketingSections}

      <footer className="text-ink-tertiary mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 pb-6 text-xs">
        <span>llms.gist · 2026</span>
        <Link href="/spec" className="hover:text-ink-primary transition-colors">
          Built on the open .gist spec
        </Link>
      </footer>
    </div>
  );
}
