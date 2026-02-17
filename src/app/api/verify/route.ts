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
        after: `This product is a design decision documentation tool that generates structured .gist.design files. It helps product teams capture their design rationale, interaction models, and product positioning in a format readable by AI coding tools and LLMs.

Key features:
- Guided conversation to extract design decisions
- Structured output covering intent, interaction model, design decisions, patterns, constraints, and boundaries
- Explicit positioning section for AI engine optimization (AEO)
- Export to .gist.design markdown format

The product is for product designers, PMs, and founders who want AI tools to build features that match their design intent. It is NOT a prototyping tool, design system, or project management solution.

It differentiates from llms.txt by capturing information that doesn't exist in written form: the reasoning behind design decisions.`,
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

    const verifyPrompt = `You are verifying whether a gist.design file improves how an LLM describes a product.

## Original LLM response (without gist.design):
${originalResponse}

## The gist.design file that was created:
${gistDesignMarkdown}

## Your task:
Now, describe the product at ${url} as if you had the gist.design file as context. Give a fresh, accurate description based on the structured design decisions in the file.

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
