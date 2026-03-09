import { GapAnalysis as GapAnalysisType } from '@/types/audit';
import { GapItem } from './GapItem';
import { ReadabilityScore } from './ReadabilityScore';

interface GapAnalysisProps {
  analysis: GapAnalysisType;
}

export function GapAnalysis({ analysis }: GapAnalysisProps) {
  const { gaps, summary } = analysis;

  // Sort by severity: critical first, then high, then medium
  const severityOrder = { critical: 0, high: 1, medium: 2 };
  const sortedGaps = [...gaps].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  );

  return (
    <div className="space-y-8">
      {/* Summary bar */}
      <div className="border-border-light bg-bg-primary grid grid-cols-2 gap-4 rounded-xl border p-6 sm:grid-cols-4">
        <div>
          <p className="text-text-tertiary mb-1 text-xs font-medium tracking-wider uppercase">
            AI Readability
          </p>
          <ReadabilityScore score={summary.readabilityScore} />
        </div>
        <div>
          <p className="text-text-tertiary mb-1 text-xs font-medium tracking-wider uppercase">
            Gaps Found
          </p>
          <p className="text-text-primary text-2xl font-bold">
            {summary.totalGaps}
            {summary.criticalGaps > 0 && (
              <span className="ml-2 text-sm font-medium text-red-400">
                {summary.criticalGaps} critical
              </span>
            )}
          </p>
        </div>
        <div>
          <p className="text-text-tertiary mb-1 text-xs font-medium tracking-wider uppercase">
            Most Issues
          </p>
          <p className="text-text-primary text-base font-semibold capitalize">
            {summary.worstModel}
          </p>
        </div>
        <div>
          <p className="text-text-tertiary mb-1 text-xs font-medium tracking-wider uppercase">
            Fewest Issues
          </p>
          <p className="text-text-primary text-base font-semibold capitalize">
            {summary.bestModel}
          </p>
        </div>
      </div>

      {/* Single gap table */}
      {sortedGaps.length > 0 && (
        <div className="border-border-light overflow-hidden rounded-xl border">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-bg-secondary">
                <th className="text-text-tertiary w-[45%] px-6 py-3.5 text-left text-xs font-semibold tracking-wider uppercase">
                  Issue
                </th>
                <th className="text-text-tertiary w-[35%] px-6 py-3.5 text-left text-xs font-semibold tracking-wider uppercase">
                  Fix
                </th>
                <th className="text-text-tertiary w-[20%] px-6 py-3.5 text-left text-xs font-semibold tracking-wider uppercase">
                  Severity
                </th>
              </tr>
            </thead>
            <tbody className="bg-bg-primary">
              {sortedGaps.map((gap) => (
                <GapItem key={gap.id} gap={gap} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
