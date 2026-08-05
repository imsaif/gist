import { NextRequest, NextResponse } from 'next/server';
import { parseRepoUrl, fetchRepoFiles } from '@/lib/repo-audit/github';
import { buildSummaryPrompt, callModel } from '@/lib/repo-audit/provider';
import { buildGistFile } from '@/lib/repo-audit/buildFile';
import { checkGenerateLimit } from '@/lib/repo-audit/rateLimit';
import type { GapId } from '@/types/repo-audit';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const limit = await checkGenerateLimit();
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'We are at capacity for this hour. Try again later.', kind: 'rate_limited' },
      { status: 429 }
    );
  }

  const body = (await req.json().catch(() => null)) as {
    url?: string;
    answers?: Record<string, string>;
  } | null;
  const parsed = body?.url ? parseRepoUrl(body.url) : null;
  if (!parsed) {
    return NextResponse.json({ error: 'Missing repository.', kind: 'bad_url' }, { status: 400 });
  }

  try {
    const files = await fetchRepoFiles(parsed.owner, parsed.repo);
    const summary = (await callModel(buildSummaryPrompt(files))).trim().split('\n')[0];
    const file = buildGistFile({
      repo: parsed.repo,
      summary: summary || `${parsed.repo}.`,
      answers: (body?.answers ?? {}) as Partial<Record<GapId, string>>,
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
