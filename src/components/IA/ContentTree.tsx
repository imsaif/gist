'use client';

import { ReactNode } from 'react';
import { ContentItem } from '@/types';

interface ContentTreeProps {
  items: ContentItem[];
  allItems: ContentItem[];
  depth?: number;
}

const TYPE_COLORS: Record<ContentItem['type'], { bg: string; text: string }> = {
  page: { bg: 'bg-blue-100', text: 'text-blue-700' },
  section: { bg: 'bg-green-100', text: 'text-green-700' },
  component: { bg: 'bg-purple-100', text: 'text-purple-700' },
  data: { bg: 'bg-amber-100', text: 'text-amber-700' },
};

const TYPE_ICONS: Record<ContentItem['type'], ReactNode> = {
  page: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  section: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
    </svg>
  ),
  component: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  data: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  ),
};

export function ContentTree({ items, allItems, depth = 0 }: ContentTreeProps) {
  return (
    <div className={depth > 0 ? 'border-border-light ml-4 border-l pl-4' : ''}>
      {items.map((item) => {
        const colors = TYPE_COLORS[item.type];
        const icon = TYPE_ICONS[item.type];
        const children = allItems.filter((i) => i.parent === item.id);

        return (
          <div key={item.id} className="mb-2">
            <div className="border-border-light rounded-lg border bg-white p-3">
              <div className="flex items-start gap-2">
                <div className={`rounded p-1 ${colors.bg} ${colors.text}`}>{icon}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-text-primary text-sm font-medium">{item.name}</span>
                    <span className={`rounded px-1.5 py-0.5 text-xs ${colors.bg} ${colors.text}`}>
                      {item.type}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-text-tertiary mt-1 text-xs">{item.description}</p>
                  )}
                </div>
              </div>
            </div>
            {children.length > 0 && (
              <ContentTree items={children} allItems={allItems} depth={depth + 1} />
            )}
          </div>
        );
      })}
    </div>
  );
}
