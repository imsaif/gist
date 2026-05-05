import { loadResult } from '@/lib/gallery/loadResults';
import { renderDraftMarkdown } from '@/lib/gallery/renderDraftMarkdown';

export const dynamic = 'force-static';

export function generateStaticParams() {
  // Fall back to dynamic; static generation handled by parent route.
  return [];
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = loadResult(slug);
  if (!entry) {
    return new Response('not found', { status: 404 });
  }
  const md = renderDraftMarkdown(entry.draftFile, entry.name);
  return new Response(md, {
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
