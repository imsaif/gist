'use client';

import { FlowStateType } from '@/types';

interface FlowStateTagProps {
  type: FlowStateType;
  label: string;
}

const STATE_COLORS: Record<FlowStateType, { bg: string; text: string; border: string }> = {
  happy: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  empty: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  error: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  loading: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  edge: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
};

export function FlowStateTag({ type, label }: FlowStateTagProps) {
  const colors = STATE_COLORS[type];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text} ${colors.border}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${colors.text.replace('text-', 'bg-')}`} />
      {label}
    </span>
  );
}
