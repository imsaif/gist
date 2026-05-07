// llms.txt support for the audit pipeline.
//
// llms.txt is a markdown file at /llms.txt that gives AI tools a curated
// summary + table of contents for the site. When a site has one, the founder
// has already told us which pages matter — we follow those links rather than
// guessing at /pricing, /docs, etc.

const LLMS_TXT_TIMEOUT_MS = 8_000;
const LINKED_PAGE_TIMEOUT_MS = 5_000;
const MAX_LINKED_PAGES = 5;
const MAX_TOTAL_BYTES = 30_000;
const MAX_PER_PAGE_BYTES = 6_000;
const MIN_VALID_LLMS_TXT_BYTES = 100;

export interface LlmsTxtResult {
  url: string;
  content: string;
}

export interface LinkedPage {
  url: string;
  content: string;
}

export interface AssembledContent {
  text: string;
  bytes: number;
  pageCount: number;
}

/**
 * Fetch /llms.txt for the given site. Returns null if absent, empty, or
 * doesn't look like a real llms.txt (no markdown heading, too short).
 *
 * "Doesn't look like a real llms.txt" matters because some hosts return a
 * 200 with an empty body or an HTML 404 page — we don't want to treat
 * those as a valid file.
 */
export async function fetchLlmsTxt(siteUrl: string): Promise<LlmsTxtResult | null> {
  const target = new URL('/llms.txt', siteUrl).toString();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LLMS_TXT_TIMEOUT_MS);

  try {
    const res = await fetch(target, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GistBot/1.0; +https://llmsgist.org)',
        Accept: 'text/plain, text/markdown, */*',
      },
      redirect: 'follow',
    });

    if (!res.ok) return null;

    const body = await res.text();
    if (body.length < MIN_VALID_LLMS_TXT_BYTES) return null;
    if (!body.includes('#')) return null;

    return { url: target, content: body };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Extract all unique http(s) URLs from a markdown document. Captures both
 * inline link syntax `[text](https://...)` and bare URLs.
 */
export function extractMarkdownLinks(markdown: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  // Inline link syntax: [text](url)
  const inline = /\[[^\]]*\]\((https?:\/\/[^\s)]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = inline.exec(markdown)) !== null) {
    const url = m[1];
    if (!seen.has(url)) {
      seen.add(url);
      out.push(url);
    }
  }

  // Bare URLs (autolinks <url> or unwrapped)
  const bare = /(?<![("\[])(https?:\/\/[^\s<>")\]]+)/g;
  while ((m = bare.exec(markdown)) !== null) {
    const url = m[1].replace(/[.,;:)]+$/, '');
    if (!seen.has(url)) {
      seen.add(url);
      out.push(url);
    }
  }

  return out;
}

/**
 * Returns the registrable portion of a hostname (last two labels), so e.g.
 * docs.stripe.com and stripe.com both reduce to "stripe.com". Crude — does
 * not handle multi-label TLDs like .co.uk, but good enough to gate fetches
 * to the same brand.
 */
function registrableDomain(host: string): string {
  const parts = host.toLowerCase().split('.');
  if (parts.length <= 2) return parts.join('.');
  return parts.slice(-2).join('.');
}

/**
 * Filter URLs to those on the same registrable domain as the audited site.
 * Off-domain links (e.g. github.com from a docs page) are dropped to avoid
 * fan-out and to keep the audit focused on the founder's surface area.
 */
export function filterSameDomainLinks(links: string[], siteUrl: string): string[] {
  let baseHost: string;
  try {
    baseHost = registrableDomain(new URL(siteUrl).host);
  } catch {
    return [];
  }
  const out: string[] = [];
  for (const link of links) {
    try {
      const host = registrableDomain(new URL(link).host);
      if (host === baseHost) out.push(link);
    } catch {
      // skip malformed URLs
    }
  }
  return out;
}

async function fetchOne(url: string): Promise<LinkedPage | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LINKED_PAGE_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GistBot/1.0; +https://llmsgist.org)',
        Accept: 'text/plain, text/markdown, text/html, */*',
      },
      redirect: 'follow',
    });
    if (!res.ok) return null;
    const body = await res.text();
    const trimmed = body.length > MAX_PER_PAGE_BYTES ? body.slice(0, MAX_PER_PAGE_BYTES) : body;
    return { url, content: trimmed };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Fetch up to MAX_LINKED_PAGES pages in parallel. Failures (timeout, 404, etc.)
 * are silently dropped — a partial set of pages is fine.
 */
export async function fetchLinkedPages(links: string[]): Promise<LinkedPage[]> {
  const slice = links.slice(0, MAX_LINKED_PAGES);
  const results = await Promise.all(slice.map(fetchOne));
  return results.filter((r): r is LinkedPage => r !== null);
}

/**
 * Assemble the llms.txt + linked-page content into a single text blob with
 * section headers, capped at MAX_TOTAL_BYTES so the audit prompt stays bounded.
 */
export function assembleAuditContent(
  llmsTxt: LlmsTxtResult,
  linkedPages: LinkedPage[]
): AssembledContent {
  const parts: string[] = [];
  parts.push(`=== ${llmsTxt.url} (llms.txt) ===\n${llmsTxt.content}`);
  for (const page of linkedPages) {
    parts.push(`=== ${page.url} ===\n${page.content}`);
  }

  let text = parts.join('\n\n');
  let truncated = false;
  if (text.length > MAX_TOTAL_BYTES) {
    text = text.slice(0, MAX_TOTAL_BYTES);
    truncated = true;
  }
  if (truncated) text += '\n[Content truncated]';

  return {
    text,
    bytes: text.length,
    pageCount: 1 + linkedPages.length,
  };
}
