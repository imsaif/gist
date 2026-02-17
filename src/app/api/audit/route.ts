import { NextRequest } from 'next/server';
import { fetchSiteContent } from '@/lib/audit/fetcher';
import {
  queryOpenAI,
  queryClaude,
  queryPerplexity,
  getMockLLMResponse,
} from '@/lib/audit/providers';
import { buildAuditPrompt, buildAnalysisPrompt, getMockAnalysis } from '@/lib/audit/prompts';
import { checkRateLimit } from '@/lib/audit/rateLimit';
import { LLMResponse, GapAnalysis } from '@/types/audit';
import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 60;

function sseMessage(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return Response.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch {
      return Response.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return Response.json(
        {
          error: `Rate limit exceeded. Try again in ${Math.ceil(rateLimit.retryAfterSeconds / 60)} minutes.`,
          retryAfterSeconds: rateLimit.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    const isMock = process.env.MOCK_MODE === 'true';
    const normalizedUrl = parsedUrl.toString();

    // SSE stream
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const send = (event: string, data: unknown) => {
          controller.enqueue(encoder.encode(sseMessage(event, data)));
        };

        try {
          // Step 1: Fetch site content
          let siteContent: {
            url: string;
            title: string;
            metaDescription: string;
            content: string;
            contentLength: number;
          };

          if (isMock) {
            await new Promise((r) => setTimeout(r, 800));
            siteContent = {
              url: normalizedUrl,
              title: 'Mock Product',
              metaDescription: 'A mock product for testing',
              content:
                'This is a mock product website. It helps teams manage projects and collaborate effectively. Features include task management, team messaging, and workflow automation.',
              contentLength: 150,
            };
          } else {
            siteContent = await fetchSiteContent(normalizedUrl);
          }

          send('fetched', { url: siteContent.url, contentLength: siteContent.contentLength });

          // Step 2: Query all 3 LLMs in parallel
          const prompt = buildAuditPrompt(normalizedUrl, siteContent.content);
          const responses: Record<string, LLMResponse> = {};

          if (isMock) {
            // Staggered mock responses
            const providers = ['chatgpt', 'claude', 'perplexity'] as const;
            const delays = [2000, 4000, 6000];

            for (let i = 0; i < providers.length; i++) {
              await new Promise((r) => setTimeout(r, delays[i] - (i > 0 ? delays[i - 1] : 0)));
              const response = getMockLLMResponse(providers[i]);
              responses[providers[i]] = response;
              send('llm_response', response);
            }
          } else {
            // Fire all 3 in parallel, send each as it completes
            const queries = [
              queryOpenAI(prompt).then((r) => {
                responses.chatgpt = r;
                send('llm_response', r);
              }),
              queryClaude(prompt).then((r) => {
                responses.claude = r;
                send('llm_response', r);
              }),
              queryPerplexity(prompt).then((r) => {
                responses.perplexity = r;
                send('llm_response', r);
              }),
            ];

            await Promise.all(queries);
          }

          // Step 3: Run Claude analysis layer
          let analysis: GapAnalysis;

          if (isMock) {
            await new Promise((r) => setTimeout(r, 2000));
            analysis = getMockAnalysis();
          } else {
            const analysisPrompt = buildAnalysisPrompt(
              siteContent.content,
              responses.chatgpt?.content || '[Error: ChatGPT did not respond]',
              responses.claude?.content || '[Error: Claude did not respond]',
              responses.perplexity?.content || '[Error: Perplexity did not respond]'
            );

            const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
            const analysisResponse = await anthropic.messages.create({
              model: 'claude-sonnet-4-5-20250929',
              max_tokens: 4096,
              messages: [{ role: 'user', content: analysisPrompt }],
            });

            const analysisText =
              analysisResponse.content[0].type === 'text' ? analysisResponse.content[0].text : '';

            try {
              analysis = JSON.parse(analysisText) as GapAnalysis;
            } catch {
              // Try to extract JSON from the response
              const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                analysis = JSON.parse(jsonMatch[0]) as GapAnalysis;
              } else {
                throw new Error('Failed to parse analysis response as JSON');
              }
            }
          }

          send('analysis', analysis);
          send('done', {});
        } catch (err) {
          send('error', {
            message: err instanceof Error ? err.message : 'An unexpected error occurred',
          });
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
