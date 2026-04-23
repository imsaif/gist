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
      <h4 className="text-ink-tertiary mb-1 text-xs font-medium tracking-wide uppercase">
        {title}
      </h4>
      {children}
    </div>
  );
}

export function FeatureSection({ feature, progress, isCurrent }: FeatureSectionProps) {
  return (
    <div
      className={`border-border-primary bg-background-tertiary rounded-xl border p-4 shadow-sm transition-all ${
        isCurrent ? 'ring-brand-primary/30 ring-2' : ''
      }`}
    >
      {/* Feature header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-ink-primary text-sm font-semibold">{feature.name}</h3>
          {isCurrent && (
            <span className="bg-brand-primary/10 text-brand-primary rounded-full px-2 py-0.5 text-xs font-medium">
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
        {feature.intent.goal && <p className="text-ink-primary text-sm">{feature.intent.goal}</p>}
        {feature.intent.coreAnxiety && (
          <div className="mt-1.5">
            <span className="text-ink-tertiary text-xs">Core anxiety:</span>
            <p className="text-ink-secondary text-sm">{feature.intent.coreAnxiety}</p>
          </div>
        )}
        {feature.intent.notTryingTo.length > 0 && (
          <div className="mt-1.5">
            <span className="text-ink-tertiary text-xs">Not trying to:</span>
            <ul className="text-ink-secondary mt-0.5 list-inside list-disc text-sm">
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
            <span className="text-ink-tertiary text-xs">Primary flow:</span>
            <ol className="text-ink-secondary mt-0.5 list-inside list-decimal text-sm">
              {feature.interactionModel.primaryFlow.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        )}
        {feature.interactionModel.keyInteractions.length > 0 && (
          <div className="mb-2">
            <span className="text-ink-tertiary text-xs">Key interactions:</span>
            <ul className="text-ink-secondary mt-0.5 list-inside list-disc text-sm">
              {feature.interactionModel.keyInteractions.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        {feature.interactionModel.errorHandling.length > 0 && (
          <div>
            <span className="text-ink-tertiary text-xs">Error handling:</span>
            <ul className="text-ink-secondary mt-0.5 list-inside list-disc text-sm">
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
            <div key={dd.id} className="bg-background-secondary rounded-lg p-2.5 text-sm">
              <p className="text-ink-primary">
                <span className="font-medium">Chose:</span> {dd.chose}
              </p>
              <p className="text-ink-secondary">
                <span className="font-medium">Over:</span> {dd.over}
              </p>
              <p className="text-ink-tertiary">
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
              <span className="text-ink-primary font-medium">{p.patternName}</span>
              <span className="text-ink-secondary"> — {p.usage}</span>
            </div>
          ))}
        </div>
      </SectionBlock>

      {/* Constraints */}
      <SectionBlock title="Constraints" isEmpty={feature.constraints.length === 0}>
        <div className="space-y-1">
          {feature.constraints.map((c) => (
            <div key={c.id} className="text-sm">
              <span className="text-ink-primary font-medium">{c.constraint}</span>
              <span className="text-ink-secondary"> — {c.designResponse}</span>
            </div>
          ))}
        </div>
      </SectionBlock>

      {/* Not This */}
      <SectionBlock title="Not This" isEmpty={feature.notThis.length === 0}>
        <ul className="text-ink-secondary list-inside list-disc text-sm">
          {feature.notThis.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </SectionBlock>

      {/* Open Questions */}
      <SectionBlock title="Open Questions" isEmpty={feature.openQuestions.length === 0}>
        <ul className="text-ink-secondary list-inside list-disc text-sm">
          {feature.openQuestions.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ul>
      </SectionBlock>

      {/* States */}
      <SectionBlock
        title="States"
        isEmpty={
          !feature.states ||
          (!feature.states.empty &&
            !feature.states.loading &&
            !feature.states.populated &&
            !feature.states.error &&
            feature.states.edgeCases.length === 0)
        }
      >
        {feature.states && (
          <div className="space-y-1.5">
            {feature.states.empty && (
              <div className="text-sm">
                <span className="text-ink-tertiary font-medium">Empty:</span>{' '}
                <span className="text-ink-secondary">{feature.states.empty}</span>
              </div>
            )}
            {feature.states.loading && (
              <div className="text-sm">
                <span className="text-ink-tertiary font-medium">Loading:</span>{' '}
                <span className="text-ink-secondary">{feature.states.loading}</span>
              </div>
            )}
            {feature.states.populated && (
              <div className="text-sm">
                <span className="text-ink-tertiary font-medium">Populated:</span>{' '}
                <span className="text-ink-secondary">{feature.states.populated}</span>
              </div>
            )}
            {feature.states.error && (
              <div className="text-sm">
                <span className="text-ink-tertiary font-medium">Error:</span>{' '}
                <span className="text-ink-secondary">{feature.states.error}</span>
              </div>
            )}
            {feature.states.edgeCases.length > 0 && (
              <div>
                <span className="text-ink-tertiary text-xs">Edge cases:</span>
                <ul className="text-ink-secondary mt-0.5 list-inside list-disc text-sm">
                  {feature.states.edgeCases.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </SectionBlock>

      {/* Execution */}
      <SectionBlock
        title="Execution"
        isEmpty={
          !feature.execution ||
          (!feature.execution.stackAndComponents &&
            !feature.execution.layout &&
            feature.execution.keyCopy.length === 0 &&
            !feature.execution.interactions &&
            !feature.execution.responsiveBehavior &&
            feature.execution.visualReferences.length === 0)
        }
      >
        {feature.execution && (
          <div className="space-y-1.5">
            {feature.execution.stackAndComponents && (
              <div className="text-sm">
                <span className="text-ink-tertiary font-medium">Stack & Components:</span>{' '}
                <span className="text-ink-secondary">{feature.execution.stackAndComponents}</span>
              </div>
            )}
            {feature.execution.layout && (
              <div className="text-sm">
                <span className="text-ink-tertiary font-medium">Layout:</span>{' '}
                <span className="text-ink-secondary">{feature.execution.layout}</span>
              </div>
            )}
            {feature.execution.keyCopy.length > 0 && (
              <div>
                <span className="text-ink-tertiary text-xs">Key copy:</span>
                <ul className="text-ink-secondary mt-0.5 list-inside list-disc text-sm">
                  {feature.execution.keyCopy.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {feature.execution.interactions && (
              <div className="text-sm">
                <span className="text-ink-tertiary font-medium">Interactions:</span>{' '}
                <span className="text-ink-secondary">{feature.execution.interactions}</span>
              </div>
            )}
            {feature.execution.responsiveBehavior && (
              <div className="text-sm">
                <span className="text-ink-tertiary font-medium">Responsive:</span>{' '}
                <span className="text-ink-secondary">{feature.execution.responsiveBehavior}</span>
              </div>
            )}
            {feature.execution.visualReferences.length > 0 && (
              <div>
                <span className="text-ink-tertiary text-xs">Visual references:</span>
                <ul className="text-ink-secondary mt-0.5 list-inside list-disc text-sm">
                  {feature.execution.visualReferences.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </SectionBlock>
    </div>
  );
}
