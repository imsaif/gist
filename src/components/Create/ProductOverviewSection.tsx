'use client';

import { ProductOverview } from '@/types/file';

interface ProductOverviewSectionProps {
  product: ProductOverview;
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

export function ProductOverviewSection({ product }: ProductOverviewSectionProps) {
  const hasAnyContent =
    product.name || product.description || product.audience || product.aiApproach;

  return (
    <div className="mb-6">
      <h2 className="text-text-secondary mb-3 text-sm font-semibold tracking-wide uppercase">
        Product Overview
      </h2>
      {hasAnyContent ? (
        <div className="border-border-light space-y-3 rounded-xl border bg-white p-4 shadow-sm">
          <Field label="Product" value={product.name} />
          <Field label="Description" value={product.description} />
          <Field label="Audience" value={product.audience} />
          <Field label="AI Approach" value={product.aiApproach} />
        </div>
      ) : (
        <div className="border-border-light rounded-xl border-2 border-dashed p-6 text-center">
          <p className="text-text-tertiary text-sm">
            Product details will appear here as you describe your product
          </p>
        </div>
      )}
    </div>
  );
}
