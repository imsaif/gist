'use client';

import { useRouter } from 'next/navigation';
import { AuditResult } from '@/types/audit';

interface AuditToConversationProps {
  result: AuditResult;
}

export function AuditToConversation({ result }: AuditToConversationProps) {
  const router = useRouter();

  const handleClick = () => {
    sessionStorage.setItem('audit_context', JSON.stringify(result));
    router.push('/create?from=audit');
  };

  const gapCount = result.analysis?.summary.totalGaps || 0;
  const criticalCount = result.analysis?.summary.criticalGaps || 0;

  return (
    <div className="border-border-light bg-bg-primary rounded-xl border p-8 text-center">
      <h3 className="text-text-primary mb-2 text-xl font-bold tracking-tight">Fix these gaps</h3>
      <p className="text-text-secondary mx-auto mb-6 max-w-md text-sm leading-relaxed">
        Generate a gist.design file that addresses{' '}
        {gapCount > 0 ? (
          <>
            {criticalCount > 0 && (
              <span className="font-semibold text-red-400">
                {criticalCount} critical
                {gapCount - criticalCount > 0 && ` and ${gapCount - criticalCount} other`}{' '}
              </span>
            )}
            {criticalCount === 0 && (
              <span className="text-text-primary font-semibold">all {gapCount} </span>
            )}
            gap{gapCount !== 1 ? 's' : ''}
          </>
        ) : (
          'potential issues'
        )}{' '}
        found in the audit.
      </p>
      <button
        onClick={handleClick}
        className="bg-accent-primary hover:bg-accent-hover inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold text-white transition-colors"
      >
        Create gist.design file
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
          />
        </svg>
      </button>
    </div>
  );
}
