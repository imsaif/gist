'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import GistIcon from '@/components/GistIcon';
import { AuditHero } from '@/components/Audit';

interface LandingWithAuditProps {
  marketingSections: ReactNode;
}

export function LandingWithAudit({ marketingSections }: LandingWithAuditProps) {
  const [auditActive, setAuditActive] = useState(false);

  const handlePhaseChange = (phase: string) => {
    setAuditActive(phase !== 'input');
  };

  return (
    <div className="bg-bg-primary min-h-screen">
      {/* Hero area — gradient only on landing, plain bg during audit */}
      <div className={auditActive ? 'relative' : 'hero-gradient-bg relative'}>
        {/* Header */}
        <header className="glass-nav sticky top-0 z-50 flex h-14 items-center justify-between px-6">
          <h1 className="text-text-primary flex items-center gap-2 text-xl font-semibold">
            <GistIcon className="h-6 w-6" />
            gistaudit
          </h1>
          <nav className="flex items-center gap-6">
            <Link
              href="/#pricing"
              className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/spec"
              className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
            >
              Spec
            </Link>
          </nav>
        </header>

        <div className={`relative z-10 mx-auto px-6 ${auditActive ? 'max-w-7xl' : 'max-w-6xl'}`}>
          <section
            className={
              auditActive ? 'pt-8 pb-12 md:pt-12 md:pb-16' : 'pt-24 pb-28 md:pt-32 md:pb-36'
            }
          >
            {!auditActive && (
              <>
                <h2 className="text-text-primary mb-4 text-4xl font-extrabold tracking-tight md:text-5xl">
                  See how AI describes your product
                </h2>
                <p className="text-text-primary mb-8 max-w-xl text-xl leading-relaxed">
                  Audit what ChatGPT, Claude, and Perplexity say about you. Fix the gaps. Track
                  drift over time.
                </p>
              </>
            )}
            <AuditHero onPhaseChange={handlePhaseChange} />
          </section>
        </div>
      </div>

      {/* Marketing sections — hidden when audit is active */}
      {!auditActive && marketingSections}

      {/* Footer */}
      <footer className="py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-6 sm:flex-row sm:items-center">
          <span className="text-text-tertiary text-sm">gistaudit · 2026</span>
          <div className="text-text-tertiary flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span>
              Built on the open{' '}
              <Link
                href="/spec"
                className="text-text-secondary hover:text-text-primary transition-colors"
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
                className="text-text-secondary hover:text-text-primary transition-colors"
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
