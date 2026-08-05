import { describe, it, expect, vi, afterEach } from 'vitest';
import { parseRepoUrl, fetchRepoFiles, GitHubError } from './github';

afterEach(() => vi.unstubAllGlobals());

describe('parseRepoUrl', () => {
  it('accepts a full https url', () => {
    expect(parseRepoUrl('https://github.com/vercel/next.js')).toEqual({
      owner: 'vercel',
      repo: 'next.js',
    });
  });

  it('accepts owner/repo shorthand', () => {
    expect(parseRepoUrl('vercel/next.js')).toEqual({ owner: 'vercel', repo: 'next.js' });
  });

  it('strips a trailing slash and .git', () => {
    expect(parseRepoUrl('https://github.com/a/b.git/')).toEqual({ owner: 'a', repo: 'b' });
  });

  it('rejects a non-github url', () => {
    expect(parseRepoUrl('https://gitlab.com/a/b')).toBeNull();
  });

  it('rejects nonsense', () => {
    expect(parseRepoUrl('not a url')).toBeNull();
  });

  it('rejects non-string input instead of throwing', () => {
    expect(parseRepoUrl(1)).toBeNull();
    expect(parseRepoUrl(true)).toBeNull();
    expect(parseRepoUrl({})).toBeNull();
    expect(parseRepoUrl([])).toBeNull();
    expect(parseRepoUrl(null)).toBeNull();
    expect(parseRepoUrl(undefined)).toBeNull();
  });
});

describe('fetchRepoFiles', () => {
  it('maps a 404 to not_found', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }));
    await expect(fetchRepoFiles('a', 'b')).rejects.toMatchObject({ kind: 'not_found' });
  });

  it('maps a 403 to rate_limited', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 403 }));
    await expect(fetchRepoFiles('a', 'b')).rejects.toMatchObject({ kind: 'rate_limited' });
  });

  it('maps a malformed tree response to network, not a raw SyntaxError', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string) => {
        if (url.includes('/readme'))
          return Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve('# hi') });
        if (url.includes('package.json')) return Promise.resolve({ ok: false, status: 404 });
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.reject(new SyntaxError('Unexpected end of JSON input')),
        });
      })
    );
    await expect(fetchRepoFiles('a', 'b')).rejects.toBeInstanceOf(GitHubError);
    await expect(fetchRepoFiles('a', 'b')).rejects.toMatchObject({ kind: 'network' });
  });

  it('tolerates a missing package.json', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string) => {
        if (url.includes('/readme'))
          return Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve('# hi') });
        if (url.includes('package.json')) return Promise.resolve({ ok: false, status: 404 });
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ tree: [{ path: 'a.ts', type: 'blob' }] }),
        });
      })
    );
    const files = await fetchRepoFiles('a', 'b');
    expect(files.readme).toBe('# hi');
    expect(files.packageDescription).toBeNull();
    expect(files.filePaths).toEqual(['a.ts']);
  });
});
