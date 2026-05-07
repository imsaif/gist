import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchLlmsTxt,
  extractMarkdownLinks,
  filterSameDomainLinks,
  fetchLinkedPages,
  assembleAuditContent,
} from './llmsTxt';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

beforeEach(() => {
  vi.clearAllMocks();
});

function textResponse(body: string, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Not Found',
    text: () => Promise.resolve(body),
  };
}

describe('fetchLlmsTxt', () => {
  it('returns content when /llms.txt is a valid markdown file', async () => {
    const body =
      '# Stripe\n\n> Payments infrastructure for the internet.\n\n## Docs\n\n- [API](https://stripe.com/api): Endpoints\n- [Auth](https://stripe.com/auth): Keys\n';
    mockFetch.mockResolvedValueOnce(textResponse(body));
    const r = await fetchLlmsTxt('https://stripe.com');
    expect(r).not.toBeNull();
    expect(r!.url).toBe('https://stripe.com/llms.txt');
    expect(r!.content).toBe(body);
  });

  it('returns null on 404', async () => {
    mockFetch.mockResolvedValueOnce(textResponse('Not Found', 404));
    expect(await fetchLlmsTxt('https://example.com')).toBeNull();
  });

  it('returns null when body is too short to be a real llms.txt', async () => {
    mockFetch.mockResolvedValueOnce(textResponse('# x'));
    expect(await fetchLlmsTxt('https://example.com')).toBeNull();
  });

  it('returns null when body has no markdown heading (likely an HTML 404 page)', async () => {
    const body = '<!doctype html><html><body>page not found page not found</body></html>'.repeat(3);
    mockFetch.mockResolvedValueOnce(textResponse(body));
    expect(await fetchLlmsTxt('https://example.com')).toBeNull();
  });

  it('returns null on fetch error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network'));
    expect(await fetchLlmsTxt('https://example.com')).toBeNull();
  });
});

describe('extractMarkdownLinks', () => {
  it('extracts inline markdown links', () => {
    const md = '[API](https://stripe.com/api) and [Auth](https://stripe.com/auth)';
    expect(extractMarkdownLinks(md)).toEqual(['https://stripe.com/api', 'https://stripe.com/auth']);
  });

  it('extracts bare URLs', () => {
    const md = 'See https://example.com/foo for details.';
    expect(extractMarkdownLinks(md)).toContain('https://example.com/foo');
  });

  it('deduplicates', () => {
    const md = '[a](https://x.com/a) [b](https://x.com/a)';
    expect(extractMarkdownLinks(md)).toEqual(['https://x.com/a']);
  });

  it('strips trailing punctuation from bare URLs', () => {
    const md = 'check https://example.com/page, then continue.';
    expect(extractMarkdownLinks(md)).toContain('https://example.com/page');
  });

  it('returns empty array when no links present', () => {
    expect(extractMarkdownLinks('# Just a heading\n\nSome plain text.')).toEqual([]);
  });
});

describe('filterSameDomainLinks', () => {
  it('keeps same-domain links', () => {
    const links = ['https://stripe.com/api', 'https://docs.stripe.com/auth'];
    expect(filterSameDomainLinks(links, 'https://stripe.com')).toEqual(links);
  });

  it('drops off-domain links', () => {
    const links = ['https://stripe.com/api', 'https://github.com/stripe'];
    expect(filterSameDomainLinks(links, 'https://stripe.com')).toEqual(['https://stripe.com/api']);
  });

  it('treats www. as same domain', () => {
    expect(filterSameDomainLinks(['https://www.stripe.com/api'], 'https://stripe.com')).toEqual([
      'https://www.stripe.com/api',
    ]);
  });

  it('drops malformed URLs', () => {
    expect(
      filterSameDomainLinks(['not a url', 'https://stripe.com/ok'], 'https://stripe.com')
    ).toEqual(['https://stripe.com/ok']);
  });
});

describe('fetchLinkedPages', () => {
  it('fetches pages in parallel and returns successes', async () => {
    mockFetch
      .mockResolvedValueOnce(textResponse('page A content'))
      .mockResolvedValueOnce(textResponse('page B content'));
    const r = await fetchLinkedPages(['https://x.com/a', 'https://x.com/b']);
    expect(r).toHaveLength(2);
    expect(r[0].content).toBe('page A content');
  });

  it('drops failed fetches silently', async () => {
    mockFetch
      .mockResolvedValueOnce(textResponse('ok'))
      .mockResolvedValueOnce(textResponse('', 500));
    const r = await fetchLinkedPages(['https://x.com/a', 'https://x.com/b']);
    expect(r).toHaveLength(1);
  });

  it('caps at 5 pages', async () => {
    const links = Array.from({ length: 10 }, (_, i) => `https://x.com/p${i}`);
    mockFetch.mockResolvedValue(textResponse('content'));
    await fetchLinkedPages(links);
    expect(mockFetch).toHaveBeenCalledTimes(5);
  });
});

describe('assembleAuditContent', () => {
  it('concatenates llms.txt and linked pages with section headers', () => {
    const out = assembleAuditContent({ url: 'https://x.com/llms.txt', content: '# X' }, [
      { url: 'https://x.com/api', content: 'api docs' },
    ]);
    expect(out.text).toContain('=== https://x.com/llms.txt (llms.txt) ===');
    expect(out.text).toContain('# X');
    expect(out.text).toContain('=== https://x.com/api ===');
    expect(out.text).toContain('api docs');
    expect(out.pageCount).toBe(2);
  });

  it('caps total bytes at 30KB', () => {
    const big = 'x'.repeat(20_000);
    const out = assembleAuditContent({ url: 'https://x.com/llms.txt', content: big }, [
      { url: 'https://x.com/a', content: big },
      { url: 'https://x.com/b', content: big },
    ]);
    expect(out.bytes).toBeLessThanOrEqual(30_100);
    expect(out.text).toContain('[Content truncated]');
  });
});
