import { Brief, BriefUpdate, IdentifiedPatternInMessage } from '@/types';

interface ParseResult {
  displayContent: string;
  briefUpdate: BriefUpdate | null;
  identifiedPattern: IdentifiedPatternInMessage | null;
}

export function parseBriefUpdate(content: string): ParseResult {
  let displayContent = content;
  let briefUpdate: BriefUpdate | null = null;
  let identifiedPattern: IdentifiedPatternInMessage | null = null;

  // Extract brief_update JSON from response
  const briefRegex = /<brief_update>([\s\S]*?)<\/brief_update>/;
  const briefMatch = displayContent.match(briefRegex);

  if (briefMatch) {
    displayContent = displayContent.replace(briefRegex, '').trim();
    try {
      briefUpdate = JSON.parse(briefMatch[1].trim()) as BriefUpdate;
    } catch (e) {
      console.error('Failed to parse brief update:', e);
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
      };
    } catch (e) {
      console.error('Failed to parse pattern identified:', e);
    }
  }

  return {
    displayContent,
    briefUpdate,
    identifiedPattern,
  };
}

export function mergeBriefUpdate(currentBrief: Brief, update: BriefUpdate): Brief {
  return {
    goal: update.goal !== undefined && update.goal !== null ? update.goal : currentBrief.goal,

    context: update.context ? [...currentBrief.context, ...update.context] : currentBrief.context,

    decisions: update.decisions
      ? [...currentBrief.decisions, ...update.decisions]
      : currentBrief.decisions,

    openQuestions: update.openQuestions
      ? [...currentBrief.openQuestions, ...update.openQuestions]
      : currentBrief.openQuestions,

    patterns: update.patterns
      ? [
          ...currentBrief.patterns,
          ...update.patterns.map((patternId) => ({
            patternId,
            reason: '',
            addedToBrief: true,
          })),
        ]
      : currentBrief.patterns,

    successCriteria: update.successCriteria
      ? [...currentBrief.successCriteria, ...update.successCriteria]
      : currentBrief.successCriteria,

    readyToDesign:
      update.readyToDesign !== undefined ? update.readyToDesign : currentBrief.readyToDesign,
  };
}

// Add a pattern to the brief (from UI action)
export function addPatternToBrief(currentBrief: Brief, patternId: string, reason: string): Brief {
  // Check if already added
  if (currentBrief.patterns.some((p) => p.patternId === patternId)) {
    return currentBrief;
  }

  return {
    ...currentBrief,
    patterns: [
      ...currentBrief.patterns,
      {
        patternId,
        reason,
        addedToBrief: true,
      },
    ],
  };
}

// Check if a pattern is already in the brief
export function isPatternInBrief(brief: Brief, patternId: string): boolean {
  return brief.patterns.some((p) => p.patternId === patternId);
}
