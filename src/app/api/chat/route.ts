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
  const lastMessage = userMessages[userMessages.length - 1]?.content.toLowerCase() || '';

  // Check for AI-related keywords to trigger pattern identification
  const isAIRelated =
    lastMessage.includes('ai') ||
    lastMessage.includes('suggest') ||
    lastMessage.includes('recommend') ||
    lastMessage.includes('automat');

  if (messageCount === 1) {
    // If first message is AI-related, identify pattern immediately
    if (isAIRelated) {
      return `Interesting — an AI feature for email suggestions. That's a space where trust matters a lot. One thing to think about early: should the AI send emails automatically, or should users review and approve each suggestion first?

This sounds like a classic Human-in-the-Loop situation — where users stay in control of what gets sent.

<pattern_identified>
{
  "patternId": "human-in-the-loop",
  "reason": "Users should review and approve AI-suggested emails before sending"
}
</pattern_identified>

<brief_update>
{
  "goal": "${userMessages[0].content.slice(0, 100)}",
  "context": ["AI-powered feature", "Trust and control are important"],
  "decisions": null,
  "openQuestions": ["Should AI send automatically or require approval?"],
  "patterns": ["human-in-the-loop"],
  "successCriteria": null,
  "readyToDesign": null
}
</brief_update>`;
    }

    return `Interesting — so you're looking to design something around "${userMessages[0].content.slice(0, 50)}". Before we dive in, what's prompting this? Is this solving a problem you're seeing, or is it a new initiative?

<brief_update>
{
  "goal": "${userMessages[0].content.slice(0, 100)}",
  "context": null,
  "decisions": null,
  "openQuestions": null,
  "patterns": null,
  "successCriteria": null,
  "readyToDesign": null
}
</brief_update>`;
  }

  if (messageCount === 2) {
    // If AI-related, identify a pattern
    if (isAIRelated) {
      return `Got it — so there's an AI component here. That raises some important questions: how much control should users have over what the AI does? Will they need to approve suggestions before they're applied, or should it be more automatic?

This sounds like a case where Human-in-the-Loop could be valuable — letting users review and approve AI actions before they take effect.

<pattern_identified>
{
  "patternId": "human-in-the-loop",
  "reason": "Users should approve AI suggestions before they're applied"
}
</pattern_identified>

<brief_update>
{
  "goal": null,
  "context": ["AI-powered feature", "User control is important"],
  "decisions": null,
  "openQuestions": ["How much autonomy should the AI have?", "What's the cost of AI making a mistake?"],
  "patterns": ["human-in-the-loop"],
  "successCriteria": null,
  "readyToDesign": null
}
</brief_update>`;
    }

    return `Got it. That helps frame things. Who's the primary user here — is this for internal team members, external customers, or both? And what does their typical day look like when they'd be using this?

<brief_update>
{
  "goal": null,
  "context": ["Problem-driven initiative", "Addressing existing pain points"],
  "decisions": null,
  "openQuestions": ["Who is the primary user?", "What's the user's typical workflow?"],
  "patterns": null,
  "successCriteria": null,
  "readyToDesign": null
}
</brief_update>`;
  }

  if (messageCount === 3) {
    return `That's helpful context. One thing worth considering: if users are new to this, you might want to think about Progressive Disclosure — starting with the basics and revealing more advanced options as they get comfortable.

What's your timeline looking like? And are there existing design patterns you need to follow?

<pattern_identified>
{
  "patternId": "progressive-disclosure",
  "reason": "New users shouldn't be overwhelmed with all options at once"
}
</pattern_identified>

<brief_update>
{
  "goal": null,
  "context": ["Users may be unfamiliar with the feature"],
  "decisions": null,
  "openQuestions": ["Timeline constraints?", "Existing design system?"],
  "patterns": ["progressive-disclosure"],
  "successCriteria": null,
  "readyToDesign": null
}
</brief_update>`;
  }

  if (messageCount === 4) {
    return `Alright, I think we're getting somewhere. Based on what you've told me, it sounds like the key decision is around complexity — do you start simple and iterate, or try to solve more upfront? In my experience, starting minimal usually wins.

What does success look like for this? How will you know if it's working?

<brief_update>
{
  "goal": null,
  "context": null,
  "decisions": [{"decision": "Start with MVP scope", "rationale": "Faster validation, less wasted effort if assumptions are wrong"}],
  "openQuestions": null,
  "patterns": null,
  "successCriteria": null,
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
  "patterns": null,
  "successCriteria": ["Users can complete primary task within 2 minutes", "Error rate below 5%", "Positive user feedback in first week"],
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

    const assistantMessage = response.content[0].type === 'text' ? response.content[0].text : '';

    return Response.json({
      message: assistantMessage,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json({ error: 'Failed to get response from AI' }, { status: 500 });
  }
}
