'use client';

import { BeforeAfterItem, GistDesignFile } from '@/types/file';

interface BeforeAfterPreviewProps {
  items: BeforeAfterItem[];
  file: GistDesignFile;
}

const SOURCE_LABELS: Record<string, string> = {
  'not-this': 'Not This',
  'design-decision': 'Design Decision',
  'explicit-pain': 'Explicit Pain',
};

export function BeforeAfterPreview({ items, file }: BeforeAfterPreviewProps) {
  if (items.length === 0) return null;

  // Group by feature
  const grouped = items.reduce<Record<string, BeforeAfterItem[]>>((acc, item) => {
    const key = item.featureId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="mb-6">
      <h2 className="text-text-secondary mb-3 text-sm font-semibold tracking-wide uppercase">
        What This File Fixes
      </h2>

      <div className="space-y-4">
        {Object.entries(grouped).map(([featureId, featureItems]) => {
          const feature = file.features.find((f) => f.id === featureId);
          return (
            <div key={featureId}>
              <h3 className="text-text-primary mb-2 text-sm font-medium">
                {feature?.name || featureId}
              </h3>
              <div className="space-y-2">
                {featureItems.map((item) => (
                  <div
                    key={item.id}
                    className="border-border-light grid grid-cols-2 gap-0 overflow-hidden rounded-xl border bg-white shadow-sm"
                  >
                    {/* Without */}
                    <div className="border-border-light border-r p-3">
                      <div className="mb-1 text-xs font-medium text-red-500">
                        Without gist.design
                      </div>
                      <p className="text-text-secondary text-sm">{item.without}</p>
                    </div>
                    {/* With */}
                    <div className="p-3">
                      <div className="mb-1 text-xs font-medium text-green-600">
                        With gist.design
                      </div>
                      <p className="text-text-secondary text-sm">{item.with}</p>
                    </div>
                    {/* Source indicator */}
                    <div className="border-border-light col-span-2 border-t px-3 py-1.5">
                      <span className="bg-bg-tertiary text-text-tertiary rounded px-1.5 py-0.5 text-xs">
                        {SOURCE_LABELS[item.source] || item.source}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
