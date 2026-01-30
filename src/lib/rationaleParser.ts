import {
  DesignRationale,
  DesignRationaleUpdate,
  DesignDecision,
  IdentifiedPatternInMessage,
} from '@/types';

interface ParseResult {
  displayContent: string;
  rationaleUpdate: DesignRationaleUpdate | null;
  identifiedPattern: IdentifiedPatternInMessage | null;
}

export function parseRationaleUpdate(content: string): ParseResult {
  let displayContent = content;
  let rationaleUpdate: DesignRationaleUpdate | null = null;
  let identifiedPattern: IdentifiedPatternInMessage | null = null;

  // Extract rationale_update JSON from response
  const rationaleRegex = /<rationale_update>([\s\S]*?)<\/rationale_update>/;
  const rationaleMatch = displayContent.match(rationaleRegex);

  if (rationaleMatch) {
    displayContent = displayContent.replace(rationaleRegex, '').trim();
    try {
      rationaleUpdate = JSON.parse(rationaleMatch[1].trim()) as DesignRationaleUpdate;
    } catch (e) {
      console.error('Failed to parse rationale update:', e);
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
        decisionId: parsed.decisionId,
      };
    } catch (e) {
      console.error('Failed to parse pattern identified:', e);
    }
  }

  return {
    displayContent,
    rationaleUpdate,
    identifiedPattern,
  };
}

function applyDecisionUpdate(
  existingDecision: DesignDecision,
  update: Partial<DesignDecision> & { id: string }
): DesignDecision {
  return {
    id: existingDecision.id,
    title: update.title ?? existingDecision.title,
    what: update.what ?? existingDecision.what,
    why: update.why ?? existingDecision.why,
    rejected: update.rejected
      ? [...existingDecision.rejected, ...update.rejected]
      : existingDecision.rejected,
    patterns: update.patterns
      ? [...existingDecision.patterns, ...update.patterns]
      : existingDecision.patterns,
    openQuestions: update.openQuestions
      ? [...existingDecision.openQuestions, ...update.openQuestions]
      : existingDecision.openQuestions,
  };
}

export function mergeRationaleUpdate(
  current: DesignRationale,
  update: DesignRationaleUpdate
): DesignRationale {
  let newDecisions = [...current.decisions];

  // Handle addDecisions (append new decisions)
  if (update.addDecisions && update.addDecisions.length > 0) {
    newDecisions = [...newDecisions, ...update.addDecisions];
  }

  // Handle updateDecisions (merge by id)
  if (update.updateDecisions && update.updateDecisions.length > 0) {
    newDecisions = newDecisions.map((decision) => {
      const decisionUpdate = update.updateDecisions?.find((u) => u.id === decision.id);
      if (decisionUpdate) {
        return applyDecisionUpdate(decision, decisionUpdate);
      }
      return decision;
    });
  }

  return {
    problem: update.problem !== undefined ? update.problem : current.problem,
    context: update.context ? [...current.context, ...update.context] : current.context,
    decisions: newDecisions,
    assumptions: update.assumptions
      ? [...current.assumptions, ...update.assumptions]
      : current.assumptions,
    openQuestions: update.openQuestions
      ? [...current.openQuestions, ...update.openQuestions]
      : current.openQuestions,
    currentPhase: update.phase ?? current.currentPhase,
  };
}

// Add a pattern to a specific decision
export function addPatternToDecision(
  rationale: DesignRationale,
  decisionId: string,
  patternId: string,
  application: string,
  caution?: string
): DesignRationale {
  const newDecisions = rationale.decisions.map((decision) => {
    if (decision.id === decisionId) {
      // Check if already added
      if (decision.patterns.some((p) => p.patternId === patternId)) {
        return decision;
      }
      return {
        ...decision,
        patterns: [...decision.patterns, { patternId, application, caution }],
      };
    }
    return decision;
  });

  return {
    ...rationale,
    decisions: newDecisions,
  };
}

// Check if a pattern is already in the rationale (across all decisions)
export function isPatternInRationale(rationale: DesignRationale, patternId: string): boolean {
  return rationale.decisions.some((decision) =>
    decision.patterns.some((p) => p.patternId === patternId)
  );
}

// Get decision by ID
export function getDecisionById(
  rationale: DesignRationale,
  decisionId: string
): DesignDecision | undefined {
  return rationale.decisions.find((decision) => decision.id === decisionId);
}

// Generate markdown from design rationale (stakeholder-ready format)
export function generateRationaleMarkdown(rationale: DesignRationale): string {
  let md = `# Design Rationale\n\n`;

  if (rationale.problem) {
    md += `## Problem Statement\n${rationale.problem}\n\n`;
  }

  if (rationale.context.length > 0) {
    md += `## Context\n`;
    rationale.context.forEach((item) => {
      md += `- ${item}\n`;
    });
    md += '\n';
  }

  if (rationale.assumptions.length > 0) {
    md += `## Assumptions\n`;
    rationale.assumptions.forEach((item) => {
      md += `- ${item}\n`;
    });
    md += '\n';
  }

  if (rationale.decisions.length > 0) {
    md += `## Key Decisions\n\n`;
    rationale.decisions.forEach((decision, index) => {
      md += `### ${index + 1}. ${decision.title}\n\n`;
      md += `**What:** ${decision.what}\n\n`;
      md += `**Why:** ${decision.why}\n\n`;

      if (decision.rejected.length > 0) {
        md += `**Alternatives Considered:**\n`;
        decision.rejected.forEach((alt) => {
          md += `- ~~${alt.approach}~~ — ${alt.reason}\n`;
        });
        md += '\n';
      }

      if (decision.patterns.length > 0) {
        md += `**Patterns Applied:**\n`;
        decision.patterns.forEach((pattern) => {
          md += `- **${pattern.patternId}**: ${pattern.application}`;
          if (pattern.caution) {
            md += ` *(Caution: ${pattern.caution})*`;
          }
          md += '\n';
        });
        md += '\n';
      }

      if (decision.openQuestions.length > 0) {
        md += `**Open Questions:**\n`;
        decision.openQuestions.forEach((q) => {
          md += `- [ ] ${q}\n`;
        });
        md += '\n';
      }
    });
  }

  if (rationale.openQuestions.length > 0) {
    md += `## Overall Open Questions\n`;
    rationale.openQuestions.forEach((q) => {
      md += `- [ ] ${q}\n`;
    });
    md += '\n';
  }

  return md;
}

// Get document info for rationale
export function getRationaleDocumentInfo(rationale: DesignRationale): {
  title: string;
  lineCount: number;
} {
  let lines = 0;
  if (rationale.problem) lines += 3;

  lines += rationale.context.length + 2;
  lines += rationale.assumptions.length + 2;

  rationale.decisions.forEach((decision) => {
    lines += 6; // title, what, why
    lines += decision.rejected.length;
    lines += decision.patterns.length;
    lines += decision.openQuestions.length;
  });

  lines += rationale.openQuestions.length + 2;

  const title = rationale.problem
    ? `${rationale.problem.slice(0, 35)}${rationale.problem.length > 35 ? '...' : ''}`
    : 'Design Rationale';

  return {
    title,
    lineCount: Math.max(lines, 10),
  };
}
