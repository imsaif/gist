import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/repo-audit/rateLimit', () => ({
  checkAuditLimit: vi.fn().mockResolvedValue({ ok: true }),
  checkAuditGlobalLimit: vi.fn().mockResolvedValue({ ok: true }),
}));

function post(body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest('http://localhost/api/audit', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json', ...headers },
  });
}

describe('POST /api/audit', () => {
  it('returns 400 with kind bad_url for an invalid url without checking the rate limiter first', async () => {
    const { checkAuditLimit, checkAuditGlobalLimit } = await import('@/lib/repo-audit/rateLimit');
    vi.mocked(checkAuditLimit).mockClear();
    vi.mocked(checkAuditGlobalLimit).mockClear();

    const { POST } = await import('./route');
    const res = await POST(post({ url: 'not a repo url' }));

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.kind).toBe('bad_url');
    expect(checkAuditLimit).not.toHaveBeenCalled();
    expect(checkAuditGlobalLimit).not.toHaveBeenCalled();
  });

  it('prefers x-vercel-forwarded-for over x-forwarded-for for the per-IP limit key', async () => {
    const { checkAuditLimit } = await import('@/lib/repo-audit/rateLimit');
    vi.mocked(checkAuditLimit).mockClear();
    vi.mocked(checkAuditLimit).mockResolvedValue({ ok: false, retryAfter: 5 });

    const { POST } = await import('./route');
    await POST(
      post(
        { url: 'vercel/next.js' },
        {
          'x-vercel-forwarded-for': '1.1.1.1',
          'x-forwarded-for': '9.9.9.9, 8.8.8.8',
        }
      )
    );

    expect(checkAuditLimit).toHaveBeenCalledWith('1.1.1.1');
    vi.mocked(checkAuditLimit).mockResolvedValue({ ok: true, retryAfter: 0 });
  });

  it('falls back to x-forwarded-for when platform headers are absent', async () => {
    const { checkAuditLimit } = await import('@/lib/repo-audit/rateLimit');
    vi.mocked(checkAuditLimit).mockClear();
    vi.mocked(checkAuditLimit).mockResolvedValue({ ok: false, retryAfter: 5 });

    const { POST } = await import('./route');
    await POST(post({ url: 'vercel/next.js' }, { 'x-forwarded-for': '9.9.9.9, 8.8.8.8' }));

    expect(checkAuditLimit).toHaveBeenCalledWith('9.9.9.9');
    vi.mocked(checkAuditLimit).mockResolvedValue({ ok: true, retryAfter: 0 });
  });
});
