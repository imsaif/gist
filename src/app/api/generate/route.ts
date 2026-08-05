import { NextRequest, NextResponse } from 'next/server';
import { parseRepoUrl, fetchRepoFiles } from '@/lib/repo-audit/github';
import { scanStructure } from '@/lib/repo-audit/scanner';
import { buildSummaryPrompt, callModel } from '@/lib/repo-audit/provider';
import { buildGistFile, PLACEHOLDER } from '@/lib/repo-audit/buildFile';
import { checkGenerateLimit } from '@/lib/repo-audit/rateLimit';
import type { GapId } from '@/types/repo-audit';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    url?: string;
    answers?: Record<string, unknown>;
  } | null;
  const parsed = body?.url ? parseRepoUrl(body.url) : null;
  if (!parsed) {
    return NextResponse.json({ error: 'Missing repository.', kind: 'bad_url' }, { status: 400 });
  }

  const limit = await checkGenerateLimit();
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'We are at capacity for this hour. Try again later.', kind: 'rate_limited' },
      { status: 429 }
    );
  }

  // Drop any non-string answer instead of coercing it. A number or object
  // that survives here would either throw inside buildGistFile or, worse,
  // get stringified into an invented claim, exactly what the placeholder
  // rule exists to prevent. A dropped entry just renders as unanswered.
  const rawAnswers = body?.answers ?? {};
  const answers: Partial<Record<GapId, string>> = {};
  for (const [key, value] of Object.entries(rawAnswers)) {
    if (typeof value === 'string') {
      answers[key as GapId] = value;
    }
  }

  try {
    const files = await fetchRepoFiles(parsed.owner, parsed.repo);
    const hasReadme = scanStructure(files).hasReadme;
    const summary = hasReadme
      ? (await callModel(buildSummaryPrompt(files))).trim().split('\n')[0] || PLACEHOLDER
      : PLACEHOLDER;
    const file = buildGistFile({
      repo: parsed.repo,
      summary,
      answers,
    });
    return NextResponse.json({ file });
  } catch {
    return NextResponse.json(
      {
        error: 'Generating the file failed. Your answers are still here, try again.',
        kind: 'model_error',
      },
      { status: 502 }
    );
  }
}
