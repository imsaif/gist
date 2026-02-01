import { Critique, CritiqueUpdate, CritiqueIssue, IdentifiedPatternInMessage } from '@/types';

interface ParseResult {
  displayContent: string;
  critiqueUpdate: CritiqueUpdate | null;
  identifiedPattern: IdentifiedPatternInMessage | null;
}

export function parseCritiqueUpdate(content: string): ParseResult {
  let displayContent = content;
  let critiqueUpdate: CritiqueUpdate | null = null;
  let identifiedPattern: IdentifiedPatternInMessage | null = null;

  // Extract critique_update JSON from response
  const critiqueRegex = /<critique_update>([\s\S]*?)<\/critique_update>/;
  const critiqueMatch = displayContent.match(critiqueRegex);

  if (critiqueMatch) {
    displayContent = displayContent.replace(critiqueRegex, '').trim();
    try {
      critiqueUpdate = JSON.parse(critiqueMatch[1].trim()) as CritiqueUpdate;
    } catch (e) {
      console.error('Failed to parse critique update:', e);
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
    critiqueUpdate,
    identifiedPattern,
  };
}

function applyIssueUpdate(
  existingIssue: CritiqueIssue,
  update: Partial<CritiqueIssue> & { id: string }
): CritiqueIssue {
  return {
    id: existingIssue.id,
    severity: update.severity ?? existingIssue.severity,
    category: update.category ?? existingIssue.category,
    title: update.title ?? existingIssue.title,
    description: update.description ?? existingIssue.description,
    suggestion: update.suggestion ?? existingIssue.suggestion,
    patternId: update.patternId ?? existingIssue.patternId,
  };
}

export function mergeCritiqueUpdate(current: Critique, update: CritiqueUpdate): Critique {
  let newIssues = [...current.issues];

  // Handle addIssues (append new issues)
  if (update.addIssues && update.addIssues.length > 0) {
    newIssues = [...newIssues, ...update.addIssues];
  }

  // Handle updateIssues (merge by id)
  if (update.updateIssues && update.updateIssues.length > 0) {
    newIssues = newIssues.map((issue) => {
      const issueUpdate = update.updateIssues?.find((u) => u.id === issue.id);
      if (issueUpdate) {
        return applyIssueUpdate(issue, issueUpdate);
      }
      return issue;
    });
  }

  return {
    imageDescription:
      update.imageDescription !== undefined ? update.imageDescription : current.imageDescription,
    whatsWorking: update.whatsWorking
      ? [...current.whatsWorking, ...update.whatsWorking]
      : current.whatsWorking,
    issues: newIssues,
    patterns: update.patterns ? [...current.patterns, ...update.patterns] : current.patterns,
    priorityFixes: update.priorityFixes ?? current.priorityFixes,
    currentPhase: update.phase ?? current.currentPhase,
  };
}

// Check if a pattern is already in the critique
export function isPatternInCritique(critique: Critique, patternId: string): boolean {
  return critique.patterns.some((p) => p.patternId === patternId);
}

// Add a pattern to the critique
export function addPatternToCritique(
  critique: Critique,
  patternId: string,
  reason: string
): Critique {
  if (isPatternInCritique(critique, patternId)) {
    return critique;
  }

  return {
    ...critique,
    patterns: [...critique.patterns, { patternId, reason }],
  };
}

// Get issue by ID
export function getIssueById(critique: Critique, issueId: string): CritiqueIssue | undefined {
  return critique.issues.find((issue) => issue.id === issueId);
}

// Generate markdown from critique
export function generateCritiqueMarkdown(critique: Critique): string {
  let md = `# Design Critique\n\n`;

  if (critique.imageDescription) {
    md += `## Design Overview\n${critique.imageDescription}\n\n`;
  }

  if (critique.whatsWorking.length > 0) {
    md += `## What's Working\n`;
    critique.whatsWorking.forEach((item) => {
      md += `- ${item}\n`;
    });
    md += '\n';
  }

  if (critique.issues.length > 0) {
    md += `## Issues Found\n\n`;

    // Group by severity
    const criticalIssues = critique.issues.filter((i) => i.severity === 'critical');
    const majorIssues = critique.issues.filter((i) => i.severity === 'major');
    const minorIssues = critique.issues.filter((i) => i.severity === 'minor');

    if (criticalIssues.length > 0) {
      md += `### Critical Issues\n\n`;
      criticalIssues.forEach((issue) => {
        md += `#### ${issue.title}\n`;
        md += `- **Category:** ${issue.category}\n`;
        md += `- **Problem:** ${issue.description}\n`;
        md += `- **Suggestion:** ${issue.suggestion}\n`;
        if (issue.patternId) {
          md += `- **Related Pattern:** ${issue.patternId}\n`;
        }
        md += '\n';
      });
    }

    if (majorIssues.length > 0) {
      md += `### Major Issues\n\n`;
      majorIssues.forEach((issue) => {
        md += `#### ${issue.title}\n`;
        md += `- **Category:** ${issue.category}\n`;
        md += `- **Problem:** ${issue.description}\n`;
        md += `- **Suggestion:** ${issue.suggestion}\n`;
        if (issue.patternId) {
          md += `- **Related Pattern:** ${issue.patternId}\n`;
        }
        md += '\n';
      });
    }

    if (minorIssues.length > 0) {
      md += `### Minor Issues\n\n`;
      minorIssues.forEach((issue) => {
        md += `#### ${issue.title}\n`;
        md += `- **Category:** ${issue.category}\n`;
        md += `- **Problem:** ${issue.description}\n`;
        md += `- **Suggestion:** ${issue.suggestion}\n`;
        if (issue.patternId) {
          md += `- **Related Pattern:** ${issue.patternId}\n`;
        }
        md += '\n';
      });
    }
  }

  if (critique.patterns.length > 0) {
    md += `## Relevant Patterns\n`;
    critique.patterns.forEach((p) => {
      md += `- **${p.patternId}**: ${p.reason}\n`;
    });
    md += '\n';
  }

  if (critique.priorityFixes.length > 0) {
    md += `## Priority Fixes\n`;
    critique.priorityFixes.forEach((fix, i) => {
      md += `${i + 1}. ${fix}\n`;
    });
    md += '\n';
  }

  return md;
}

// Get document info for critique
export function getCritiqueDocumentInfo(critique: Critique): {
  title: string;
  lineCount: number;
} {
  let lines = 0;
  if (critique.imageDescription) lines += 3;

  lines += critique.whatsWorking.length + 2;
  lines += critique.issues.length * 5;
  lines += critique.patterns.length + 2;
  lines += critique.priorityFixes.length + 2;

  const title = critique.imageDescription
    ? `${critique.imageDescription.slice(0, 35)}${critique.imageDescription.length > 35 ? '...' : ''}`
    : 'Design Critique';

  return {
    title,
    lineCount: Math.max(lines, 10),
  };
}
