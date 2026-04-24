import { NextRequest } from 'next/server';
import { runAudit, type RunAuditEvent } from '@/lib/audit/runAudit';
import { checkAuditRateLimit } from '@/lib/rateLimit';

export const maxDuration = 60;

function sseMessage(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

function eventToSse(e: RunAuditEvent): string {
  switch (e.type) {
    case 'fetched':
      return sseMessage('fetched', { url: e.url, contentLength: e.contentLength });
    case 'llm_response':
      return sseMessage('llm_response', e.response);
    case 'analysis':
      return sseMessage('analysis', e.analysis);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return Response.json({ error: 'URL is required' }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error('Invalid protocol');
    } catch {
      return Response.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rateLimit = checkAuditRateLimit(ip);
    if (!rateLimit.allowed) {
      return Response.json(
        {
          error: `Rate limit exceeded. Try again in ${Math.ceil(rateLimit.retryAfterSeconds / 60)} minutes.`,
          retryAfterSeconds: rateLimit.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    const mock = process.env.MOCK_MODE === 'true';
    const normalizedUrl = parsedUrl.toString();

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          await runAudit({
            url: normalizedUrl,
            mock,
            onEvent: (e) => controller.enqueue(encoder.encode(eventToSse(e))),
          });
          controller.enqueue(encoder.encode(sseMessage('done', {})));
        } catch (err) {
          controller.enqueue(
            encoder.encode(
              sseMessage('error', {
                message: err instanceof Error ? err.message : 'An unexpected error occurred',
              })
            )
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Audit API error:', error);
    return Response.json({ error: 'Failed to start audit' }, { status: 500 });
  }
}
