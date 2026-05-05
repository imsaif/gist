import Anthropic from '@anthropic-ai/sdk';
import { fetchSiteContent } from './fetcher';
import { queryOpenAI, queryClaude, getMockLLMResponse } from './providers';
import { buildAuditPrompt, buildAnalysisPrompt, getMockAnalysis } from './prompts';
import type { LLMResponse, GapAnalysis, FetchedContent, LLMProvider } from '@/types/audit';

export interface RunAuditOptions {
  url: string;
  name?: string;
  description?: string;
  mock?: boolean;
  onEvent?: (event: RunAuditEvent) => void;
}

export type RunAuditEvent =
  | { type: 'fetched'; url: string; contentLength: number }
  | { type: 'llm_response'; response: LLMResponse }
  | { type: 'analysis'; analysis: GapAnalysis };

export interface RunAuditResult {
  url: string;
  siteContent: FetchedContent;
  responses: Partial<Record<LLMProvider, LLMResponse>>;
  analysis: GapAnalysis;
}

/**
 * Pure (non-streaming) audit runner. Callers can pass `onEvent` to receive
 * progress callbacks; the SSE route adapts these into server-sent events,
 * the cron job ignores them.
 */
export async function runAudit(opts: RunAuditOptions): Promise<RunAuditResult> {
  const { url, name, description, mock = false, onEvent } = opts;
  const productContext = name || description ? { name, description } : undefined;

  const siteContent: FetchedContent = mock
    ? {
        url,
        title: 'Mock Product',
        metaDescription: 'A mock product for testing',
        content:
          'This is a mock product website. It helps teams manage projects and collaborate effectively.',
        contentLength: 150,
      }
    : await fetchSiteContent(url);

  onEvent?.({ type: 'fetched', url: siteContent.url, contentLength: siteContent.contentLength });

  const prompt = buildAuditPrompt(url, siteContent.content, productContext);
  const responses: Partial<Record<LLMProvider, LLMResponse>> = {};

  if (mock) {
    const providers: LLMProvider[] = ['chatgpt', 'claude'];
    for (const provider of providers) {
      const r = getMockLLMResponse(provider);
      responses[provider] = r;
      onEvent?.({ type: 'llm_response', response: r });
    }
  } else {
    await Promise.all([
      queryOpenAI(prompt).then((r) => {
        responses.chatgpt = r;
        onEvent?.({ type: 'llm_response', response: r });
      }),
      queryClaude(prompt).then((r) => {
        responses.claude = r;
        onEvent?.({ type: 'llm_response', response: r });
      }),
    ]);
  }

  let analysis: GapAnalysis;
  if (mock) {
    analysis = getMockAnalysis();
  } else {
    const chatgptContent = responses.chatgpt?.error
      ? `[ChatGPT error: ${responses.chatgpt.error} — exclude this model from analysis]`
      : responses.chatgpt?.content || '[ChatGPT: not queried]';
    const claudeContent = responses.claude?.error
      ? `[Claude error: ${responses.claude.error} — exclude this model from analysis]`
      : responses.claude?.content || '[Claude: not queried]';

    const analysisPrompt = buildAnalysisPrompt(
      siteContent.content,
      chatgptContent,
      claudeContent,
      productContext
    );
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const res = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{ role: 'user', content: analysisPrompt }],
    });
    const text = res.content[0].type === 'text' ? res.content[0].text : '';
    try {
      analysis = JSON.parse(text) as GapAnalysis;
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Failed to parse analysis response as JSON');
      analysis = JSON.parse(jsonMatch[0]) as GapAnalysis;
    }
  }

  onEvent?.({ type: 'analysis', analysis });

  return { url: siteContent.url, siteContent, responses, analysis };
}
