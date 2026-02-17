import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { LLMProvider, LLMResponse } from '@/types/audit';

// ============================================
// Provider Clients
// ============================================

function getOpenAIClient(): OpenAI {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function getAnthropicClient(): Anthropic {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

function getPerplexityClient(): OpenAI {
  return new OpenAI({
    apiKey: process.env.PERPLEXITY_API_KEY,
    baseURL: 'https://api.perplexity.ai',
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
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2048,
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
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2048,
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

export async function queryPerplexity(prompt: string): Promise<LLMResponse> {
  const start = Date.now();
  try {
    const client = getPerplexityClient();
    const response = await client.chat.completions.create({
      model: 'sonar',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2048,
    });
    return {
      model: 'perplexity',
      content: response.choices[0]?.message?.content || '',
      durationMs: Date.now() - start,
    };
  } catch (err) {
    return {
      model: 'perplexity',
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
- Task management with assignments and deadlines
- Team messaging and collaboration
- Dashboard and reporting
- Integration with popular tools like Slack and GitHub

The product seems similar to Asana or Trello, offering a modern interface for project tracking. It likely uses AI to help automate some workflows and provide insights.

Pricing is probably freemium with paid tiers for advanced features.`,

    claude: `Based on the website content, this appears to be a productivity and project management solution. The product offers a workspace for teams to coordinate their efforts.

Core capabilities seem to include:
- Task organization and tracking
- Real-time collaboration features
- Automated workflows
- Reporting and analytics

The tool appears to target professional teams who need to coordinate complex projects. It differentiates itself through its approach to automation, though the specific technical implementation isn't entirely clear from the website alone.

I should note that some aspects of how the product works aren't fully documented on the site, so I'm inferring some details from context.`,

    perplexity: `This is a project management and team collaboration platform. According to the website, it provides tools for managing tasks, communicating with team members, and tracking project progress.

The platform features:
- Kanban boards and list views for task management
- Built-in chat and commenting
- Automated status updates
- Time tracking and reporting
- Integration with third-party services

It's positioned as a competitor to tools like Monday.com and ClickUp. The product appears to be available in free and paid versions.

The AI features mentioned on the site seem to focus on automating repetitive tasks and providing smart suggestions, similar to what other project management tools offer.`,
  };

  return {
    model: provider,
    content: mockResponses[provider],
    durationMs: provider === 'chatgpt' ? 2100 : provider === 'claude' ? 3400 : 5200,
  };
}
