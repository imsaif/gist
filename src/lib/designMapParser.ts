import {
  DesignMap,
  DesignMapUpdate,
  FlowStep,
  FlowStepUpdate,
  IdentifiedPatternInMessage,
} from '@/types';

interface ParseResult {
  displayContent: string;
  designMapUpdate: DesignMapUpdate | null;
  identifiedPattern: IdentifiedPatternInMessage | null;
}

export function parseDesignMapUpdate(content: string): ParseResult {
  let displayContent = content;
  let designMapUpdate: DesignMapUpdate | null = null;
  let identifiedPattern: IdentifiedPatternInMessage | null = null;

  // Extract designmap_update JSON from response
  const mapRegex = /<designmap_update>([\s\S]*?)<\/designmap_update>/;
  const mapMatch = displayContent.match(mapRegex);

  if (mapMatch) {
    displayContent = displayContent.replace(mapRegex, '').trim();
    try {
      designMapUpdate = JSON.parse(mapMatch[1].trim()) as DesignMapUpdate;
    } catch (e) {
      console.error('Failed to parse design map update:', e);
    }
  }

  // Extract pattern_identified JSON from response
  const patternRegex = /<pattern_identified>([\s\S]*?)<\/pattern_identified>/;
  const patternMatch = displayContent.match(patternRegex);

  if (patternMatch) {
    displayContent = displayContent.replace(patternRegex, '').trim();
    try {
      const parsed = JSON.parse(patternMatch[1].trim());
      identifiedPattern = {
        patternId: parsed.patternId,
        reason: parsed.reason,
        flowStepId: parsed.flowStepId,
      };
    } catch (e) {
      console.error('Failed to parse pattern identified:', e);
    }
  }

  return {
    displayContent,
    designMapUpdate,
    identifiedPattern,
  };
}

function applyStepUpdate(existingStep: FlowStep, update: FlowStepUpdate): FlowStep {
  return {
    id: existingStep.id,
    title: update.title ?? existingStep.title,
    description: update.description ?? existingStep.description,
    // Arrays are additive
    states: update.states ? [...existingStep.states, ...update.states] : existingStep.states,
    decisions: update.decisions
      ? [...existingStep.decisions, ...update.decisions]
      : existingStep.decisions,
    patterns: update.patterns
      ? [...existingStep.patterns, ...update.patterns]
      : existingStep.patterns,
    openQuestions: update.openQuestions
      ? [...existingStep.openQuestions, ...update.openQuestions]
      : existingStep.openQuestions,
  };
}

function createStepFromUpdate(update: FlowStepUpdate): FlowStep {
  return {
    id: update.id,
    title: update.title ?? 'Untitled Step',
    description: update.description ?? '',
    states: update.states ?? [],
    decisions: update.decisions ?? [],
    patterns: update.patterns ?? [],
    openQuestions: update.openQuestions ?? [],
  };
}

export function mergeDesignMapUpdate(current: DesignMap, update: DesignMapUpdate): DesignMap {
  let newFlow = [...current.flow];

  // Handle addSteps (append new steps)
  if (update.addSteps && update.addSteps.length > 0) {
    const newSteps = update.addSteps.map((stepUpdate) => createStepFromUpdate(stepUpdate));
    newFlow = [...newFlow, ...newSteps];
  }

  // Handle updateSteps (merge by id, arrays are additive)
  if (update.updateSteps && update.updateSteps.length > 0) {
    newFlow = newFlow.map((step) => {
      const stepUpdate = update.updateSteps?.find((u) => u.id === step.id);
      if (stepUpdate) {
        return applyStepUpdate(step, stepUpdate);
      }
      return step;
    });
  }

  // Handle removeStepIds
  if (update.removeStepIds && update.removeStepIds.length > 0) {
    newFlow = newFlow.filter((step) => !update.removeStepIds?.includes(step.id));
  }

  return {
    overview: update.overview !== undefined ? update.overview : current.overview,
    flow: newFlow,
    constraints: update.constraints
      ? [...current.constraints, ...update.constraints]
      : current.constraints,
    alternatives: update.alternatives
      ? [...current.alternatives, ...update.alternatives]
      : current.alternatives,
    currentPhase: update.phase ?? current.currentPhase,
  };
}

