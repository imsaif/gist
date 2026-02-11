import Anthropic from '@anthropic-ai/sdk';
import { getCreateSystemPrompt, buildContextBlock } from '@/lib/createPrompt';
import { GistDesignFile } from '@/types/file';
import { Message } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Mock responses for Create skill
function getCreateMockResponse(messages: Message[]): string {
  const userMessages = messages.filter((m) => m.role === 'user');
  const messageCount = userMessages.length;

  if (messageCount === 1) {
    return `Got it. So you're building a product around that. Before we dive into features — who is this for? Who's the primary user, and what's their biggest pain point right now?

<file_update>
{
  "product": {
    "name": "${userMessages[0].content.slice(0, 40)}",
    "description": "${userMessages[0].content.slice(0, 100)}"
  }
}
</file_update>`;
  }

  if (messageCount === 2) {
    return `That's a clear audience. Now let's talk about how AI fits into this. Is AI the core of the product, or is it assisting a primarily human workflow? Most products try to do both and end up confusing users.

<file_update>
{
  "product": {
    "audience": "${userMessages[1].content.slice(0, 80)}"
  }
}
</file_update>`;
  }

  if (messageCount === 3) {
    return `Good — that's a clear AI approach. Let's nail down positioning before we jump into features. What category does this fall into? And how would you describe who this is for vs. who it's definitely NOT for?

<file_update>
{
  "product": {
    "aiApproach": "${userMessages[2].content.slice(0, 80)}"
  }
}
</file_update>`;
  }

  if (messageCount === 4) {
    return `Sharp positioning. Now some quick context — what's the pricing model, any key integrations, and what stage is the product at?

<file_update>
{
  "positioning": {
    "category": "AI-powered productivity tool",
    "forWho": "${userMessages[3].content.slice(0, 80)}",
    "notForWho": "Enterprise teams needing full project management",
    "addComparisons": [
      {
        "id": "comp-1",
        "vs": "Generic AI assistants",
        "difference": "Purpose-built for this specific workflow, not a general chatbot"
      }
    ]
  }
}
</file_update>`;
  }

  if (messageCount === 5) {
    return `Good context. Now let's start with your first feature. What's the one thing users do most often? Walk me through what happens when they use it — and what's the core anxiety they feel while using it?

<file_update>
{
  "context": {
    "pricing": "Freemium with pro tier",
    "integratesWith": ["${userMessages[4].content.slice(0, 40)}"],
    "requires": ["Modern browser"],
    "stage": "Beta"
  }
}
</file_update>`;
  }

  if (messageCount === 6) {
    return `Okay, let's capture that as your first feature. What is this feature NOT trying to do? This is critical — if an AI coding tool read your codebase tomorrow, what would it get wrong about this feature?

<file_update>
{
  "featureId": "core-feature",
  "featureName": "Core Feature",
  "intent": {
    "goal": "${userMessages[5].content.slice(0, 100)}",
    "coreAnxiety": "Users worry the AI will produce something they can't control or fix"
  },
  "interactionModel": {
    "primaryFlow": ["User opens the feature", "User provides input", "System processes and responds", "User reviews output"]
  }
}
</file_update>`;
  }

  if (messageCount === 7) {
    return `That's exactly the kind of guidance AI tools need. Now — what happens when things go wrong? What if the input is bad, or the AI response is off, or the network drops? Walk me through the error cases.

<file_update>
{
  "featureId": "core-feature",
  "intent": {
    "notTryingTo": ["${userMessages[6].content.slice(0, 80)}"]
  },
  "notThis": ["Don't auto-execute actions without user confirmation", "Don't show raw AI output — always format for readability"]
}
</file_update>

<before_after_update>
{
  "items": [
    {
      "id": "ba-1",
      "featureId": "core-feature",
      "without": "AI tool assumes every action should auto-execute",
      "with": "gist.design says: require user confirmation before executing actions",
      "source": "not-this"
    }
  ]
}
</before_after_update>`;
  }

  if (messageCount === 8) {
    return `Good error handling thinking. Let me identify a pattern here — this sounds like a classic Human-in-the-Loop setup where users stay in control of AI actions.

Let's capture a design decision: you chose to keep the user in control over letting AI auto-execute. What was the main reason?

<file_update>
{
  "featureId": "core-feature",
  "interactionModel": {
    "errorHandling": ["Show clear error message with retry option", "Fallback to manual input if AI fails", "Never lose user's work on error"],
    "keyInteractions": ["User reviews AI output before accepting", "One-click retry on failure"]
  }
}
</file_update>

<pattern_identified>
{
  "patternId": "human-in-the-loop",
  "reason": "Users review and approve AI actions before they take effect"
}
</pattern_identified>`;
  }

  if (messageCount === 9) {
    return `That's a strong decision. Let me capture it. Your first feature is looking solid — we've got intent, interaction model, error handling, and a key design decision.

Any constraints on this feature? Technical limits, performance budgets, accessibility requirements?

<file_update>
{
  "featureId": "core-feature",
  "addDesignDecisions": [
    {
      "id": "dd-1",
      "chose": "Human-in-the-loop approval for all AI actions",
      "over": "Auto-executing AI suggestions",
      "because": "Trust is earned through control — users need to verify AI accuracy before relying on it"
    }
  ],
  "addPatterns": [
    {
      "id": "p-1",
      "patternId": "human-in-the-loop",
      "patternName": "Human in the Loop",
      "usage": "Users review and can edit AI output before it takes effect"
    }
  ]
}
</file_update>

<before_after_update>
{
  "items": [
    {
      "id": "ba-2",
      "featureId": "core-feature",
      "without": "AI tool builds auto-accept for AI suggestions",
      "with": "gist.design says: chose approval flow over auto-execute because trust is earned",
      "source": "design-decision"
    }
  ]
}
</before_after_update>`;
  }

  if (messageCount >= 10) {
    return `Your gist.design file is taking shape. We've covered the core feature with intent, interaction model, design decisions, and patterns.

Want to add another feature, or are you ready to export what we have? You can always come back and add more later.

<file_update>
{
  "featureId": "core-feature",
  "addConstraints": [
    {
      "id": "c-1",
      "constraint": "Response time under 3 seconds",
      "designResponse": "Show loading state with progress indication, allow cancellation"
    }
  ],
  "openQuestions": ["How should we handle edge cases with very long inputs?", "What's the fallback if the AI service is completely unavailable?"]
}
</file_update>`;
  }

  return '';
}

export async function POST(request: Request) {
  try {
    const { messages, fileState, currentFeatureId } = await request.json();

    // Use mock mode if enabled
    if (process.env.MOCK_MODE === 'true') {
      // Simulate a small delay like a real API
      await new Promise((resolve) => setTimeout(resolve, 800));
      return Response.json({
        message: getCreateMockResponse(messages),
      });
    }

    // Convert messages to Claude format
    const claudeMessages = messages.map((msg: Message) => ({
      role: msg.role,
      content: msg.content,
    }));

    let systemPrompt = getCreateSystemPrompt();

    // Inject file state context
    if (fileState) {
      const contextBlock = buildContextBlock(fileState as GistDesignFile, currentFeatureId || null);
      systemPrompt += `\n\n${contextBlock}`;
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
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
