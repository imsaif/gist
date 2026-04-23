'use client';

import { MapIcon } from '@heroicons/react/24/outline';
import { Positioning } from '@/types/file';
import { Gap } from '@/types/audit';
import { EditableField } from './EditableField';
import { GapCard } from './GapCard';

interface PositioningSectionProps {
  positioning: Positioning;
  gaps?: Gap[];
  isFromAudit?: boolean;
  onFieldChange?: (field: 'category' | 'forWho' | 'notForWho', value: string) => void;
  initialPositioning?: Positioning | null;
}

const SECTION_GAP_CATEGORIES = ['contradiction', 'category_conflict'];

export function PositioningSection({
  positioning,
  gaps,
  isFromAudit,
  onFieldChange,
  initialPositioning,
}: PositioningSectionProps) {
  const sectionGaps = gaps?.filter((g) => SECTION_GAP_CATEGORIES.includes(g.category)) || [];
  const hasAnyContent =
    positioning.category ||
    positioning.forWho ||
    positioning.notForWho ||
    positioning.comparisons.length > 0;

  function isFieldChanged(field: 'category' | 'forWho' | 'notForWho'): boolean {
    if (!initialPositioning) return false;
    return positioning[field] !== initialPositioning[field] && positioning[field] !== null;
  }

  function isGapResolved(gap: Gap): boolean {
    if (!isFromAudit) return false;
    if (gap.category === 'category_conflict') {
      return isFieldChanged('category');
    }
    if (gap.category === 'contradiction') {
      return isFieldChanged('category') || isFieldChanged('forWho');
    }
    return false;
  }

  return (
    <div className="mb-6">
      <h2 className="text-ink-secondary mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
        <MapIcon className="h-4 w-4" />
        Positioning
      </h2>

      {sectionGaps.length > 0 && (
        <div className="mb-3 space-y-2">
          {sectionGaps.map((gap) => (
            <GapCard key={gap.id} gap={gap} isResolved={isGapResolved(gap)} />
          ))}
        </div>
      )}

      {hasAnyContent || isFromAudit ? (
        <div className="border-border-primary bg-background-tertiary space-y-3 rounded-xl border p-4 shadow-sm">
          {onFieldChange ? (
            <>
              <EditableField
                label="Category"
                value={positioning.category}
                onChange={(v) => onFieldChange('category', v)}
                isFromAudit={isFromAudit && !isFieldChanged('category')}
              />
              <EditableField
                label="For"
                value={positioning.forWho}
                onChange={(v) => onFieldChange('forWho', v)}
                isFromAudit={isFromAudit && !isFieldChanged('forWho')}
              />
              <EditableField
                label="Not for"
                value={positioning.notForWho}
                onChange={(v) => onFieldChange('notForWho', v)}
                isFromAudit={isFromAudit && !isFieldChanged('notForWho')}
              />
            </>
          ) : (
            <>
              <Field label="Category" value={positioning.category} />
              <Field label="For" value={positioning.forWho} />
              <Field label="Not for" value={positioning.notForWho} />
            </>
          )}
          {positioning.comparisons.length > 0 && (
            <div>
              <dt className="text-ink-tertiary text-xs font-medium tracking-wide uppercase">
                Comparisons
              </dt>
              <dd className="mt-1 space-y-1">
                {positioning.comparisons.map((c) => (
                  <div key={c.id} className="text-ink-primary text-sm">
                    <span className="font-medium">vs {c.vs}:</span> {c.difference}
                  </div>
                ))}
              </dd>
            </div>
          )}
        </div>
      ) : (
        <div className="border-border-primary rounded-xl border-2 border-dashed p-6 text-center">
          <p className="text-ink-tertiary text-sm">
            Positioning details will appear here as you describe your product
          </p>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-ink-tertiary text-xs font-medium tracking-wide uppercase">{label}</dt>
      <dd className={`mt-1 text-sm ${value ? 'text-ink-primary' : 'text-ink-tertiary italic'}`}>
        {value || 'Not set yet'}
      </dd>
    </div>
  );
}
