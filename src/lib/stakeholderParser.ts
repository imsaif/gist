import { StakeholderPrep, StakeholderUpdate, Objection, IdentifiedPatternInMessage } from '@/types';

interface ParseResult {
  displayContent: string;
  stakeholderUpdate: StakeholderUpdate | null;
  identifiedPattern: IdentifiedPatternInMessage | null;
}

export function parseStakeholderUpdate(content: string): ParseResult {
  let displayContent = content;
  let stakeholderUpdate: StakeholderUpdate | null = null;
  let identifiedPattern: IdentifiedPatternInMessage | null = null;

  // Extract stakeholder_update JSON from response
  const stakeholderRegex = /<stakeholder_update>([\s\S]*?)<\/stakeholder_update>/;
  const stakeholderMatch = displayContent.match(stakeholderRegex);

  if (stakeholderMatch) {
    displayContent = displayContent.replace(stakeholderRegex, '').trim();
    try {
      stakeholderUpdate = JSON.parse(stakeholderMatch[1].trim()) as StakeholderUpdate;
    } catch (e) {
      console.error('Failed to parse stakeholder update:', e);
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
    stakeholderUpdate,
    identifiedPattern,
  };
}

function applyObjectionUpdate(
  existingObjection: Objection,
  update: Partial<Objection> & { id: string }
): Objection {
  return {
    id: existingObjection.id,
    stakeholder: update.stakeholder ?? existingObjection.stakeholder,
    objection: update.objection ?? existingObjection.objection,
    counterArguments: update.counterArguments
      ? [...existingObjection.counterArguments, ...update.counterArguments]
      : existingObjection.counterArguments,
    evidenceNeeded: update.evidenceNeeded
      ? [...existingObjection.evidenceNeeded, ...update.evidenceNeeded]
      : existingObjection.evidenceNeeded,
  };
}

export function mergeStakeholderUpdate(
  current: StakeholderPrep,
  update: StakeholderUpdate
): StakeholderPrep {
  let newObjections = [...current.objections];

  // Handle addObjections (append new objections)
  if (update.addObjections && update.addObjections.length > 0) {
    newObjections = [...newObjections, ...update.addObjections];
  }

  // Handle updateObjections (merge by id)
  if (update.updateObjections && update.updateObjections.length > 0) {
    newObjections = newObjections.map((objection) => {
      const objectionUpdate = update.updateObjections?.find((u) => u.id === objection.id);
      if (objectionUpdate) {
        return applyObjectionUpdate(objection, objectionUpdate);
      }
      return objection;
    });
  }

  return {
    designDecision:
      update.designDecision !== undefined ? update.designDecision : current.designDecision,
    context: update.context ? [...current.context, ...update.context] : current.context,
    objections: newObjections,
    talkingPoints: update.talkingPoints
      ? [...current.talkingPoints, ...update.talkingPoints]
      : current.talkingPoints,
    riskMitigations: update.riskMitigations
      ? [...current.riskMitigations, ...update.riskMitigations]
      : current.riskMitigations,
    currentPhase: update.phase ?? current.currentPhase,
  };
}

// Get objection by ID
export function getObjectionById(
  stakeholder: StakeholderPrep,
  objectionId: string
): Objection | undefined {
  return stakeholder.objections.find((objection) => objection.id === objectionId);
}

// Generate markdown from stakeholder prep
export function generateStakeholderMarkdown(stakeholder: StakeholderPrep): string {
  let md = `# Stakeholder Preparation\n\n`;

  if (stakeholder.designDecision) {
    md += `## Decision\n${stakeholder.designDecision}\n\n`;
  }

  if (stakeholder.context.length > 0) {
    md += `## Context\n`;
    stakeholder.context.forEach((item) => {
      md += `- ${item}\n`;
    });
    md += '\n';
  }

  if (stakeholder.objections.length > 0) {
    md += `## Anticipated Objections\n\n`;
    stakeholder.objections.forEach((objection, index) => {
      md += `### ${index + 1}. ${objection.objection}\n`;
      md += `**From:** ${objection.stakeholder}\n\n`;

      if (objection.counterArguments.length > 0) {
        md += `**Counter-arguments:**\n`;
        objection.counterArguments.forEach((arg) => {
          md += `- ${arg}\n`;
        });
        md += '\n';
      }

      if (objection.evidenceNeeded.length > 0) {
        md += `**Evidence needed:**\n`;
        objection.evidenceNeeded.forEach((evidence) => {
          md += `- [ ] ${evidence}\n`;
        });
        md += '\n';
      }
    });
  }

  if (stakeholder.talkingPoints.length > 0) {
    md += `## Key Talking Points\n`;
    stakeholder.talkingPoints.forEach((point, i) => {
      md += `${i + 1}. ${point}\n`;
    });
    md += '\n';
  }

  if (stakeholder.riskMitigations.length > 0) {
    md += `## Risk Mitigations\n`;
    stakeholder.riskMitigations.forEach((mitigation) => {
      md += `- ${mitigation}\n`;
    });
    md += '\n';
  }

  return md;
}

// Get document info for stakeholder
export function getStakeholderDocumentInfo(stakeholder: StakeholderPrep): {
  title: string;
  lineCount: number;
} {
  let lines = 0;
  if (stakeholder.designDecision) lines += 3;

  lines += stakeholder.context.length + 2;

  stakeholder.objections.forEach((objection) => {
    lines += 4;
    lines += objection.counterArguments.length;
    lines += objection.evidenceNeeded.length;
  });

  lines += stakeholder.talkingPoints.length + 2;
  lines += stakeholder.riskMitigations.length + 2;

  const title = stakeholder.designDecision
    ? `${stakeholder.designDecision.slice(0, 35)}${stakeholder.designDecision.length > 35 ? '...' : ''}`
    : 'Stakeholder Prep';

  return {
    title,
    lineCount: Math.max(lines, 10),
  };
}
