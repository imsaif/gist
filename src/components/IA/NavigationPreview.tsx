'use client';

import { NavigationItem } from '@/types';

interface NavigationPreviewProps {
  items: NavigationItem[];
  depth?: number;
}

export function NavigationPreview({ items, depth = 0 }: NavigationPreviewProps) {
  return (
    <ul className={depth > 0 ? 'border-border-light ml-4 border-l pl-4' : ''}>
      {items.map((item) => (
        <li key={item.id} className="mb-1">
          <div className="hover:bg-bg-secondary flex items-center gap-2 rounded-lg px-3 py-2 transition-colors">
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
              className="text-text-tertiary"
            >
              {item.children && item.children.length > 0 ? (
                <>
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </>
              ) : (
                <>
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </>
              )}
            </svg>
            <span className="text-text-primary text-sm font-medium">{item.label}</span>
            <code className="text-text-tertiary bg-bg-secondary rounded px-1.5 py-0.5 text-xs">
              {item.path}
            </code>
          </div>
          {item.children && item.children.length > 0 && (
            <NavigationPreview items={item.children} depth={depth + 1} />
          )}
        </li>
      ))}
    </ul>
  );
}
