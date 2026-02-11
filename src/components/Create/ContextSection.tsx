'use client';

import { ProductContext } from '@/types/file';

interface ContextSectionProps {
  context: ProductContext;
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

export function ContextSection({ context }: ContextSectionProps) {
  const hasAnyContent =
    context.pricing ||
    context.integratesWith.length > 0 ||
    context.requires.length > 0 ||
    context.stage;

  return (
    <div className="mb-6">
      <h2 className="text-text-secondary mb-3 text-sm font-semibold tracking-wide uppercase">
        Context
      </h2>
      {hasAnyContent ? (
        <div className="border-border-light space-y-3 rounded-xl border bg-white p-4 shadow-sm">
          <Field label="Pricing" value={context.pricing} />
          <ListField label="Integrates with" items={context.integratesWith} />
          <ListField label="Requires" items={context.requires} />
          <Field label="Stage" value={context.stage} />
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
