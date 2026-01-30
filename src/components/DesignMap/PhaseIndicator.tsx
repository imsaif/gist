'use client';

type Phase = string;

interface PhaseIndicatorProps {
  phases: Phase[];
  currentPhase: Phase;
  labels?: Record<Phase, string>;
}

export function PhaseIndicator({ phases, currentPhase, labels }: PhaseIndicatorProps) {
  const currentIndex = phases.indexOf(currentPhase);

  return (
    <div className="flex items-center gap-2">
      {phases.map((phase, index) => {
        const isPast = index < currentIndex;
        const isCurrent = index === currentIndex;
        const label = labels?.[phase] ?? phase;

        return (
          <div key={phase} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div
                className={`h-2 w-2 rounded-full transition-colors ${
                  isPast ? 'bg-green-500' : isCurrent ? 'bg-accent-primary' : 'bg-border-medium'
                }`}
              />
              <span
                className={`text-xs font-medium capitalize ${
                  isPast
                    ? 'text-green-600'
                    : isCurrent
                      ? 'text-accent-primary'
                      : 'text-text-tertiary'
                }`}
              >
                {label}
              </span>
            </div>
            {index < phases.length - 1 && (
              <div className={`h-px w-4 ${isPast ? 'bg-green-500' : 'bg-border-medium'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
