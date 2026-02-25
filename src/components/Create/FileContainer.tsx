'use client';

import { useState, type ComponentType, type SVGProps } from 'react';
import { GistDesignFile, FeatureProgress, BeforeAfterItem } from '@/types/file';
import {
  ViewfinderCircleIcon,
  ArrowsRightLeftIcon,
  ScaleIcon,
  PuzzlePieceIcon,
  ShieldCheckIcon,
  Square3Stack3DIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/outline';
import { ProductOverviewSection } from './ProductOverviewSection';
import { PositioningSection } from './PositioningSection';
import { ContextSection } from './ContextSection';
import { FeatureSection } from './FeatureSection';
import { ExportPanel } from './ExportPanel';
import { BeforeAfterPreview } from './BeforeAfterPreview';

interface FileContainerProps {
  file: GistDesignFile;
  currentFeatureId: string | null;
  featureProgress: FeatureProgress[];
  beforeAfter: BeforeAfterItem[];
  onDownload: () => void;
  onCopyMarkdown: () => void;
  onCopyBrief: () => void;
  auditUrl?: string;
  originalResponse?: string;
}

type Tab = 'preview' | 'export';

export function FileContainer({
  file,
  currentFeatureId,
  featureProgress,
  beforeAfter,
  onDownload,
  onCopyMarkdown,
  onCopyBrief,
  auditUrl,
  originalResponse,
}: FileContainerProps) {
  const [activeTab, setActiveTab] = useState<Tab>('preview');

  return (
    <div className="flex h-full flex-col">
      {/* Tab bar */}
      <div className="border-border-light flex items-center gap-4 border-b px-6 py-3">
        <button
          onClick={() => setActiveTab('preview')}
          className={`text-sm font-medium transition-colors ${
            activeTab === 'preview'
              ? 'text-accent-primary'
              : 'text-text-tertiary hover:text-text-secondary'
          }`}
        >
          Preview
        </button>
        <button
          onClick={() => setActiveTab('export')}
          className={`text-sm font-medium transition-colors ${
            activeTab === 'export'
              ? 'text-accent-primary'
              : 'text-text-tertiary hover:text-text-secondary'
          }`}
        >
          Export
        </button>

        {/* Feature pills */}
        {file.features.length > 0 && (
          <div className="ml-auto flex items-center gap-1.5">
            {file.features.map((feature) => {
              const progress = featureProgress.find((p) => p.featureId === feature.id);
              const completeSections = progress
                ? Object.values(progress.sections).filter((s) => s === 'complete').length
                : 0;
              const totalSections = 7;
              const isCurrent = feature.id === currentFeatureId;

              return (
                <div
                  key={feature.id}
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                    isCurrent
                      ? 'bg-accent-primary/10 text-accent-primary'
                      : 'bg-bg-tertiary text-text-secondary'
                  }`}
                >
                  <span>{feature.name}</span>
                  <span className="text-text-tertiary">
                    {completeSections}/{totalSections}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'preview' ? (
          <>
            <ProductOverviewSection product={file.product} />
            <PositioningSection positioning={file.positioning} />
            <ContextSection context={file.context} />
            {file.features.length > 0 ? (
              <div>
                <h2 className="text-text-secondary mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
                  <RectangleStackIcon className="h-4 w-4" />
                  Features
                </h2>
                <div className="space-y-4">
                  {file.features.map((feature) => (
                    <FeatureSection
                      key={feature.id}
                      feature={feature}
                      progress={featureProgress.find((p) => p.featureId === feature.id)}
                      isCurrent={feature.id === currentFeatureId}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="border-border-light rounded-xl border-2 border-dashed p-6">
                <h2 className="text-text-secondary mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
                  <RectangleStackIcon className="h-4 w-4" />
                  What gets captured
                </h2>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {(
                    [
                      [
                        ViewfinderCircleIcon,
                        'Intent',
                        "Goal, core anxiety, what it's not trying to do",
                      ],
                      [
                        ArrowsRightLeftIcon,
                        'Interaction model',
                        'Primary flow, key interactions, error handling',
                      ],
                      [ScaleIcon, 'Design decisions', 'What you chose, over what, and why'],
                      [PuzzlePieceIcon, 'Patterns', 'AI UX patterns identified in your design'],
                      [ShieldCheckIcon, 'Constraints', 'Technical limits and design responses'],
                      [
                        Square3Stack3DIcon,
                        'States',
                        'Empty, loading, populated, error, edge cases',
                      ],
                    ] as [ComponentType<SVGProps<SVGSVGElement>>, string, string][]
                  ).map(([Icon, label, desc]) => (
                    <div key={label} className="flex items-start gap-2.5 text-sm">
                      <Icon className="text-text-tertiary mt-0.5 h-4 w-4 shrink-0" />
                      <div>
                        <span className="text-text-secondary font-medium">{label}</span>
                        <span className="text-text-tertiary"> — {desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <ExportPanel
              file={file}
              onDownload={onDownload}
              onCopyMarkdown={onCopyMarkdown}
              onCopyBrief={onCopyBrief}
              auditUrl={auditUrl}
              originalResponse={originalResponse}
            />
            <BeforeAfterPreview items={beforeAfter} file={file} />
          </>
        )}
      </div>
    </div>
  );
}
