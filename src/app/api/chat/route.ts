import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from '@/lib/constants';
import { Message } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Mock responses for testing without API key
function getMockResponse(messages: Message[]): string {
  const userMessages = messages.filter((m) => m.role === 'user');
  const messageCount = userMessages.length;

  if (messageCount === 1) {
    const userMessage = userMessages[0].content.toLowerCase();
    return `Interesting — so you're looking to design something around "${userMessages[0].content.slice(0, 50)}". Before we dive in, what's prompting this? Is this solving a problem you're seeing, or is it a new initiative?

<brief_update>
{
  "goal": "${userMessages[0].content.slice(0, 100)}",
  "context": null,
  "decisions": null,
  "openQuestions": null,
  "readyToDesign": null
}
</brief_update>`;
  }

  if (messageCount === 2) {
    return `Got it. That helps frame things. Who's the primary user here — is this for internal team members, external customers, or both? And what does their typical day look like when they'd be using this?

<brief_update>
{
  "goal": null,
  "context": ["Problem-driven initiative", "Addressing existing pain points"],
  "decisions": null,
  "openQuestions": ["Who is the primary user?", "What's the user's typical workflow?"],
  "readyToDesign": null
}
</brief_update>`;
  }

  if (messageCount === 3) {
    return `That's helpful context. Now I'm curious about constraints. What's your timeline looking like? And are there existing design patterns or components you need to work within, or is this a blank slate?

<brief_update>
{
  "goal": null,
  "context": ["Users identified", "Use case becoming clearer"],
  "decisions": null,
  "openQuestions": ["Timeline constraints?", "Existing design system to follow?"],
  "readyToDesign": null
}
</brief_update>`;
  }

  if (messageCount === 4) {
    return `Alright, I think we're getting somewhere. Based on what you've told me, it sounds like the key decision is going to be around complexity — do you start simple and iterate, or try to solve more upfront? In my experience, starting minimal usually wins. What's your instinct?

<brief_update>
{
  "goal": null,
  "context": null,
  "decisions": [{"decision": "Start with MVP scope", "rationale": "Faster validation, less wasted effort if assumptions are wrong"}],
  "openQuestions": null,
  "readyToDesign": null
}
</brief_update>`;
  }

  // After 4+ messages, provide a "ready to design" response
  return `I think you've got enough clarity to start designing. Here's what we've established:

<brief_update>
{
  "goal": null,
  "context": null,
  "decisions": [{"decision": "Iterative approach", "rationale": "Build, test, learn, repeat"}],
  "openQuestions": null,
  "readyToDesign": {
    "prompt": "Design a focused solution that addresses the core user need. Start with the primary use case, keep the interface minimal, and plan for iteration based on user feedback.",
    "checklist": ["Core user flow is clear", "Primary use case addressed", "Scope is manageable", "Success criteria defined"]
  }
}
</brief_update>`;
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    // Use mock mode if enabled
    if (process.env.MOCK_MODE === 'true') {
      // Simulate a small delay like a real API
      await new Promise((resolve) => setTimeout(resolve, 800));
      return Response.json({
        message: getMockResponse(messages),
      });
    }

    // Convert messages to Claude format
    const claudeMessages = messages.map((msg: Message) => ({
      role: msg.role,
      content: msg.content,
    }));

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: claudeMessages,
    });

    const assistantMessage =
      response.content[0].type === 'text' ? response.content[0].text : '';

    return Response.json({
      message: assistantMessage,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: 'Failed to get response from AI' },
      { status: 500 }
    );
  }
}
