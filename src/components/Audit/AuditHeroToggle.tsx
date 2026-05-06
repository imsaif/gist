'use client';

import { useState } from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { AuditHero } from './AuditHero';

export function AuditHeroToggle() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-ink-primary text-background-primary hover:bg-ink-secondary inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors"
      >
        Audit your product
        <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
      </button>
    );
  }

  return (
    <div className="animate-fade-in w-full">
      <AuditHero onClose={() => setOpen(false)} />
    </div>
  );
}
