import { GapAnalysis as GapAnalysisType } from '@/types/audit';
import { GapItem } from './GapItem';
import { ReadabilityScore } from './ReadabilityScore';

interface GapAnalysisProps {
  analysis: GapAnalysisType;
}

export function GapAnalysis({ analysis }: GapAnalysisProps) {
  const { gaps, summary } = analysis;

  // Group gaps by severity
  const critical = gaps.filter((g) => g.severity === 'critical');
  const high = gaps.filter((g) => g.severity === 'high');
  const medium = gaps.filter((g) => g.severity === 'medium');

  return (
    <div className="space-y-6">
      {/* Summary bar */}
      <div className="border-border-light bg-bg-primary flex flex-wrap items-center gap-4 rounded-xl border p-5">
        <div className="flex items-center gap-2">
          <span className="text-text-secondary text-sm">AI Readability:</span>
          <ReadabilityScore score={summary.readabilityScore} />
        </div>
        <div className="bg-border-light h-5 w-px" />
        <div className="text-text-secondary text-sm">
          <span className="text-text-primary font-semibold">{summary.totalGaps}</span> gaps found
          {summary.criticalGaps > 0 && (
            <span className="ml-1 text-red-400">({summary.criticalGaps} critical)</span>
          )}
        </div>
        <div className="bg-border-light h-5 w-px" />
        <div className="text-text-secondary text-sm">
          Worst: <span className="text-text-primary font-medium">{summary.worstModel}</span>
        </div>
        <div className="text-text-secondary text-sm">
          Best: <span className="text-text-primary font-medium">{summary.bestModel}</span>
        </div>
      </div>

      {/* Gaps by severity */}
      {critical.length > 0 && (
        <div>
          <h4 className="text-text-primary mb-3 text-sm font-semibold">
            Critical ({critical.length})
          </h4>
          <div className="space-y-3">
            {critical.map((gap) => (
              <GapItem key={gap.id} gap={gap} />
            ))}
          </div>
        </div>
      )}

      {high.length > 0 && (
        <div>
          <h4 className="text-text-primary mb-3 text-sm font-semibold">High ({high.length})</h4>
          <div className="space-y-3">
            {high.map((gap) => (
              <GapItem key={gap.id} gap={gap} />
            ))}
          </div>
        </div>
      )}

      {medium.length > 0 && (
        <div>
          <h4 className="text-text-primary mb-3 text-sm font-semibold">Medium ({medium.length})</h4>
          <div className="space-y-3">
            {medium.map((gap) => (
              <GapItem key={gap.id} gap={gap} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
