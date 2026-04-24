import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

export interface MentionSample {
  prompt: string;
  model: 'chatgpt' | 'claude';
  mentioned: boolean;
  excerpt?: string;
}

export interface MentionResult {
  rate: number; // 0..1 — share of (prompt, model) pairs that mentioned the product
  samples: MentionSample[];
}

interface RunMentionSampleOptions {
  productName: string;
  productUrl: string;
  prompts: string[];
  mock?: boolean;
}

let _openai: OpenAI | null = null;
let _anthropic: Anthropic | null = null;
const openai = () => (_openai ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY }));
const anthropic = () => (_anthropic ??= new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }));

/**
 * For each prompt, asks ChatGPT + Claude. Marks a sample as "mentioned" if
 * either the product name or the bare hostname from the product URL appears
 * in the response. Returns overall rate + per-sample detail.
 */
export async function runMentionSample(opts: RunMentionSampleOptions): Promise<MentionResult> {
  const { productName, productUrl, prompts, mock = false } = opts;
  if (prompts.length === 0) return { rate: 0, samples: [] };

  const host = safeHost(productUrl);
  const needles = [productName.toLowerCase(), host.toLowerCase()].filter(Boolean);

  if (mock) {
    const samples: MentionSample[] = prompts.flatMap((p) => [
      { prompt: p, model: 'chatgpt' as const, mentioned: Math.random() > 0.6 },
      { prompt: p, model: 'claude' as const, mentioned: Math.random() > 0.6 },
    ]);
    return { rate: samples.filter((s) => s.mentioned).length / samples.length, samples };
  }

  const tasks = prompts.flatMap((prompt) => [
    queryChatGPT(prompt).then<MentionSample>((text) => check(prompt, 'chatgpt', text, needles)),
    queryClaude(prompt).then<MentionSample>((text) => check(prompt, 'claude', text, needles)),
  ]);

  const settled = await Promise.allSettled(tasks);
  const samples: MentionSample[] = settled.flatMap((r) =>
    r.status === 'fulfilled' ? [r.value] : []
  );
  const mentionedCount = samples.filter((s) => s.mentioned).length;
  const rate = samples.length > 0 ? mentionedCount / samples.length : 0;
  return { rate, samples };
}

function safeHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function check(
  prompt: string,
  model: 'chatgpt' | 'claude',
  text: string,
  needles: string[]
): MentionSample {
  const lower = text.toLowerCase();
  const mentioned = needles.some((n) => n && lower.includes(n));
  return {
    prompt,
    model,
    mentioned,
    excerpt: mentioned ? text.slice(0, 280) : undefined,
  };
}

async function queryChatGPT(prompt: string): Promise<string> {
  const res = await openai().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 500,
  });
  return res.choices[0]?.message?.content ?? '';
}

async function queryClaude(prompt: string): Promise<string> {
  const res = await anthropic().messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }],
  });
  return res.content[0]?.type === 'text' ? res.content[0].text : '';
}
