'use client';

interface ProblemSectionProps {
  problem: string | null;
  context: string[];
  assumptions: string[];
}

export function ProblemSection({ problem, context, assumptions }: ProblemSectionProps) {
  if (!problem && context.length === 0 && assumptions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Problem Statement */}
      {problem && (
        <div className="border-border-light rounded-xl border bg-white p-4">
          <h3 className="text-text-tertiary mb-2 text-xs font-medium uppercase">
            Problem Statement
          </h3>
          <p className="text-text-primary">{problem}</p>
        </div>
      )}

      {/* Context */}
      {context.length > 0 && (
        <div className="border-border-light rounded-xl border bg-white p-4">
          <h3 className="text-text-tertiary mb-2 text-xs font-medium uppercase">Context</h3>
          <ul className="space-y-1">
            {context.map((item, i) => (
              <li key={i} className="text-text-secondary flex items-start gap-2 text-sm">
                <span className="text-text-tertiary">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Assumptions */}
      {assumptions.length > 0 && (
        <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
          <h3 className="mb-2 flex items-center gap-1 text-xs font-medium text-amber-700 uppercase">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            Assumptions
          </h3>
          <ul className="space-y-1">
            {assumptions.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                <span className="text-amber-500">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
