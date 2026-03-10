'use client';

import { CubeIcon } from '@heroicons/react/24/outline';
import { ProductOverview } from '@/types/file';
import { Gap } from '@/types/audit';
import { EditableField } from './EditableField';
import { GapCard } from './GapCard';

interface ProductOverviewSectionProps {
  product: ProductOverview;
  gaps?: Gap[];
  isFromAudit?: boolean;
  onFieldChange?: (field: keyof ProductOverview, value: string) => void;
  initialProduct?: ProductOverview | null;
}

const SECTION_GAP_CATEGORIES = ['fabrication', 'missing_decisions'];

export function ProductOverviewSection({
  product,
  gaps,
  isFromAudit,
  onFieldChange,
  initialProduct,
}: ProductOverviewSectionProps) {
  const sectionGaps = gaps?.filter((g) => SECTION_GAP_CATEGORIES.includes(g.category)) || [];
  const hasAnyContent =
    product.name || product.description || product.audience || product.aiApproach;

  function isFieldChanged(field: keyof ProductOverview): boolean {
    if (!initialProduct) return false;
    return product[field] !== initialProduct[field] && product[field] !== null;
  }

  function isGapResolved(gap: Gap): boolean {
    if (!isFromAudit) return false;
    // A gap in this section is resolved when the relevant fields have been changed from initial
    if (gap.category === 'fabrication') {
      return isFieldChanged('description') || isFieldChanged('name');
    }
    if (gap.category === 'missing_decisions') {
      return isFieldChanged('aiApproach');
    }
    return false;
  }

  return (
    <div className="mb-6">
      <h2 className="text-text-secondary mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
        <CubeIcon className="h-4 w-4" />
        Product Overview
      </h2>

      {/* Gap cards */}
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
                label="Product"
                value={product.name}
                onChange={(v) => onFieldChange('name', v)}
                isFromAudit={isFromAudit && !isFieldChanged('name')}
              />
              <EditableField
                label="Description"
                value={product.description}
                onChange={(v) => onFieldChange('description', v)}
                isFromAudit={isFromAudit && !isFieldChanged('description')}
              />
              <EditableField
                label="Audience"
                value={product.audience}
                onChange={(v) => onFieldChange('audience', v)}
                isFromAudit={isFromAudit && !isFieldChanged('audience')}
              />
              <EditableField
                label="AI Approach"
                value={product.aiApproach}
                onChange={(v) => onFieldChange('aiApproach', v)}
                isFromAudit={isFromAudit && !isFieldChanged('aiApproach')}
              />
            </>
          ) : (
            <>
              <Field label="Product" value={product.name} />
              <Field label="Description" value={product.description} />
              <Field label="Audience" value={product.audience} />
              <Field label="AI Approach" value={product.aiApproach} />
            </>
          )}
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
