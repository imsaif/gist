import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { LLMProvider, LLMResponse } from '@/types/audit';

// Pinned model snapshots — change deliberately so audit results stay reproducible
// across runs. The gallery JSON and the founder-facing /audit page should not
// shift when a provider rolls a new "latest" alias under us.
export const OPENAI_AUDIT_MODEL = 'gpt-4o-2024-11-20';
export const CLAUDE_AUDIT_MODEL = 'claude-sonnet-4-5-20250929';

// Temperature is pinned to 0 so the same URL produces the same answer twice.
// We are not asking the LLMs to be creative — we are asking them to describe
// a public product. Determinism > variety for this task.
const AUDIT_TEMPERATURE = 0;

// 30s per LLM call. Vercel maxDuration is 60s for /api/audit, and we run
// OpenAI + Claude in parallel, so a 30s ceiling on each leaves the judge
// (Haiku, ~3-5s) plenty of room before the route times out.
const LLM_TIMEOUT_MS = 30_000;

// One retry on transient errors (429, 5xx, network blips). The SDKs handle
// exponential backoff internally; we just bound how many times they try.
// A persistent failure should fail fast so the analyzer can mark the model
// as errored and the audit still completes with one model's output.
const LLM_MAX_RETRIES = 1;

// ============================================
// Provider Clients
// ============================================

function getOpenAIClient(): OpenAI {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: LLM_TIMEOUT_MS,
    maxRetries: LLM_MAX_RETRIES,
  });
}

function getAnthropicClient(): Anthropic {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    timeout: LLM_TIMEOUT_MS,
    maxRetries: LLM_MAX_RETRIES,
  });
}

// ============================================
// Provider Queries
// ============================================

export async function queryOpenAI(prompt: string): Promise<LLMResponse> {
  const start = Date.now();
  try {
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: OPENAI_AUDIT_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
      temperature: AUDIT_TEMPERATURE,
    });
    return {
      model: 'chatgpt',
      content: response.choices[0]?.message?.content || '',
      durationMs: Date.now() - start,
    };
  } catch (err) {
    return {
      model: 'chatgpt',
      content: '',
      durationMs: Date.now() - start,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

export async function queryClaude(prompt: string): Promise<LLMResponse> {
  const start = Date.now();
  try {
    const client = getAnthropicClient();
    const response = await client.messages.create({
      model: CLAUDE_AUDIT_MODEL,
      max_tokens: 1024,
      temperature: AUDIT_TEMPERATURE,
      messages: [{ role: 'user', content: prompt }],
    });
    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    return {
      model: 'claude',
      content: text,
      durationMs: Date.now() - start,
    };
  } catch (err) {
    return {
      model: 'claude',
      content: '',
      durationMs: Date.now() - start,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// ============================================
// Mock Responses
// ============================================

export function getMockLLMResponse(provider: LLMProvider): LLMResponse {
  const mockResponses: Record<LLMProvider, string> = {
    chatgpt: `This product appears to be a project management tool that helps teams organize their work. It likely offers features like task tracking, team collaboration, and workflow automation. The tool seems designed for small to medium businesses looking for a streamlined way to manage projects.

Key features probably include:
- Task management with Kanban boards
- Team collaboration and built-in chat
- Workflow automation
- Time tracking and reporting
- Integration with popular tools like Slack and GitHub

The product seems similar to Asana or Trello, offering a modern interface for project tracking.`,

    claude: `Based on the website content, this appears to be a productivity and project management solution. The product offers a workspace for teams to coordinate their efforts.

Core capabilities seem to include:
- Task organization and tracking
- Real-time collaboration features
- Automated workflows
- Reporting and analytics
- Cross-platform availability

The tool appears to target professional teams who need to coordinate complex projects. It differentiates itself through its approach to automation, though the specific technical implementation isn't entirely clear from the website alone.

I should note that some aspects of how the product works aren't fully documented on the site, so I'm inferring some details from context.`,
  };

  return {
    model: provider,
    content: mockResponses[provider],
    durationMs: provider === 'chatgpt' ? 2100 : 3400,
  };
}
