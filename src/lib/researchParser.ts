import {
  UserResearch,
  UserResearchUpdate,
  UserSegment,
  PainPoint,
  IdentifiedPatternInMessage,
} from '@/types';

interface ParseResult {
  displayContent: string;
  researchUpdate: UserResearchUpdate | null;
  identifiedPattern: IdentifiedPatternInMessage | null;
}

export function parseResearchUpdate(content: string): ParseResult {
  let displayContent = content;
  let researchUpdate: UserResearchUpdate | null = null;
  let identifiedPattern: IdentifiedPatternInMessage | null = null;

  const researchRegex = /<research_update>([\s\S]*?)<\/research_update>/;
  const researchMatch = displayContent.match(researchRegex);

  if (researchMatch) {
    displayContent = displayContent.replace(researchRegex, '').trim();
    try {
      researchUpdate = JSON.parse(researchMatch[1].trim()) as UserResearchUpdate;
    } catch (e) {
      console.error('Failed to parse research update:', e);
    }
  }

  const patternRegex = /<pattern_identified>([\s\S]*?)<\/pattern_identified>/;
  const patternMatch = displayContent.match(patternRegex);

  if (patternMatch) {
    displayContent = displayContent.replace(patternRegex, '').trim();
    try {
      const parsed = JSON.parse(patternMatch[1].trim());
      identifiedPattern = {
        patternId: parsed.patternId,
        reason: parsed.reason,
      };
    } catch (e) {
      console.error('Failed to parse pattern identified:', e);
    }
  }

  return {
    displayContent,
    researchUpdate,
    identifiedPattern,
  };
}

function applySegmentUpdate(
  existing: UserSegment,
  update: Partial<UserSegment> & { id: string }
): UserSegment {
  return {
    id: existing.id,
    name: update.name ?? existing.name,
    description: update.description ?? existing.description,
    goals: update.goals ? [...existing.goals, ...update.goals] : existing.goals,
    frustrations: update.frustrations
      ? [...existing.frustrations, ...update.frustrations]
      : existing.frustrations,
  };
}

function applyPainPointUpdate(
  existing: PainPoint,
  update: Partial<PainPoint> & { id: string }
): PainPoint {
  return {
    id: existing.id,
    segment: update.segment ?? existing.segment,
    pain: update.pain ?? existing.pain,
    severity: update.severity ?? existing.severity,
    frequency: update.frequency ?? existing.frequency,
  };
}

export function mergeResearchUpdate(
  current: UserResearch,
  update: UserResearchUpdate
): UserResearch {
  let newSegments = [...current.segments];
  if (update.addSegments && update.addSegments.length > 0) {
    newSegments = [...newSegments, ...update.addSegments];
  }
  if (update.updateSegments && update.updateSegments.length > 0) {
    newSegments = newSegments.map((seg) => {
      const segUpdate = update.updateSegments?.find((u) => u.id === seg.id);
      if (segUpdate) return applySegmentUpdate(seg, segUpdate);
      return seg;
    });
  }

  let newPainPoints = [...current.painPoints];
  if (update.addPainPoints && update.addPainPoints.length > 0) {
    newPainPoints = [...newPainPoints, ...update.addPainPoints];
  }
  if (update.updatePainPoints && update.updatePainPoints.length > 0) {
    newPainPoints = newPainPoints.map((pp) => {
      const ppUpdate = update.updatePainPoints?.find((u) => u.id === pp.id);
      if (ppUpdate) return applyPainPointUpdate(pp, ppUpdate);
      return pp;
    });
  }

  return {
    productContext:
      update.productContext !== undefined ? update.productContext : current.productContext,
    segments: newSegments,
    painPoints: newPainPoints,
    currentSolutions: update.currentSolutions
      ? [...current.currentSolutions, ...update.currentSolutions]
      : current.currentSolutions,
    unmetNeeds: update.unmetNeeds
      ? [...current.unmetNeeds, ...update.unmetNeeds]
      : current.unmetNeeds,
    researchMethods: update.addResearchMethods
      ? [...current.researchMethods, ...update.addResearchMethods]
      : current.researchMethods,
    keyInsights: update.keyInsights
      ? [...current.keyInsights, ...update.keyInsights]
      : current.keyInsights,
    currentPhase: update.phase ?? current.currentPhase,
  };
}

export function generateResearchMarkdown(research: UserResearch): string {
  let md = `# User Research Canvas\n\n`;

  if (research.productContext) {
    md += `## Product Context\n${research.productContext}\n\n`;
  }

  if (research.segments.length > 0) {
    md += `## User Segments\n\n`;
    research.segments.forEach((seg) => {
      md += `### ${seg.name}\n`;
      md += `${seg.description}\n`;
      if (seg.goals.length > 0) {
        md += `\n**Goals:**\n`;
        seg.goals.forEach((g) => (md += `- ${g}\n`));
      }
      if (seg.frustrations.length > 0) {
        md += `\n**Frustrations:**\n`;
        seg.frustrations.forEach((f) => (md += `- ${f}\n`));
      }
      md += '\n';
    });
  }

  if (research.painPoints.length > 0) {
    md += `## Pain Points\n\n`;
    research.painPoints.forEach((pp) => {
      md += `- **[${pp.severity.toUpperCase()}]** ${pp.pain}`;
      if (pp.frequency) md += ` (${pp.frequency})`;
      md += '\n';
    });
    md += '\n';
  }

  if (research.currentSolutions.length > 0) {
    md += `## Current Solutions\n`;
    research.currentSolutions.forEach((s) => (md += `- ${s}\n`));
    md += '\n';
  }

  if (research.unmetNeeds.length > 0) {
    md += `## Unmet Needs\n`;
    research.unmetNeeds.forEach((n) => (md += `- ${n}\n`));
    md += '\n';
  }

  if (research.researchMethods.length > 0) {
    md += `## Suggested Research Methods\n\n`;
    research.researchMethods.forEach((rm) => {
      md += `### ${rm.method}\n`;
      md += `- **Goal:** ${rm.goal}\n`;
      md += `- **Effort:** ${rm.effort}\n\n`;
    });
  }

  if (research.keyInsights.length > 0) {
    md += `## Key Insights\n`;
    research.keyInsights.forEach((insight, i) => (md += `${i + 1}. ${insight}\n`));
    md += '\n';
  }

  return md;
}

export function getResearchDocumentInfo(research: UserResearch): {
  title: string;
  lineCount: number;
} {
  let lines = 0;
  if (research.productContext) lines += 3;
  lines += research.segments.length * 6;
  lines += research.painPoints.length + 2;
  lines += research.currentSolutions.length + 2;
  lines += research.unmetNeeds.length + 2;
  lines += research.researchMethods.length * 4;
  lines += research.keyInsights.length + 2;

  const title = research.productContext
    ? `${research.productContext.slice(0, 35)}${research.productContext.length > 35 ? '...' : ''}`
    : 'User Research Canvas';

  return {
    title,
    lineCount: Math.max(lines, 10),
  };
}
