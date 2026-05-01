import Anthropic from '@anthropic-ai/sdk';
import { VerificationResult } from '@/types/audit';

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { url, gistDesignMarkdown, originalResponse } = await request.json();

    if (!url || !gistDesignMarkdown || !originalResponse) {
      return Response.json(
        { error: 'url, gistDesignMarkdown, and originalResponse are required' },
        { status: 400 }
      );
    }

    if (process.env.MOCK_MODE === 'true') {
      await new Promise((r) => setTimeout(r, 2000));
      const mockResult: VerificationResult = {
        before: originalResponse,
        after: `This product audits how AI tools describe your product and outputs a .gist file — structured product context that LLMs read so they stop guessing or fabricating.

Key features:
- Audit ChatGPT and Claude to surface fabrications, category drift, and audience mismatches
- Generate a .gist file capturing positioning, audience, "not for", and before/after corrections
- Re-run anytime when you ship features or change positioning
- Open standard — drop in your repo, paste into ChatGPT, point Cursor or Claude Code at it

The product is for founders, PMs, and engineering teams who want AI tools to describe their product accurately instead of inventing features it doesn't have.

It complements llms.txt: llms.txt tells LLMs what exists, .gist tells them how to talk about it.`,
        fixedGaps: [
          'Product category correctly identified',
          'No competitor blending detected',
          'Core mechanics accurately described',
          'Target audience correctly specified',
        ],
        remainingGaps: ['Pricing details still inferred rather than stated'],
      };
      return Response.json(mockResult);
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const verifyPrompt = `You are verifying whether a .gist file improves how an LLM describes a product.

## Original LLM response (without .gist):
${originalResponse}

## The .gist file that was created:
${gistDesignMarkdown}

## Your task:
Now, describe the product at ${url} as if you had the .gist file as context. Give a fresh, accurate description based on the structured design decisions in the file.

Then analyze what improved and what gaps remain.

Respond with ONLY valid JSON (no markdown, no code fences):
{
  "before": "<the original response>",
  "after": "<your improved description>",
  "fixedGaps": ["<specific improvement 1>", "<specific improvement 2>"],
  "remainingGaps": ["<any remaining gap>"]
}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      messages: [{ role: 'user', content: verifyPrompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';

    let result: VerificationResult;
    try {
      result = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse verification response');
      }
    }

    return Response.json(result);
  } catch (error) {
    console.error('Verify API error:', error);
    return Response.json({ error: 'Failed to verify' }, { status: 500 });
  }
}
