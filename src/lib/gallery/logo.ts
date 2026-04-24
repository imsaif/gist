import * as icons from 'simple-icons';

export interface ResolvedLogo {
  svg: string;
  hex: string;
  title: string;
  resolved: boolean;
}

const FALLBACK_SVG = `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="1.5"/><path d="M12 2 a 10 10 0 0 1 0 20 a 10 10 0 0 1 0 -20" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;

/**
 * Resolve a simple-icons slug (e.g. "linear", "notion") into an inline SVG +
 * brand hex. Pass null or an unresolved slug and you get a neutral globe
 * fallback with a gist brand hex.
 */
export function resolveLogo(slug: string | null): ResolvedLogo {
  if (!slug) return fallback();
  // simple-icons exports as `si<PascalCase>` — e.g. `siLinear`, `siTailwindcss`.
  const key = `si${slug.charAt(0).toUpperCase()}${slug.slice(1)}`;
  const icon = (icons as Record<string, unknown>)[key] as
    | { svg: string; hex: string; title: string }
    | undefined;
  if (!icon) return fallback();
  return { svg: icon.svg, hex: `#${icon.hex}`, title: icon.title, resolved: true };
}

function fallback(): ResolvedLogo {
  return { svg: FALLBACK_SVG, hex: '#64748B', title: '', resolved: false };
}

/**
 * Strips the <title> element simple-icons embeds — useful when we render the
 * logo purely decoratively and the surrounding heading already names the company.
 */
export function stripIconTitle(svg: string): string {
  return svg.replace(/<title>[^<]*<\/title>/, '');
}
