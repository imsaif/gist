import * as cheerio from 'cheerio';
import { FetchedContent } from '@/types/audit';

const MAX_CONTENT_LENGTH = 50000;
const FETCH_TIMEOUT = 10000;

export async function fetchSiteContent(url: string): Promise<FetchedContent> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GistDesignBot/1.0; +https://gist.design)',
        Accept: 'text/html,application/xhtml+xml',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
      throw new Error(`Expected HTML content, got ${contentType}`);
    }

    const html = await response.text();
    return parseHTML(url, html);
  } finally {
    clearTimeout(timeout);
  }
}

function parseHTML(url: string, html: string): FetchedContent {
  const $ = cheerio.load(html);

  // Remove non-content elements
  $('script, style, nav, footer, iframe, noscript, svg, header').remove();
  $('[role="navigation"], [role="banner"], [role="contentinfo"]').remove();
  $('[aria-hidden="true"]').remove();

  // Extract metadata
  const title = $('title').text().trim() || $('h1').first().text().trim() || '';
  const metaDescription =
    $('meta[name="description"]').attr('content')?.trim() ||
    $('meta[property="og:description"]').attr('content')?.trim() ||
    '';

  // Extract main content, preferring main/article elements
  let content = '';
  const mainEl = $('main, article, [role="main"]').first();
  if (mainEl.length) {
    content = mainEl.text();
  } else {
    content = $('body').text();
  }

  // Clean up whitespace
  content = content
    .replace(/\s+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Truncate
  if (content.length > MAX_CONTENT_LENGTH) {
    content = content.slice(0, MAX_CONTENT_LENGTH) + '\n[Content truncated]';
  }

  return {
    url,
    title,
    metaDescription,
    content,
    contentLength: content.length,
  };
}
