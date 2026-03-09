import { AuditResult, LLMProvider } from '@/types/audit';
import { LLMResponseCard } from './LLMResponseCard';
import { GapAnalysis } from './GapAnalysis';

interface AuditResultsProps {
  result: AuditResult;
}

const providers: LLMProvider[] = ['chatgpt', 'claude'];

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
    <div className="space-y-10">
      <section>
        <h3 className="text-text-primary mb-1 text-xl font-bold tracking-tight">
          What 2 LLMs said about your product
        </h3>
        <p className="text-text-tertiary mb-5 text-sm">
          Each model was given your homepage content and asked to describe your product.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {providers.map((provider) => (
            <LLMResponseCard
              key={provider}
              response={responses[provider]}
              isLoading={false}
              gapCount={gapCounts[provider]}
            />
          ))}
        </div>
      </section>

      {analysis && <GapAnalysis analysis={analysis} />}
    </div>
  );
}
