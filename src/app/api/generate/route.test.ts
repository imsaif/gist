import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { PLACEHOLDER } from '@/lib/repo-audit/buildFile';

vi.mock('@/lib/repo-audit/rateLimit', () => ({
  checkGenerateLimit: vi.fn().mockResolvedValue({ ok: true }),
}));

vi.mock('@/lib/repo-audit/github', async () => {
  const actual =
    await vi.importActual<typeof import('@/lib/repo-audit/github')>('@/lib/repo-audit/github');
  return {
    ...actual,
    fetchRepoFiles: vi.fn().mockResolvedValue({
      owner: 'vercel',
      repo: 'next.js',
      readme: '# next.js',
      packageDescription: null,
      filePaths: [],
    }),
  };
});

vi.mock('@/lib/repo-audit/provider', async () => {
  const actual = await vi.importActual<typeof import('@/lib/repo-audit/provider')>(
    '@/lib/repo-audit/provider'
  );
  return {
    ...actual,
    callModel: vi.fn().mockResolvedValue('A React framework.'),
  };
});

function post(body: unknown) {
  return new NextRequest('http://localhost/api/generate', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });
}

describe('POST /api/generate', () => {
  it('returns 400 with kind bad_url for a non-string url instead of throwing', async () => {
    const { POST } = await import('./route');
    const res = await POST(post({ url: 1 }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.kind).toBe('bad_url');
  });

  it('drops a non-string answer value so its section renders as unanswered, not coerced', async () => {
    const { POST } = await import('./route');
    const res = await POST(
      post({ url: 'vercel/next.js', answers: { no_audience: 5, no_boundary: {} } })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.file).toContain(`- For: ${PLACEHOLDER}`);
    expect(json.file).not.toContain('- For: 5');
  });

  it('returns 400 for an invalid url without checking the rate limiter first', async () => {
    const { checkGenerateLimit } = await import('@/lib/repo-audit/rateLimit');
    vi.mocked(checkGenerateLimit).mockClear();

    const { POST } = await import('./route');
    const res = await POST(post({ url: 'not a repo url' }));

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.kind).toBe('bad_url');
    expect(checkGenerateLimit).not.toHaveBeenCalled();
  });
});

describe('POST /api/generate, no README', () => {
  it('uses the placeholder summary and never calls the model', async () => {
    vi.resetModules();
    vi.doMock('@/lib/repo-audit/rateLimit', () => ({
      checkGenerateLimit: vi.fn().mockResolvedValue({ ok: true }),
    }));
    vi.doMock('@/lib/repo-audit/github', async () => {
      const actual =
        await vi.importActual<typeof import('@/lib/repo-audit/github')>('@/lib/repo-audit/github');
      return {
        ...actual,
        fetchRepoFiles: vi.fn().mockResolvedValue({
          owner: 'vercel',
          repo: 'next.js',
          readme: null,
          packageDescription: null,
          filePaths: [],
        }),
      };
    });
    const callModelMock = vi.fn().mockResolvedValue('An invented product summary.');
    vi.doMock('@/lib/repo-audit/provider', async () => {
      const actual = await vi.importActual<typeof import('@/lib/repo-audit/provider')>(
        '@/lib/repo-audit/provider'
      );
      return {
        ...actual,
        callModel: callModelMock,
      };
    });

    const { POST } = await import('./route');
    const res = await POST(post({ url: 'vercel/next.js' }));

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.file).toContain(`> ${PLACEHOLDER}`);
    expect(callModelMock).not.toHaveBeenCalled();

    vi.resetModules();
  });
});
