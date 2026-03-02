'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';
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
      {/* Hero area with gradient background */}
      <div className="hero-gradient-bg relative">
        {/* Header */}
        <header className="glass-nav sticky top-0 z-50 flex h-14 items-center justify-between px-6">
          <h1 className="text-text-primary text-xl font-semibold">Gist</h1>
          <nav className="flex items-center gap-6">
            <Link
              href="/spec"
              className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
            >
              Spec
            </Link>
            <Link
              href="/create"
              className="text-accent-primary hover:text-accent-hover text-sm font-medium transition-colors"
            >
              Create
            </Link>
          </nav>
        </header>

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <section
            className={
              auditActive ? 'pt-24 pb-12 md:pt-32 md:pb-16' : 'pt-24 pb-28 md:pt-32 md:pb-36'
            }
          >
            <h2 className="text-text-primary mb-4 text-4xl font-extrabold tracking-tight md:text-5xl">
              Fix how AI describes your product
            </h2>
            <p className="text-text-primary mb-8 max-w-xl text-xl leading-relaxed">
              See how ChatGPT and Claude describe your product. Find the gaps, then fix them.
            </p>
            <AuditHero onPhaseChange={handlePhaseChange} />
          </section>
        </div>
      </div>

      {/* Marketing sections — hidden when audit is active */}
      {!auditActive && marketingSections}

      {/* Footer */}
      <footer className="py-12">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
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
