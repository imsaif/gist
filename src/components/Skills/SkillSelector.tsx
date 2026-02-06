'use client';

import { SkillCard } from './SkillCard';

export function SkillSelector() {
  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-text-secondary mb-8 text-center text-xl">
        What do you need to think through?
      </h2>

      {/* Top row - 3 cards */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SkillCard
          title="Brief"
          description="Clarify before you build"
          icon={<span>📋</span>}
          href="/brief"
        />
        <SkillCard
          title="Critique"
          description="Review a design"
          icon={<span>🔍</span>}
          href="/critique"
          disabled
        />
        <SkillCard
          title="Research"
          description="Plan what to learn"
          icon={<span>🔬</span>}
          href="/research"
          disabled
        />
      </div>

      {/* Bottom row - 2 cards centered */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:px-16">
        <SkillCard
          title="Stakeholder"
          description="Prepare for hard Qs"
          icon={<span>🎯</span>}
          href="/stakeholder"
          disabled
        />
        <SkillCard
          title="IA"
          description="Structure info & nav"
          icon={<span>🗂️</span>}
          href="/ia"
          disabled
        />
      </div>

      {/* Template link */}
      <p className="text-text-tertiary mt-8 text-center text-sm">
        or{' '}
        <span className="text-text-secondary hover:text-accent-primary cursor-pointer underline">
          start from a template
        </span>
      </p>
    </div>
  );
}
