'use client';

import { FlowStep } from '@/types';
import { FlowStepCard } from './FlowStepCard';

interface FlowTimelineProps {
  steps: FlowStep[];
}

export function FlowTimeline({ steps }: FlowTimelineProps) {
  if (steps.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-text-tertiary text-sm">
          Flow steps will appear here as you map them out.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {steps.map((step, index) => (
        <FlowStepCard key={step.id} step={step} index={index} />
      ))}
    </div>
  );
}
