'use client';

import { Gap } from '@/types/audit';
import {
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface GapCardProps {
  gap: Gap;
  isResolved: boolean;
}

const severityConfig = {
  critical: {
    icon: ExclamationTriangleIcon,
    border: 'border-red-500/30',
    bg: 'bg-red-500/5',
    badge: 'bg-red-500/20 text-red-400',
    text: 'text-red-300/80',
  },
  high: {
    icon: ExclamationCircleIcon,
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/5',
    badge: 'bg-amber-500/20 text-amber-400',
    text: 'text-amber-300/80',
  },
  medium: {
    icon: InformationCircleIcon,
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/5',
    badge: 'bg-blue-500/20 text-blue-400',
    text: 'text-blue-300/80',
  },
};

const categoryLabels: Record<string, string> = {
  competitor_blending: 'Competitor Blending',
  invisible_mechanics: 'Invisible Mechanics',
  missing_decisions: 'Missing Decisions',
  fabrication: 'Fabrication',
  missing_boundaries: 'Missing Boundaries',
  positioning_drift: 'Positioning Drift',
};

export function GapCard({ gap, isResolved }: GapCardProps) {
  const config = severityConfig[gap.severity] || severityConfig.medium;
  const Icon = isResolved ? CheckCircleIcon : config.icon;

  return (
    <div
      className={`rounded-lg border p-3 transition-all ${
        isResolved
          ? 'border-green-500/20 bg-green-500/5 opacity-60'
          : `${config.border} ${config.bg}`
      }`}
    >
      <div className="flex items-start gap-2">
        <Icon
          className={`mt-0.5 h-4 w-4 shrink-0 ${isResolved ? 'text-green-400' : config.text}`}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                isResolved ? 'bg-green-500/20 text-green-400' : config.badge
              }`}
            >
              {isResolved ? 'Addressed' : gap.severity}
            </span>
            <span className="text-text-secondary text-xs font-medium">
              {categoryLabels[gap.category] || gap.category}
            </span>
          </div>
          <p
            className={`mt-1 text-xs leading-relaxed ${isResolved ? 'text-text-tertiary' : 'text-text-secondary'}`}
          >
            {gap.description}
          </p>
          {!isResolved && (
            <p className="text-text-tertiary mt-1.5 text-[11px]">
              <span className="font-medium">Fix:</span> {gap.whatFileNeeds}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
