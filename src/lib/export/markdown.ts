import { GistDesignFile, Feature } from '@/types/file';

export function renderFullFeature(feature: Feature): string {
  let md = `## ${feature.name}\n\n`;

  // Intent
  md += `### Intent\n`;
  if (feature.intent.goal) {
    md += `${feature.intent.goal}\n\n`;
  }
  if (feature.intent.coreAnxiety) {
    md += `**Core Anxiety:** ${feature.intent.coreAnxiety}\n\n`;
  }
  if (feature.intent.notTryingTo.length > 0) {
    md += `**Not trying to:**\n`;
    feature.intent.notTryingTo.forEach((item) => {
      md += `- ${item}\n`;
    });
    md += '\n';
  }

  // Interaction Model
  if (
    feature.interactionModel.primaryFlow.length > 0 ||
    feature.interactionModel.keyInteractions.length > 0 ||
    feature.interactionModel.errorHandling.length > 0
  ) {
    md += `### Interaction Model\n\n`;

    if (feature.interactionModel.primaryFlow.length > 0) {
      md += `**Primary Flow:**\n`;
      feature.interactionModel.primaryFlow.forEach((step, i) => {
        md += `${i + 1}. ${step}\n`;
      });
      md += '\n';
    }

    if (feature.interactionModel.keyInteractions.length > 0) {
      md += `**Key Interactions:**\n`;
      feature.interactionModel.keyInteractions.forEach((item) => {
        md += `- ${item}\n`;
      });
      md += '\n';
    }

    if (feature.interactionModel.errorHandling.length > 0) {
      md += `**Error Handling:**\n`;
      feature.interactionModel.errorHandling.forEach((item) => {
        md += `- ${item}\n`;
      });
      md += '\n';
    }
  }

  // Design Decisions
  if (feature.designDecisions.length > 0) {
    md += `### Design Decisions\n\n`;
    feature.designDecisions.forEach((dd) => {
      md += `- Chose: ${dd.chose}\n`;
      md += `  Over: ${dd.over}\n`;
      md += `  Because: ${dd.because}\n\n`;
    });
  }

  // Patterns Used
  if (feature.patternsUsed.length > 0) {
    md += `### Patterns Used\n\n`;
    feature.patternsUsed.forEach((p) => {
      md += `- **${p.patternName}**: ${p.usage}`;
      if (p.url) {
        md += ` ([reference](${p.url}))`;
      }
      md += '\n';
    });
    md += '\n';
  }

  // Constraints
  if (feature.constraints.length > 0) {
    md += `### Constraints\n\n`;
    feature.constraints.forEach((c) => {
      md += `- **${c.constraint}**: ${c.designResponse}\n`;
    });
    md += '\n';
  }

  // Not This
  if (feature.notThis.length > 0) {
    md += `### Not This\n\n`;
    feature.notThis.forEach((item) => {
      md += `- ${item}\n`;
    });
    md += '\n';
  }

  // Open Questions
  if (feature.openQuestions.length > 0) {
    md += `### Open Questions\n\n`;
    feature.openQuestions.forEach((q) => {
      md += `- [ ] ${q}\n`;
    });
    md += '\n';
  }

  return md;
}

export function renderSummaryFeature(feature: Feature): string {
  let md = `## ${feature.name}\n\n`;

  // Intent only
  if (feature.intent.goal) {
    md += `### Intent\n`;
    md += `${feature.intent.goal}\n\n`;
  }

  // Not This only
  if (feature.notThis.length > 0) {
    md += `### Not This\n\n`;
    feature.notThis.forEach((item) => {
      md += `- ${item}\n`;
    });
    md += '\n';
  }

  return md;
}

export function generateGistDesignMarkdown(file: GistDesignFile): string {
  let md = '';

  // Product header
  md += `# ${file.product.name || 'Untitled Product'}\n\n`;

  if (file.product.description) {
    md += `${file.product.description}\n\n`;
  }

  if (file.product.audience) {
    md += `**Audience:** ${file.product.audience}\n\n`;
  }

  if (file.product.aiApproach) {
    md += `**AI Approach:** ${file.product.aiApproach}\n\n`;
  }

  // Positioning
  const hasPositioning =
    file.positioning.category ||
    file.positioning.forWho ||
    file.positioning.notForWho ||
    file.positioning.comparisons.length > 0;

  if (hasPositioning) {
    md += `## Positioning\n\n`;
    if (file.positioning.category) {
      md += `**Category:** ${file.positioning.category}\n\n`;
    }
    if (file.positioning.forWho) {
      md += `**For:** ${file.positioning.forWho}\n\n`;
    }
    if (file.positioning.notForWho) {
      md += `**Not for:** ${file.positioning.notForWho}\n\n`;
    }
    if (file.positioning.comparisons.length > 0) {
      md += `**Comparisons:**\n`;
      file.positioning.comparisons.forEach((c) => {
        md += `- vs ${c.vs}: ${c.difference}\n`;
      });
      md += '\n';
    }
  }

  // Context
  const hasContext =
    file.context.pricing ||
    file.context.integratesWith.length > 0 ||
    file.context.requires.length > 0 ||
    file.context.stage;

  if (hasContext) {
    md += `## Context\n\n`;
    if (file.context.pricing) {
      md += `**Pricing:** ${file.context.pricing}\n\n`;
    }
    if (file.context.integratesWith.length > 0) {
      md += `**Integrates with:** ${file.context.integratesWith.join(', ')}\n\n`;
    }
    if (file.context.requires.length > 0) {
      md += `**Requires:** ${file.context.requires.join(', ')}\n\n`;
    }
    if (file.context.stage) {
      md += `**Stage:** ${file.context.stage}\n\n`;
    }
  }

  md += '---\n\n';

  // Features
  file.features.forEach((feature) => {
    md += renderFullFeature(feature);
    md += '---\n\n';
  });

  return md.trim() + '\n';
}
