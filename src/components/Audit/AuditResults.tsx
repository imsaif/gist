import { AuditResult, LLMProvider } from '@/types/audit';
import { LLMResponseCard } from './LLMResponseCard';
import { GapAnalysis } from './GapAnalysis';

interface AuditResultsProps {
  result: AuditResult;
}

const providers: LLMProvider[] = ['chatgpt', 'claude', 'perplexity'];

export function AuditResults({ result }: AuditResultsProps) {
  const { responses, analysis } = result;

  // Count gaps per model
  const gapCounts: Record<LLMProvider, number> = { chatgpt: 0, claude: 0, perplexity: 0 };
  if (analysis) {
    for (const gap of analysis.gaps) {
      for (const model of gap.modelsAffected) {
        gapCounts[model]++;
      }
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-text-primary mb-4 text-lg font-semibold">
          What 3 LLMs said about your product
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {providers.map((provider) => (
            <LLMResponseCard
              key={provider}
              response={responses[provider]}
              isLoading={false}
              gapCount={gapCounts[provider]}
            />
          ))}
        </div>
      </div>

      {analysis && (
        <div>
          <h3 className="text-text-primary mb-4 text-lg font-semibold">Gap Analysis</h3>
          <GapAnalysis analysis={analysis} />
        </div>
      )}
    </div>
  );
}
