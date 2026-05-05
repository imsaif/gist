import type { DraftFile } from '@/types/audit';

/**
 * Render a (possibly partial) gallery DraftFile into the canonical `llms.gist`
 * markdown shape. Lives in `src/lib/gallery/` because the gallery JSONs only
 * carry `DraftFile` (not the full `GistDesignFile`) — we render what we have
 * and leave the rest for the founder to fill in once the file is in their repo.
 */
export function renderDraftMarkdown(draft: DraftFile | null | undefined, name: string): string {
  if (!draft) return `# ${name}\n\n_(No draft generated yet.)_`;

  const { product, positioning, context } = draft;
  const lines: string[] = [];
  lines.push('---');
  if (product.name) lines.push(`name: ${product.name}`);
  if (positioning.category) lines.push(`category: ${positioning.category}`);
  if (product.audience) lines.push(`audience: ${product.audience}`);
  lines.push('---', '');

  lines.push(`# ${product.name || name}`, '');
  if (product.description) lines.push(product.description, '');

  if (positioning.forWho || positioning.notForWho) {
    lines.push('## Who this is for', '');
    if (positioning.forWho) lines.push(`- **For:** ${positioning.forWho}`);
    if (positioning.notForWho) lines.push(`- **Not for:** ${positioning.notForWho}`);
    lines.push('');
  }

  if (context.pricing || context.stage) {
    lines.push('## Context', '');
    if (context.pricing) lines.push(`- **Pricing:** ${context.pricing}`);
    if (context.stage) lines.push(`- **Stage:** ${context.stage}`);
    lines.push('');
  }

  return lines.join('\n').trimEnd() + '\n';
}
