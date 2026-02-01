'use client';

import { Objection } from '@/types';

interface ObjectionCardProps {
  objection: Objection;
  index: number;
}

const STAKEHOLDER_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
  Executive: { bg: 'bg-purple-50', text: 'text-purple-700', badge: 'bg-purple-100' },
  Engineering: { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100' },
  Product: { bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100' },
  Legal: { bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100' },
  Other: { bg: 'bg-slate-50', text: 'text-slate-700', badge: 'bg-slate-100' },
};

export function ObjectionCard({ objection, index }: ObjectionCardProps) {
  const colors = STAKEHOLDER_COLORS[objection.stakeholder] || STAKEHOLDER_COLORS.Other;

  return (
    <div className={`border-border-light rounded-xl border bg-white p-4`}>
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-text-tertiary text-xs font-medium">#{index + 1}</span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.badge} ${colors.text}`}
          >
            {objection.stakeholder}
          </span>
        </div>
      </div>

      <h4 className="text-text-primary mb-3 font-medium">&ldquo;{objection.objection}&rdquo;</h4>

      {objection.counterArguments.length > 0 && (
        <div className="mb-3">
          <div className="mb-1 text-xs font-medium text-green-700">Counter-arguments:</div>
          <ul className="space-y-1">
            {objection.counterArguments.map((arg, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                <span className="text-green-500">→</span>
                {arg}
              </li>
            ))}
          </ul>
        </div>
      )}

      {objection.evidenceNeeded.length > 0 && (
        <div>
          <div className="mb-1 text-xs font-medium text-amber-700">Evidence needed:</div>
          <ul className="space-y-1">
            {objection.evidenceNeeded.map((evidence, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-700">
                <input type="checkbox" className="mt-1 rounded border-amber-300" />
                {evidence}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
