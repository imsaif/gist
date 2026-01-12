import { Brief, BriefUpdate } from '@/types';

interface ParseResult {
  displayContent: string;
  briefUpdate: BriefUpdate | null;
}

export function parseBriefUpdate(content: string): ParseResult {
  // Extract brief_update JSON from response
  const briefRegex = /<brief_update>([\s\S]*?)<\/brief_update>/;
  const match = content.match(briefRegex);

  if (!match) {
    return {
      displayContent: content,
      briefUpdate: null,
    };
  }

  // Remove brief_update from display content
  const displayContent = content.replace(briefRegex, '').trim();

  // Parse JSON
  try {
    const briefUpdate = JSON.parse(match[1].trim()) as BriefUpdate;
    return {
      displayContent,
      briefUpdate,
    };
  } catch (e) {
    console.error('Failed to parse brief update:', e);
    return {
      displayContent,
      briefUpdate: null,
    };
  }
}

export function mergeBriefUpdate(
  currentBrief: Brief,
  update: BriefUpdate
): Brief {
  return {
    goal:
      update.goal !== undefined && update.goal !== null
        ? update.goal
        : currentBrief.goal,

    context: update.context
      ? [...currentBrief.context, ...update.context]
      : currentBrief.context,

    decisions: update.decisions
      ? [...currentBrief.decisions, ...update.decisions]
      : currentBrief.decisions,

    openQuestions: update.openQuestions
      ? [...currentBrief.openQuestions, ...update.openQuestions]
      : currentBrief.openQuestions,

    readyToDesign:
      update.readyToDesign !== undefined
        ? update.readyToDesign
        : currentBrief.readyToDesign,
  };
}
