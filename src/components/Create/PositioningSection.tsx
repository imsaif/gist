'use client';

import { Positioning } from '@/types/file';

interface PositioningSectionProps {
  positioning: Positioning;
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

export function PositioningSection({ positioning }: PositioningSectionProps) {
  const hasAnyContent =
    positioning.category ||
    positioning.forWho ||
    positioning.notForWho ||
    positioning.comparisons.length > 0;

  return (
    <div className="mb-6">
      <h2 className="text-text-secondary mb-3 text-sm font-semibold tracking-wide uppercase">
        Positioning
      </h2>
      {hasAnyContent ? (
        <div className="border-border-light space-y-3 rounded-xl border bg-white p-4 shadow-sm">
          <Field label="Category" value={positioning.category} />
          <Field label="For" value={positioning.forWho} />
          <Field label="Not for" value={positioning.notForWho} />
          {positioning.comparisons.length > 0 && (
            <div>
              <dt className="text-text-tertiary text-xs font-medium tracking-wide uppercase">
                Comparisons
              </dt>
              <dd className="mt-1 space-y-1">
                {positioning.comparisons.map((c) => (
                  <div key={c.id} className="text-text-primary text-sm">
                    <span className="font-medium">vs {c.vs}:</span> {c.difference}
                  </div>
                ))}
              </dd>
            </div>
          )}
        </div>
      ) : (
        <div className="border-border-light rounded-xl border-2 border-dashed p-6 text-center">
          <p className="text-text-tertiary text-sm">
            Positioning details will appear here as you describe your product
          </p>
        </div>
      )}
    </div>
  );
}
