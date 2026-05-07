import Anthropic from '@anthropic-ai/sdk';
import { queryOpenAI, queryClaude, getMockLLMResponse } from './providers';
import { buildAuditPrompt, buildAnalysisPrompt, getMockAnalysis } from './prompts';
import { deriveSummary } from './summary';
import { parseGapAnalysis, sanitizeErrorForPrompt } from './parse';
import {
  fetchLlmsTxt,
  extractMarkdownLinks,
  filterSameDomainLinks,
  fetchLinkedPages,
  assembleAuditContent,
} from './llmsTxt';
import type { LLMResponse, GapAnalysis, FetchedContent, LLMProvider } from '@/types/audit';

export interface RunAuditOptions {
  url: string;
  name?: string;
  description?: string;
  mock?: boolean;
  onEvent?: (event: RunAuditEvent) => void;
}

export type RunAuditEvent =
  | { type: 'no_llms_txt'; siteUrl: string; checkedUrl: string }
  | { type: 'llms_txt_found'; url: string; pageCount: number; bytes: number }
  | { type: 'fetched'; url: string; contentLength: number }
  | { type: 'llm_response'; response: LLMResponse }
  | { type: 'analysis'; analysis: GapAnalysis };

export interface RunAuditResult {
  url: string;
  // When the site has no /llms.txt we skip the audit and return early.
  // The frontend uses `verdict` to switch between the gap-list UI and the
  // "AI can't read your product" pitch.
  verdict: 'no_llms_txt' | 'audited';
  llmsTxtUrl?: string;
  siteContent?: FetchedContent;
  responses: Partial<Record<LLMProvider, LLMResponse>>;
  analysis?: GapAnalysis;
}

/**
 * Pure (non-streaming) audit runner. Callers can pass `onEvent` to receive
 * progress callbacks; the SSE route adapts these into server-sent events,
 * the cron job ignores them.
 */
export async function runAudit(opts: RunAuditOptions): Promise<RunAuditResult> {
  const { url, name, description, mock = false, onEvent } = opts;
  const productContext = name || description ? { name, description } : undefined;

  // Step 1: check /llms.txt. If absent, skip the LLM audit entirely and
  // surface the "no llms.txt" verdict — the product flow pitches the
  // .gist file based on this categorical fail rather than running a full
  // audit against pretraining knowledge.
  let llmsTxtUrl: string | undefined;
  let siteContent: FetchedContent;

  if (mock) {
    llmsTxtUrl = `${url}/llms.txt`;
    siteContent = {
      url,
      title: 'Mock Product',
      metaDescription: 'A mock product for testing',
      content:
        'This is a mock product website. It helps teams manage projects and collaborate effectively.',
      contentLength: 150,
    };
  } else {
    const llmsTxt = await fetchLlmsTxt(url);
    if (!llmsTxt) {
      const checkedUrl = new URL('/llms.txt', url).toString();
      onEvent?.({ type: 'no_llms_txt', siteUrl: url, checkedUrl });
      return { url, verdict: 'no_llms_txt', responses: {} };
    }

    llmsTxtUrl = llmsTxt.url;

    // Follow the curated links inside llms.txt. Same-domain only, capped to 5.
    const allLinks = extractMarkdownLinks(llmsTxt.content);
    const sameDomainLinks = filterSameDomainLinks(allLinks, url);
    const linkedPages = await fetchLinkedPages(sameDomainLinks);
    const assembled = assembleAuditContent(llmsTxt, linkedPages);

    onEvent?.({
      type: 'llms_txt_found',
      url: llmsTxt.url,
      pageCount: assembled.pageCount,
      bytes: assembled.bytes,
    });

    siteContent = {
      url,
      title: name || url,
      metaDescription: description || '',
      content: assembled.text,
      contentLength: assembled.bytes,
    };
  }

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
      ? `[ChatGPT error: ${sanitizeErrorForPrompt(responses.chatgpt.error)} — exclude this model from analysis]`
      : responses.chatgpt?.content || '[ChatGPT: not queried]';
    const claudeContent = responses.claude?.error
      ? `[Claude error: ${sanitizeErrorForPrompt(responses.claude.error)} — exclude this model from analysis]`
      : responses.claude?.content || '[Claude: not queried]';

    const analysisPrompt = buildAnalysisPrompt(
      siteContent.content,
      chatgptContent,
      claudeContent,
      productContext
    );
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      timeout: 30_000,
      maxRetries: 1,
    });
    const res = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      temperature: 0,
      messages: [{ role: 'user', content: analysisPrompt }],
    });
    const text = res.content[0].type === 'text' ? res.content[0].text : '';
    analysis = parseGapAnalysis(text);

    // Override the judge's self-reported summary with one derived from the gaps
    // it emitted. The judge is unreliable at counting and applying thresholds;
    // computing it here makes the same gap list always produce the same score.
    analysis.summary = deriveSummary(analysis.gaps, responses);
  }

  onEvent?.({ type: 'analysis', analysis });

  return {
    url: siteContent.url,
    verdict: 'audited',
    llmsTxtUrl,
    siteContent,
    responses,
    analysis,
  };
}
