'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import GistIcon from '@/components/GistIcon';
import { AuditHero } from '@/components/Audit';
import { HeroResultPreview } from '@/components/marketing/HeroResultPreview';

interface LandingWithAuditProps {
  marketingSections: ReactNode;
}

export function LandingWithAudit({ marketingSections }: LandingWithAuditProps) {
  const [auditActive, setAuditActive] = useState(false);

  const handlePhaseChange = (phase: string) => {
    setAuditActive(phase !== 'input');
  };

  return (
    <div className="bg-background-primary min-h-screen">
      {/* Hero area — grain texture on the landing hero, plain bg during audit */}
      <div className={auditActive ? 'relative' : 'bg-background-grain bg-grain relative'}>
        {/* Header */}
        <header className="glass-nav sticky top-0 z-50 flex h-14 items-center justify-between px-6">
          <h1 className="text-ink-primary flex items-center gap-2 text-xl font-semibold">
            <GistIcon className="h-6 w-6" />
            gistaudit
          </h1>
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-brand-primary hover:text-brand-hover text-sm font-medium transition-colors"
            >
              Audit
            </Link>
            <Link
              href="/audited"
              className="text-ink-secondary hover:text-ink-primary text-sm font-medium transition-colors"
            >
              Audited
            </Link>
            <Link
              href="/spec"
              className="text-ink-secondary hover:text-ink-primary text-sm font-medium transition-colors"
            >
              Spec
            </Link>
          </nav>
        </header>

        <div className={`relative z-10 mx-auto px-6 ${auditActive ? 'max-w-7xl' : 'max-w-6xl'}`}>
          <section
            className={
              auditActive
                ? 'pt-8 pb-12 md:pt-12 md:pb-16'
                : 'pt-24 pb-28 text-center md:pt-32 md:pb-36'
            }
          >
            {!auditActive && (
              <>
                <h2 className="text-ink-primary mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                  See how AI describes your product
                </h2>
                <p className="text-ink-secondary mx-auto mb-10 max-w-2xl text-2xl leading-relaxed md:text-3xl">
                  Audit what ChatGPT, Claude, and Perplexity say about you. Fix the gaps. Track
                  drift over time.
                </p>
              </>
            )}
            <div className={auditActive ? '' : 'flex justify-center'}>
              <AuditHero onPhaseChange={handlePhaseChange} />
            </div>
            {!auditActive && <HeroResultPreview />}
            {!auditActive && (
              <p className="text-ink-secondary mt-6 text-center text-sm">
                Or{' '}
                <Link href="/audited" className="text-brand-primary font-medium underline">
                  see 25 founder tools we&apos;ve already audited
                </Link>{' '}
                — Linear, Notion, Figma, Vercel and more.
              </p>
            )}
          </section>
        </div>
      </div>

      {/* Marketing sections — hidden when audit is active */}
      {!auditActive && marketingSections}

      {/* Footer */}
      <footer className="py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-6 sm:flex-row sm:items-center">
          <span className="text-ink-tertiary text-sm">gistaudit · 2026</span>
          <div className="text-ink-tertiary flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span>
              Built on the open{' '}
              <Link
                href="/spec"
                className="text-ink-secondary hover:text-ink-primary transition-colors"
              >
                gist.design
              </Link>{' '}
              spec
            </span>
            <span className="hidden sm:inline">·</span>
            <span>
              Patterns by{' '}
              <a
                href="https://aiuxdesign.guide"
                className="text-ink-secondary hover:text-ink-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                aiuxdesign.guide
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
