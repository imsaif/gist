import type { GapId } from '@/types/repo-audit';

export const PLACEHOLDER = '[needs your input]';

export interface BuildInput {
  repo: string;
  summary: string;
  answers: Partial<Record<GapId, string>>;
}

function answered(answers: BuildInput['answers'], id: GapId): string {
  const v = (answers[id] ?? '').trim();
  return v.length > 0 ? v : PLACEHOLDER;
}

export function buildGistFile({ repo, summary, answers }: BuildInput): string {
  return [
    `# ${repo}`,
    '',
    `> ${summary}`,
    '',
    '## Positioning',
    '',
    `- For: ${answered(answers, 'no_audience')}`,
    `- Not for: ${answered(answers, 'no_negative_audience')}`,
    `- Compared to: ${answered(answers, 'no_comparison')}`,
    '',
    '### Not This',
    '',
    `- ${answered(answers, 'no_boundary')}`,
    '',
    '## Design Decisions',
    '',
    `- ${answered(answers, 'no_rationale')}`,
    '',
    '## Open Questions',
    '',
    `- Any section marked ${PLACEHOLDER} was not answered and should be filled in.`,
    '',
  ].join('\n');
}