// Add a pattern to a specific flow step
export function addPatternToStep(
  map: DesignMap,
  stepId: string,
  patternId: string,
  reason: string
): DesignMap {
  const newFlow = map.flow.map((step) => {
    if (step.id === stepId) {
      // Check if already added
      if (step.patterns.some((p) => p.patternId === patternId)) {
        return step;
      }
      return {
        ...step,
        patterns: [...step.patterns, { patternId, reason }],
      };
    }
    return step;
  });

  return {
    ...map,
    flow: newFlow,
  };
}

// Check if a pattern is already in the design map (across all steps)
export function isPatternInDesignMap(map: DesignMap, patternId: string): boolean {
  return map.flow.some((step) => step.patterns.some((p) => p.patternId === patternId));
}

// Get step by ID
export function getStepById(map: DesignMap, stepId: string): FlowStep | undefined {
  return map.flow.find((step) => step.id === stepId);
}

// Generate markdown from design map
export function generateDesignMapMarkdown(map: DesignMap): string {
  let md = `# Design Map${map.overview ? `: ${map.overview}` : ''}\n\n`;

  if (map.overview) {
    md += `## Overview\n${map.overview}\n\n`;
  }

  if (map.flow.length > 0) {
    md += `## User Flow\n\n`;
    map.flow.forEach((step, index) => {
      md += `### ${index + 1}. ${step.title}\n`;
      if (step.description) {
        md += `${step.description}\n\n`;
      }

      if (step.states.length > 0) {
        md += `**States:**\n`;
        step.states.forEach((state) => {
          md += `- [${state.type.toUpperCase()}] ${state.label}: ${state.description}\n`;
        });
        md += '\n';
      }

      if (step.decisions.length > 0) {
        md += `**Decisions:**\n`;
        step.decisions.forEach((decision) => {
          md += `- **${decision.decision}**: ${decision.rationale}\n`;
        });
        md += '\n';
      }

      if (step.patterns.length > 0) {
        md += `**Patterns:**\n`;
        step.patterns.forEach((pattern) => {
          md += `- ${pattern.patternId}: ${pattern.reason}\n`;
        });
        md += '\n';
      }

      if (step.openQuestions.length > 0) {
        md += `**Open Questions:**\n`;
        step.openQuestions.forEach((q) => {
          md += `- [ ] ${q}\n`;
        });
        md += '\n';
      }
    });
  }

  if (map.constraints.length > 0) {
    md += `## Constraints\n`;
    map.constraints.forEach((item) => {
      md += `- ${item}\n`;
    });
    md += '\n';
  }

  if (map.alternatives.length > 0) {
    md += `## Alternatives Considered\n\n`;
    map.alternatives.forEach((alt) => {
      md += `### ${alt.approach}${alt.rejected ? ' (Rejected)' : ''}\n`;
      md += `${alt.description}\n\n`;

      if (alt.pros.length > 0) {
        md += `**Pros:**\n`;
        alt.pros.forEach((pro) => {
          md += `- ${pro}\n`;
        });
      }

      if (alt.cons.length > 0) {
        md += `**Cons:**\n`;
        alt.cons.forEach((con) => {
          md += `- ${con}\n`;
        });
      }

      if (alt.rejected && alt.rejectionReason) {
        md += `\n*Rejection reason: ${alt.rejectionReason}*\n`;
      }
      md += '\n';
    });
  }

  return md;
}

// Get document info for design map
export function getDesignMapDocumentInfo(map: DesignMap): {
  title: string;
  lineCount: number;
} {
  let lines = 0;
  if (map.overview) lines += 3;

  map.flow.forEach((step) => {
    lines += 3; // title and description
    lines += step.states.length;
    lines += step.decisions.length;
    lines += step.patterns.length;
    lines += step.openQuestions.length;
  });

  lines += map.constraints.length + 2;
  lines += map.alternatives.length * 6;

  const title = map.overview
    ? `${map.overview.slice(0, 35)}${map.overview.length > 35 ? '...' : ''}`
    : 'Design Map';

  return {
    title,
    lineCount: Math.max(lines, 10),
  };
}
