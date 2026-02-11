'use client';

import { SectionStatus } from '@/types/file';

interface SectionProgressProps {
  sections: Record<string, SectionStatus>;
}

const SECTION_LABELS: Record<string, string> = {
  intent: 'Intent',
  interactionModel: 'Interaction',
  designDecisions: 'Decisions',
  patterns: 'Patterns',
  constraints: 'Constraints',
  notThis: 'Not This',
  openQuestions: 'Questions',
};

const STATUS_COLORS: Record<SectionStatus, string> = {
  empty: 'bg-border-medium',
  partial: 'bg-yellow-500',
  complete: 'bg-green-500',
};

export function SectionProgress({ sections }: SectionProgressProps) {
  return (
    <div className="flex items-center gap-1.5">
      {Object.entries(sections).map(([key, status]) => (
        <div key={key} className="group relative">
          <div className={`h-2 w-2 rounded-full ${STATUS_COLORS[status]}`} />
          <div className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded bg-slate-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
            {SECTION_LABELS[key] || key}
          </div>
        </div>
      ))}
    </div>
  );
}
