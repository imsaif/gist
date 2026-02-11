'use client';

import { Feature, FeatureProgress } from '@/types/file';
import { SectionProgress } from './SectionProgress';

interface FeatureSectionProps {
  feature: Feature;
  progress: FeatureProgress | undefined;
  isCurrent: boolean;
}

function SectionBlock({
  title,
  children,
  isEmpty,
}: {
  title: string;
  children: React.ReactNode;
  isEmpty: boolean;
}) {
  if (isEmpty) return null;
  return (
    <div className="mt-3">
      <h4 className="text-text-tertiary mb-1 text-xs font-medium tracking-wide uppercase">
        {title}
      </h4>
      {children}
    </div>
  );
}

export function FeatureSection({ feature, progress, isCurrent }: FeatureSectionProps) {
  return (
    <div
      className={`border-border-light rounded-xl border bg-white p-4 shadow-sm transition-all ${
        isCurrent ? 'ring-accent-primary/30 ring-2' : ''
      }`}
    >
      {/* Feature header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-text-primary text-sm font-semibold">{feature.name}</h3>
          {isCurrent && (
            <span className="bg-accent-primary/10 text-accent-primary rounded-full px-2 py-0.5 text-xs font-medium">
              Current
            </span>
          )}
        </div>
        {progress && <SectionProgress sections={progress.sections} />}
      </div>

      {/* Intent */}
      <SectionBlock
        title="Intent"
        isEmpty={
          !feature.intent.goal &&
          !feature.intent.coreAnxiety &&
          feature.intent.notTryingTo.length === 0
        }
      >
        {feature.intent.goal && <p className="text-text-primary text-sm">{feature.intent.goal}</p>}
        {feature.intent.coreAnxiety && (
          <div className="mt-1.5">
            <span className="text-text-tertiary text-xs">Core anxiety:</span>
            <p className="text-text-secondary text-sm">{feature.intent.coreAnxiety}</p>
          </div>
        )}
        {feature.intent.notTryingTo.length > 0 && (
          <div className="mt-1.5">
            <span className="text-text-tertiary text-xs">Not trying to:</span>
            <ul className="text-text-secondary mt-0.5 list-inside list-disc text-sm">
              {feature.intent.notTryingTo.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </SectionBlock>

      {/* Interaction Model */}
      <SectionBlock
        title="Interaction Model"
        isEmpty={
          feature.interactionModel.primaryFlow.length === 0 &&
          feature.interactionModel.keyInteractions.length === 0 &&
          feature.interactionModel.errorHandling.length === 0
        }
      >
        {feature.interactionModel.primaryFlow.length > 0 && (
          <div className="mb-2">
            <span className="text-text-tertiary text-xs">Primary flow:</span>
            <ol className="text-text-secondary mt-0.5 list-inside list-decimal text-sm">
              {feature.interactionModel.primaryFlow.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        )}
        {feature.interactionModel.keyInteractions.length > 0 && (
          <div className="mb-2">
            <span className="text-text-tertiary text-xs">Key interactions:</span>
            <ul className="text-text-secondary mt-0.5 list-inside list-disc text-sm">
              {feature.interactionModel.keyInteractions.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        {feature.interactionModel.errorHandling.length > 0 && (
          <div>
            <span className="text-text-tertiary text-xs">Error handling:</span>
            <ul className="text-text-secondary mt-0.5 list-inside list-disc text-sm">
              {feature.interactionModel.errorHandling.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </SectionBlock>

      {/* Design Decisions */}
      <SectionBlock title="Design Decisions" isEmpty={feature.designDecisions.length === 0}>
        <div className="space-y-2">
          {feature.designDecisions.map((dd) => (
            <div key={dd.id} className="bg-bg-secondary rounded-lg p-2.5 text-sm">
              <p className="text-text-primary">
                <span className="font-medium">Chose:</span> {dd.chose}
              </p>
              <p className="text-text-secondary">
                <span className="font-medium">Over:</span> {dd.over}
              </p>
              <p className="text-text-tertiary">
                <span className="font-medium">Because:</span> {dd.because}
              </p>
            </div>
          ))}
        </div>
      </SectionBlock>

      {/* Patterns */}
      <SectionBlock title="Patterns Used" isEmpty={feature.patternsUsed.length === 0}>
        <div className="space-y-1">
          {feature.patternsUsed.map((p) => (
            <div key={p.id} className="text-sm">
              <span className="text-text-primary font-medium">{p.patternName}</span>
              <span className="text-text-secondary"> — {p.usage}</span>
            </div>
          ))}
        </div>
      </SectionBlock>

      {/* Constraints */}
      <SectionBlock title="Constraints" isEmpty={feature.constraints.length === 0}>
        <div className="space-y-1">
          {feature.constraints.map((c) => (
            <div key={c.id} className="text-sm">
              <span className="text-text-primary font-medium">{c.constraint}</span>
              <span className="text-text-secondary"> — {c.designResponse}</span>
            </div>
          ))}
        </div>
      </SectionBlock>

      {/* Not This */}
      <SectionBlock title="Not This" isEmpty={feature.notThis.length === 0}>
        <ul className="text-text-secondary list-inside list-disc text-sm">
          {feature.notThis.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </SectionBlock>

      {/* Open Questions */}
      <SectionBlock title="Open Questions" isEmpty={feature.openQuestions.length === 0}>
        <ul className="text-text-secondary list-inside list-disc text-sm">
          {feature.openQuestions.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ul>
      </SectionBlock>
    </div>
  );
}
