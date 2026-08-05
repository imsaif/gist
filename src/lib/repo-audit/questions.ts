import type { Gap, GapId, Question } from '@/types/repo-audit';

export const MAX_QUESTIONS = 5;

// Ranked by how much the absence changes what an agent infers. A missing
// audience or boundary sends it to the wrong product entirely; a missing
// rationale only costs nuance.
const RANK: GapId[] = [
  'no_audience',
  'no_negative_audience',
  'no_boundary',
  'no_comparison',
  'no_rationale',
];

const QUESTIONS: Record<GapId, Question> = {
  no_audience: {
    gapId: 'no_audience',
    prompt: 'Who is this for?',
    placeholder: 'Engineering leads at teams of 5 to 50 who triage daily',
  },
  no_negative_audience: {
    gapId: 'no_negative_audience',
    prompt: 'Who is this deliberately not for?',
    placeholder: 'Teams who need configurable workflows',
  },
  no_boundary: {
    gapId: 'no_boundary',
    prompt: 'What did you deliberately choose not to build?',
    placeholder: 'No time tracking. It rewards looking busy.',
  },
  no_comparison: {
    gapId: 'no_comparison',
    prompt: 'Which product do people wrongly assume this is like, and how does it differ?',
    placeholder: 'People say it is like Jira. Jira is configurable, this is opinionated.',
  },
  no_rationale: {
    gapId: 'no_rationale',
    prompt: 'What is one decision you made that surprises people, and why?',
    placeholder: 'Editing over approve and reject, so it never feels like reviewing AI output',
  },
};

export function selectQuestions(gaps: Gap[]): Question[] {
  const present = new Set(gaps.map((g) => g.id));
  return RANK.filter((id) => present.has(id))
    .slice(0, MAX_QUESTIONS)
    .map((id) => QUESTIONS[id]);
}
