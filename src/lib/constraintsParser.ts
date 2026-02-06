import {
  ConstraintMap,
  ConstraintMapUpdate,
  Constraint,
  DesignImplication,
  IdentifiedPatternInMessage,
} from '@/types';

interface ParseResult {
  displayContent: string;
  constraintsUpdate: ConstraintMapUpdate | null;
  identifiedPattern: IdentifiedPatternInMessage | null;
}

export function parseConstraintsUpdate(content: string): ParseResult {
  let displayContent = content;
  let constraintsUpdate: ConstraintMapUpdate | null = null;
  let identifiedPattern: IdentifiedPatternInMessage | null = null;

  const constraintsRegex = /<constraints_update>([\s\S]*?)<\/constraints_update>/;
  const constraintsMatch = displayContent.match(constraintsRegex);

  if (constraintsMatch) {
    displayContent = displayContent.replace(constraintsRegex, '').trim();
    try {
      constraintsUpdate = JSON.parse(constraintsMatch[1].trim()) as ConstraintMapUpdate;
    } catch (e) {
      console.error('Failed to parse constraints update:', e);
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
    constraintsUpdate,
    identifiedPattern,
  };
}

function applyConstraintUpdate(
  existing: Constraint,
  update: Partial<Constraint> & { id: string }
): Constraint {
  return {
    id: existing.id,
    category: update.category ?? existing.category,
    constraint: update.constraint ?? existing.constraint,
    severity: update.severity ?? existing.severity,
    source: update.source ?? existing.source,
  };
}

function applyImplicationUpdate(
  existing: DesignImplication,
  update: Partial<DesignImplication> & { id: string }
): DesignImplication {
  return {
    id: existing.id,
    constraintId: update.constraintId ?? existing.constraintId,
    implication: update.implication ?? existing.implication,
    designResponse: update.designResponse ?? existing.designResponse,
  };
}

export function mergeConstraintsUpdate(
  current: ConstraintMap,
  update: ConstraintMapUpdate
): ConstraintMap {
  let newConstraints = [...current.constraints];
  if (update.addConstraints && update.addConstraints.length > 0) {
    newConstraints = [...newConstraints, ...update.addConstraints];
  }
  if (update.updateConstraints && update.updateConstraints.length > 0) {
    newConstraints = newConstraints.map((c) => {
      const cUpdate = update.updateConstraints?.find((u) => u.id === c.id);
      if (cUpdate) return applyConstraintUpdate(c, cUpdate);
      return c;
    });
  }

  let newImplications = [...current.designImplications];
  if (update.addDesignImplications && update.addDesignImplications.length > 0) {
    newImplications = [...newImplications, ...update.addDesignImplications];
  }
  if (update.updateDesignImplications && update.updateDesignImplications.length > 0) {
    newImplications = newImplications.map((di) => {
      const diUpdate = update.updateDesignImplications?.find((u) => u.id === di.id);
      if (diUpdate) return applyImplicationUpdate(di, diUpdate);
      return di;
    });
  }

  return {
    projectContext:
      update.projectContext !== undefined ? update.projectContext : current.projectContext,
    constraints: newConstraints,
    designImplications: newImplications,
    opportunities: update.opportunities
      ? [...current.opportunities, ...update.opportunities]
      : current.opportunities,
    currentPhase: update.phase ?? current.currentPhase,
  };
}

export function generateConstraintsMarkdown(constraintMap: ConstraintMap): string {
  let md = `# Constraint Map\n\n`;

  if (constraintMap.projectContext) {
    md += `## Project Context\n${constraintMap.projectContext}\n\n`;
  }

  if (constraintMap.constraints.length > 0) {
    md += `## Constraints\n\n`;

    const categories = ['technical', 'timeline', 'resource', 'business', 'regulatory'] as const;
    for (const cat of categories) {
      const catConstraints = constraintMap.constraints.filter((c) => c.category === cat);
      if (catConstraints.length > 0) {
        md += `### ${cat.charAt(0).toUpperCase() + cat.slice(1)}\n\n`;
        catConstraints.forEach((c) => {
          md += `- **[${c.severity.toUpperCase()}]** ${c.constraint}`;
          if (c.source) md += ` _(Source: ${c.source})_`;
          md += '\n';
        });
        md += '\n';
      }
    }
  }

  if (constraintMap.designImplications.length > 0) {
    md += `## Design Implications\n\n`;
    constraintMap.designImplications.forEach((di) => {
      md += `- **Implication:** ${di.implication}\n`;
      md += `  - **Response:** ${di.designResponse}\n`;
    });
    md += '\n';
  }

  if (constraintMap.opportunities.length > 0) {
    md += `## Opportunities\n`;
    constraintMap.opportunities.forEach((opp) => (md += `- ${opp}\n`));
    md += '\n';
  }

  return md;
}

export function getConstraintsDocumentInfo(constraintMap: ConstraintMap): {
  title: string;
  lineCount: number;
} {
  let lines = 0;
  if (constraintMap.projectContext) lines += 3;
  lines += constraintMap.constraints.length * 2;
  lines += constraintMap.designImplications.length * 3;
  lines += constraintMap.opportunities.length + 2;

  const title = constraintMap.projectContext
    ? `${constraintMap.projectContext.slice(0, 35)}${constraintMap.projectContext.length > 35 ? '...' : ''}`
    : 'Constraint Map';

  return {
    title,
    lineCount: Math.max(lines, 10),
  };
}
