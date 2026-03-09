import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchSiteContent } from './fetcher';

// Mock cheerio at module level — fetchSiteContent uses it internally
vi.mock('cheerio', async () => {
  const actual = await vi.importActual<typeof import('cheerio')>('cheerio');
  return actual;
});

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

beforeEach(() => {
  vi.clearAllMocks();
});

function htmlResponse(html: string, contentType = 'text/html; charset=utf-8', status = 200) {
  return {
    ok: status === 200,
    status,
    statusText: status === 200 ? 'OK' : 'Not Found',
    headers: new Headers({ 'content-type': contentType }),
    text: () => Promise.resolve(html),
  };
}

describe('fetchSiteContent', () => {
  it('extracts title and meta description', async () => {
    const html = `
      <html>
        <head>
          <title>My Product</title>
          <meta name="description" content="The best product ever" />
        </head>
        <body><main><p>Hello world</p></main></body>
      </html>
    `;
    mockFetch.mockResolvedValueOnce(htmlResponse(html));
    const result = await fetchSiteContent('https://example.com');
    expect(result.title).toBe('My Product');
    expect(result.metaDescription).toBe('The best product ever');
    expect(result.url).toBe('https://example.com');
  });

  it('falls back to og:description when meta description is missing', async () => {
    const html = `
      <html>
        <head>
          <title>Test</title>
          <meta property="og:description" content="OG description" />
        </head>
        <body><p>Content</p></body>
      </html>
    `;
    mockFetch.mockResolvedValueOnce(htmlResponse(html));
    const result = await fetchSiteContent('https://example.com');
    expect(result.metaDescription).toBe('OG description');
  });

  it('falls back to h1 when title tag is missing', async () => {
    const html = '<html><body><h1>Heading Title</h1><p>Content</p></body></html>';
    mockFetch.mockResolvedValueOnce(htmlResponse(html));
    const result = await fetchSiteContent('https://example.com');
    expect(result.title).toBe('Heading Title');
  });

  it('prefers main/article content over full body', async () => {
    const html = `
      <html><body>
        <nav>Navigation stuff</nav>
        <main><p>Main content here</p></main>
        <footer>Footer stuff</footer>
      </body></html>
    `;
    mockFetch.mockResolvedValueOnce(htmlResponse(html));
    const result = await fetchSiteContent('https://example.com');
    expect(result.content).toContain('Main content here');
    expect(result.content).not.toContain('Navigation stuff');
    expect(result.content).not.toContain('Footer stuff');
  });

  it('falls back to body when no main/article element', async () => {
    const html = '<html><body><div>Body content</div></body></html>';
    mockFetch.mockResolvedValueOnce(htmlResponse(html));
    const result = await fetchSiteContent('https://example.com');
    expect(result.content).toContain('Body content');
  });

  it('removes script and style tags from content', async () => {
    const html = `
      <html><body>
        <script>var x = 1;</script>
        <style>.red { color: red; }</style>
        <main><p>Real content</p></main>
      </body></html>
    `;
    mockFetch.mockResolvedValueOnce(htmlResponse(html));
    const result = await fetchSiteContent('https://example.com');
    expect(result.content).toContain('Real content');
    expect(result.content).not.toContain('var x = 1');
    expect(result.content).not.toContain('.red');
  });

  it('keeps nav and header content (not stripped)', async () => {
    const html = `
      <html><body>
        <nav>Search bar, filters here</nav>
        <header>Product logo and links</header>
        <p>Main body</p>
      </body></html>
    `;
    mockFetch.mockResolvedValueOnce(htmlResponse(html));
    const result = await fetchSiteContent('https://example.com');
    expect(result.content).toContain('Search bar');
    expect(result.content).toContain('Product logo');
  });

  it('truncates content at 50KB', async () => {
    const longContent = 'x'.repeat(60000);
    const html = `<html><body><main>${longContent}</main></body></html>`;
    mockFetch.mockResolvedValueOnce(htmlResponse(html));
    const result = await fetchSiteContent('https://example.com');
    expect(result.content.length).toBeLessThanOrEqual(50000 + 20); // +20 for [Content truncated]
    expect(result.content).toContain('[Content truncated]');
  });

  it('sets contentLength correctly', async () => {
    const html = '<html><body><main>Short content</main></body></html>';
    mockFetch.mockResolvedValueOnce(htmlResponse(html));
    const result = await fetchSiteContent('https://example.com');
    expect(result.contentLength).toBe(result.content.length);
  });

  it('normalizes whitespace', async () => {
    const html = '<html><body><main>  lots   of    spaces   </main></body></html>';
    mockFetch.mockResolvedValueOnce(htmlResponse(html));
    const result = await fetchSiteContent('https://example.com');
    expect(result.content).not.toMatch(/\s{2,}/);
  });

  it('throws on non-200 response', async () => {
    mockFetch.mockResolvedValueOnce(htmlResponse('', 'text/html', 404));
    await expect(fetchSiteContent('https://example.com')).rejects.toThrow('HTTP 404');
  });

  it('throws on non-HTML content type', async () => {
    mockFetch.mockResolvedValueOnce(htmlResponse('{}', 'application/json'));
    await expect(fetchSiteContent('https://example.com')).rejects.toThrow('Expected HTML content');
  });

  it('accepts application/xhtml content type', async () => {
    const html = '<html><body><main>XHTML content</main></body></html>';
    mockFetch.mockResolvedValueOnce(htmlResponse(html, 'application/xhtml+xml'));
    const result = await fetchSiteContent('https://example.com');
    expect(result.content).toContain('XHTML content');
  });

  it('sends correct user-agent header', async () => {
    const html = '<html><body>ok</body></html>';
    mockFetch.mockResolvedValueOnce(htmlResponse(html));
    await fetchSiteContent('https://example.com');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://example.com',
      expect.objectContaining({
        headers: expect.objectContaining({
          'User-Agent': expect.stringContaining('GistDesignBot'),
        }),
      })
    );
  });
});
