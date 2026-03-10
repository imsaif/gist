'use client';

import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { ProductContext } from '@/types/file';
import { Gap } from '@/types/audit';
import { EditableField } from './EditableField';
import { GapCard } from './GapCard';

interface ContextSectionProps {
  context: ProductContext;
  gaps?: Gap[];
  isFromAudit?: boolean;
  onFieldChange?: (field: 'pricing' | 'stage', value: string) => void;
  initialContext?: ProductContext | null;
}

// invisible_mechanics can touch context (how things work at a product level)
const SECTION_GAP_CATEGORIES = ['invisible_mechanics'];

export function ContextSection({
  context,
  gaps,
  isFromAudit,
  onFieldChange,
  initialContext,
}: ContextSectionProps) {
  const sectionGaps = gaps?.filter((g) => SECTION_GAP_CATEGORIES.includes(g.category)) || [];
  const hasAnyContent =
    context.pricing ||
    context.integratesWith.length > 0 ||
    context.requires.length > 0 ||
    context.stage;

  function isFieldChanged(field: 'pricing' | 'stage'): boolean {
    if (!initialContext) return false;
    return context[field] !== initialContext[field] && context[field] !== null;
  }

  function isGapResolved(gap: Gap): boolean {
    if (!isFromAudit) return false;
    if (gap.category === 'invisible_mechanics') {
      return isFieldChanged('pricing') || isFieldChanged('stage');
    }
    return false;
  }

  return (
    <div className="mb-6">
      <h2 className="text-text-secondary mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
        <InformationCircleIcon className="h-4 w-4" />
        Context
      </h2>

      {sectionGaps.length > 0 && (
        <div className="mb-3 space-y-2">
          {sectionGaps.map((gap) => (
            <GapCard key={gap.id} gap={gap} isResolved={isGapResolved(gap)} />
          ))}
        </div>
      )}

      {hasAnyContent || isFromAudit ? (
        <div className="border-border-light bg-bg-tertiary space-y-3 rounded-xl border p-4 shadow-sm">
          {onFieldChange ? (
            <>
              <EditableField
                label="Pricing"
                value={context.pricing}
                onChange={(v) => onFieldChange('pricing', v)}
                isFromAudit={isFromAudit && !isFieldChanged('pricing')}
              />
              <ListField label="Integrates with" items={context.integratesWith} />
              <ListField label="Requires" items={context.requires} />
              <EditableField
                label="Stage"
                value={context.stage}
                onChange={(v) => onFieldChange('stage', v)}
                isFromAudit={isFromAudit && !isFieldChanged('stage')}
              />
            </>
          ) : (
            <>
              <Field label="Pricing" value={context.pricing} />
              <ListField label="Integrates with" items={context.integratesWith} />
              <ListField label="Requires" items={context.requires} />
              <Field label="Stage" value={context.stage} />
            </>
          )}
        </div>
      ) : (
        <div className="border-border-light rounded-xl border-2 border-dashed p-6 text-center">
          <p className="text-text-tertiary text-sm">
            Product context will appear here as you describe your product
          </p>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-text-tertiary text-xs font-medium tracking-wide uppercase">{label}</dt>
      <dd className={`mt-1 text-sm ${value ? 'text-text-primary' : 'text-text-tertiary italic'}`}>
        {value || 'Not set yet'}
      </dd>
    </div>
  );
}

function ListField({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <dt className="text-text-tertiary text-xs font-medium tracking-wide uppercase">{label}</dt>
      <dd className="text-text-primary mt-1 text-sm">{items.join(', ')}</dd>
    </div>
  );
}
