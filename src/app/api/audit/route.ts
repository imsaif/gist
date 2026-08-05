import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { parseRepoUrl, fetchRepoFiles, GitHubError } from '@/lib/repo-audit/github';
import { scanStructure } from '@/lib/repo-audit/scanner';
import { buildReadingPrompt, callModel } from '@/lib/repo-audit/provider';
import { parseReading } from '@/lib/repo-audit/parse';
import { selectQuestions } from '@/lib/repo-audit/questions';
import { checkAuditLimit } from '@/lib/repo-audit/rateLimit';
import type { AuditResult } from '@/types/repo-audit';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Cached per repo. Only reached when everything below it succeeded, so a
// failure can never become the cached answer for a repository.
const cachedAudit = (owner: string, repo: string) =>
  unstable_cache(
    async (): Promise<AuditResult> => {
      const files = await fetchRepoFiles(owner, repo);
      const facts = scanStructure(files);
      if (!facts.hasReadme) {
        return {
          reading: 'This repository has no README, so an AI tool has almost nothing to go on.',
          gaps: [
            { id: 'no_audience', evidence: 'no README' },
            { id: 'no_negative_audience', evidence: 'no README' },
            { id: 'no_boundary', evidence: 'no README' },
          ],
          questions: selectQuestions([
            { id: 'no_audience', evidence: '' },
            { id: 'no_negative_audience', evidence: '' },
            { id: 'no_boundary', evidence: '' },
          ]),
          facts,
        };
      }
      const { reading, gaps } = parseReading(await callModel(buildReadingPrompt(files, facts)));
      return { reading, gaps, questions: selectQuestions(gaps), facts };
    },
    ['repo-audit', owner, repo],
    { revalidate: 60 * 60 * 24, tags: [`repo-audit:${owner}/${repo}`] }
  )();

export async function POST(req: NextRequest) {
  // Client controlled: x-forwarded-for can be rotated by an attacker to
  // bypass this per-IP limit. Accepted per the task 8 decision, the global
  // ceiling on the generate route is the real spend backstop, not this one.
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const limit = await checkAuditLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      { error: `Too many audits. Try again in ${limit.retryAfter} seconds.`, kind: 'rate_limited' },
      { status: 429 }
    );
  }

  const body = (await req.json().catch(() => null)) as { url?: string } | null;
  const parsed = body?.url ? parseRepoUrl(body.url) : null;
  if (!parsed) {
    return NextResponse.json(
      { error: 'That does not look like a GitHub repository URL.', kind: 'bad_url' },
      { status: 400 }
    );
  }

  try {
    return NextResponse.json(await cachedAudit(parsed.owner, parsed.repo));
  } catch (err) {
    if (err instanceof GitHubError) {
      const message =
        err.kind === 'not_found'
          ? 'We could not find that repository. Is it public?'
          : err.kind === 'rate_limited'
            ? 'GitHub is rate limiting us right now. Try again shortly.'
            : 'We could not reach GitHub.';
      return NextResponse.json({ error: message, kind: err.kind }, { status: 502 });
    }
    return NextResponse.json(
      { error: 'The audit failed. Try again.', kind: 'model_error' },
      { status: 502 }
    );
  }
}
