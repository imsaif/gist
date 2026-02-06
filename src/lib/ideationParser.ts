import { Ideation, IdeationUpdate, Approach, IdentifiedPatternInMessage } from '@/types';

interface ParseResult {
  displayContent: string;
  ideationUpdate: IdeationUpdate | null;
  identifiedPattern: IdentifiedPatternInMessage | null;
}

export function parseIdeationUpdate(content: string): ParseResult {
  let displayContent = content;
  let ideationUpdate: IdeationUpdate | null = null;
  let identifiedPattern: IdentifiedPatternInMessage | null = null;

  const ideationRegex = /<ideation_update>([\s\S]*?)<\/ideation_update>/;
  const ideationMatch = displayContent.match(ideationRegex);

  if (ideationMatch) {
    displayContent = displayContent.replace(ideationRegex, '').trim();
    try {
      ideationUpdate = JSON.parse(ideationMatch[1].trim()) as IdeationUpdate;
    } catch (e) {
      console.error('Failed to parse ideation update:', e);
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
    ideationUpdate,
    identifiedPattern,
  };
}

function applyApproachUpdate(
  existing: Approach,
  update: Partial<Approach> & { id: string }
): Approach {
  return {
    id: existing.id,
    title: update.title ?? existing.title,
    description: update.description ?? existing.description,
    targetUsers: update.targetUsers ?? existing.targetUsers,
    strengths: update.strengths ? [...existing.strengths, ...update.strengths] : existing.strengths,
    weaknesses: update.weaknesses
      ? [...existing.weaknesses, ...update.weaknesses]
      : existing.weaknesses,
    effort: update.effort ?? existing.effort,
    patterns: update.patterns ? [...existing.patterns, ...update.patterns] : existing.patterns,
  };
}

export function mergeIdeationUpdate(current: Ideation, update: IdeationUpdate): Ideation {
  let newApproaches = [...current.approaches];
  if (update.addApproaches && update.addApproaches.length > 0) {
    newApproaches = [...newApproaches, ...update.addApproaches];
  }
  if (update.updateApproaches && update.updateApproaches.length > 0) {
    newApproaches = newApproaches.map((app) => {
      const appUpdate = update.updateApproaches?.find((u) => u.id === app.id);
      if (appUpdate) return applyApproachUpdate(app, appUpdate);
      return app;
    });
  }

  return {
    problemStatement:
      update.problemStatement !== undefined ? update.problemStatement : current.problemStatement,
    approaches: newApproaches,
    evaluationCriteria: update.addEvaluationCriteria
      ? [...current.evaluationCriteria, ...update.addEvaluationCriteria]
      : current.evaluationCriteria,
    recommendation: update.recommendation ?? current.recommendation,
    currentPhase: update.phase ?? current.currentPhase,
  };
}

export function generateIdeationMarkdown(ideation: Ideation): string {
  let md = `# Solution Options Board\n\n`;

  if (ideation.problemStatement) {
    md += `## Problem Statement\n${ideation.problemStatement}\n\n`;
  }

  if (ideation.approaches.length > 0) {
    md += `## Approaches\n\n`;
    ideation.approaches.forEach((app, i) => {
      md += `### ${i + 1}. ${app.title}\n`;
      md += `${app.description}\n`;
      md += `- **Target Users:** ${app.targetUsers}\n`;
      md += `- **Effort:** ${app.effort}\n`;
      if (app.strengths.length > 0) {
        md += `\n**Strengths:**\n`;
        app.strengths.forEach((s) => (md += `- ${s}\n`));
      }
      if (app.weaknesses.length > 0) {
        md += `\n**Weaknesses:**\n`;
        app.weaknesses.forEach((w) => (md += `- ${w}\n`));
      }
      if (app.patterns.length > 0) {
        md += `\n**Relevant Patterns:** ${app.patterns.join(', ')}\n`;
      }
      md += '\n';
    });
  }

  if (ideation.evaluationCriteria.length > 0) {
    md += `## Evaluation Criteria\n\n`;
    ideation.evaluationCriteria.forEach((ec) => {
      md += `- **${ec.criterion}** (${ec.weight})\n`;
    });
    md += '\n';
  }

  if (ideation.recommendation) {
    const recApproach = ideation.approaches.find(
      (a) => a.id === ideation.recommendation?.approachId
    );
    md += `## Recommendation\n\n`;
    md += `**Recommended Approach:** ${recApproach?.title ?? ideation.recommendation.approachId}\n\n`;
    md += `${ideation.recommendation.reasoning}\n\n`;
    if (ideation.recommendation.nextSteps.length > 0) {
      md += `### Next Steps\n`;
      ideation.recommendation.nextSteps.forEach((step, i) => (md += `${i + 1}. ${step}\n`));
      md += '\n';
    }
  }

  return md;
}

export function getIdeationDocumentInfo(ideation: Ideation): {
  title: string;
  lineCount: number;
} {
  let lines = 0;
  if (ideation.problemStatement) lines += 3;
  lines += ideation.approaches.length * 8;
  lines += ideation.evaluationCriteria.length + 2;
  if (ideation.recommendation) lines += 6;

  const title = ideation.problemStatement
    ? `${ideation.problemStatement.slice(0, 35)}${ideation.problemStatement.length > 35 ? '...' : ''}`
    : 'Solution Options Board';

  return {
    title,
    lineCount: Math.max(lines, 10),
  };
}
