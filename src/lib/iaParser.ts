import {
  InformationArchitecture,
  IAUpdate,
  ContentItem,
  NavigationItem,
  IdentifiedPatternInMessage,
} from '@/types';

interface ParseResult {
  displayContent: string;
  iaUpdate: IAUpdate | null;
  identifiedPattern: IdentifiedPatternInMessage | null;
}

export function parseIAUpdate(content: string): ParseResult {
  let displayContent = content;
  let iaUpdate: IAUpdate | null = null;
  let identifiedPattern: IdentifiedPatternInMessage | null = null;

  // Extract ia_update JSON from response
  const iaRegex = /<ia_update>([\s\S]*?)<\/ia_update>/;
  const iaMatch = displayContent.match(iaRegex);

  if (iaMatch) {
    displayContent = displayContent.replace(iaRegex, '').trim();
    try {
      iaUpdate = JSON.parse(iaMatch[1].trim()) as IAUpdate;
    } catch (e) {
      console.error('Failed to parse IA update:', e);
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
    iaUpdate,
    identifiedPattern,
  };
}

function applyContentUpdate(
  existingContent: ContentItem,
  update: Partial<ContentItem> & { id: string }
): ContentItem {
  return {
    id: existingContent.id,
    name: update.name ?? existingContent.name,
    type: update.type ?? existingContent.type,
    description: update.description ?? existingContent.description,
    parent: update.parent ?? existingContent.parent,
    children: update.children ?? existingContent.children,
  };
}

export function mergeIAUpdate(
  current: InformationArchitecture,
  update: IAUpdate
): InformationArchitecture {
  let newContentInventory = [...current.contentInventory];

  // Handle addContent (append new content)
  if (update.addContent && update.addContent.length > 0) {
    newContentInventory = [...newContentInventory, ...update.addContent];
  }

  // Handle updateContent (merge by id)
  if (update.updateContent && update.updateContent.length > 0) {
    newContentInventory = newContentInventory.map((content) => {
      const contentUpdate = update.updateContent?.find((u) => u.id === content.id);
      if (contentUpdate) {
        return applyContentUpdate(content, contentUpdate);
      }
      return content;
    });
  }

  // Handle removeContentIds
  if (update.removeContentIds && update.removeContentIds.length > 0) {
    newContentInventory = newContentInventory.filter(
      (content) => !update.removeContentIds?.includes(content.id)
    );
  }

  // Build hierarchy from content inventory
  const hierarchy = buildHierarchy(newContentInventory);

  return {
    projectName: update.projectName !== undefined ? update.projectName : current.projectName,
    contentInventory: newContentInventory,
    hierarchy,
    navigation: update.navigation ?? current.navigation,
    openQuestions: update.openQuestions
      ? [...current.openQuestions, ...update.openQuestions]
      : current.openQuestions,
    currentPhase: update.phase ?? current.currentPhase,
  };
}

// Build hierarchy tree from flat content inventory
function buildHierarchy(contentInventory: ContentItem[]): ContentItem[] {
  const itemMap = new Map<string, ContentItem>();
  const roots: ContentItem[] = [];

  // First pass: create map of all items
  contentInventory.forEach((item) => {
    itemMap.set(item.id, { ...item, children: [] });
  });

  // Second pass: build tree
  contentInventory.forEach((item) => {
    const node = itemMap.get(item.id)!;
    if (item.parent && itemMap.has(item.parent)) {
      const parent = itemMap.get(item.parent)!;
      if (!parent.children) parent.children = [];
      parent.children.push(item.id);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

// Get content by ID
export function getContentById(
  ia: InformationArchitecture,
  contentId: string
): ContentItem | undefined {
  return ia.contentInventory.find((content) => content.id === contentId);
}

// Generate markdown from IA
export function generateIAMarkdown(ia: InformationArchitecture): string {
  let md = `# Information Architecture\n\n`;

  if (ia.projectName) {
    md += `## Project: ${ia.projectName}\n\n`;
  }

  if (ia.contentInventory.length > 0) {
    md += `## Content Inventory\n\n`;

    // Group by type
    const pages = ia.contentInventory.filter((c) => c.type === 'page');
    const sections = ia.contentInventory.filter((c) => c.type === 'section');
    const components = ia.contentInventory.filter((c) => c.type === 'component');
    const data = ia.contentInventory.filter((c) => c.type === 'data');

    if (pages.length > 0) {
      md += `### Pages\n`;
      pages.forEach((item) => {
        md += `- **${item.name}**: ${item.description}\n`;
      });
      md += '\n';
    }

    if (sections.length > 0) {
      md += `### Sections\n`;
      sections.forEach((item) => {
        md += `- **${item.name}**: ${item.description}`;
        if (item.parent) md += ` (in ${item.parent})`;
        md += '\n';
      });
      md += '\n';
    }

    if (components.length > 0) {
      md += `### Components\n`;
      components.forEach((item) => {
        md += `- **${item.name}**: ${item.description}\n`;
      });
      md += '\n';
    }

    if (data.length > 0) {
      md += `### Data\n`;
      data.forEach((item) => {
        md += `- **${item.name}**: ${item.description}\n`;
      });
      md += '\n';
    }
  }

  if (ia.navigation.length > 0) {
    md += `## Navigation Structure\n\n`;
    md += renderNavigationMarkdown(ia.navigation, 0);
    md += '\n';
  }

  if (ia.openQuestions.length > 0) {
    md += `## Open Questions\n`;
    ia.openQuestions.forEach((q) => {
      md += `- [ ] ${q}\n`;
    });
    md += '\n';
  }

  return md;
}

// Render navigation as indented markdown
function renderNavigationMarkdown(items: NavigationItem[], depth: number): string {
  let md = '';
  const indent = '  '.repeat(depth);

  items.forEach((item) => {
    md += `${indent}- **${item.label}** \`${item.path}\`\n`;
    if (item.children && item.children.length > 0) {
      md += renderNavigationMarkdown(item.children, depth + 1);
    }
  });

  return md;
}

// Get document info for IA
export function getIADocumentInfo(ia: InformationArchitecture): {
  title: string;
  lineCount: number;
} {
  let lines = 0;
  if (ia.projectName) lines += 3;

  lines += ia.contentInventory.length + 4;
  lines += countNavigationItems(ia.navigation) + 2;
  lines += ia.openQuestions.length + 2;

  const title = ia.projectName
    ? `${ia.projectName.slice(0, 35)}${ia.projectName.length > 35 ? '...' : ''}`
    : 'Information Architecture';

  return {
    title,
    lineCount: Math.max(lines, 10),
  };
}

// Count total navigation items (including nested)
function countNavigationItems(items: NavigationItem[]): number {
  let count = items.length;
  items.forEach((item) => {
    if (item.children) {
      count += countNavigationItems(item.children);
    }
  });
  return count;
}
