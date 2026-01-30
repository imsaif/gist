import Anthropic from '@anthropic-ai/sdk';
import {
  getBriefSystemPrompt,
  getMapSystemPrompt,
  getRationaleSystemPrompt,
} from '@/lib/constants';
import { Message } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

type Mode = 'brief' | 'map' | 'rationale';

// Get system prompt based on mode
function getSystemPromptForMode(mode: Mode): string {
  switch (mode) {
    case 'map':
      return getMapSystemPrompt();
    case 'rationale':
      return getRationaleSystemPrompt();
    case 'brief':
    default:
      return getBriefSystemPrompt();
  }
}

// Mock responses for Brief mode
function getBriefMockResponse(messages: Message[]): string {
  const userMessages = messages.filter((m) => m.role === 'user');
  const messageCount = userMessages.length;
  const lastMessage = userMessages[userMessages.length - 1]?.content.toLowerCase() || '';

  const isAIRelated =
    lastMessage.includes('ai') ||
    lastMessage.includes('suggest') ||
    lastMessage.includes('recommend') ||
    lastMessage.includes('automat');

  if (messageCount === 1) {
    if (isAIRelated) {
      return `Interesting — an AI feature. That's a space where trust matters a lot. One thing to think about early: should the AI act automatically, or should users review and approve first?

This sounds like a classic Human-in-the-Loop situation — where users stay in control.

<pattern_identified>
{
  "patternId": "human-in-the-loop",
  "reason": "Users should review and approve AI actions before they take effect"
}
</pattern_identified>

<brief_update>
{
  "goal": "${userMessages[0].content.slice(0, 100)}",
  "context": ["AI-powered feature", "Trust and control are important"],
  "openQuestions": ["Should AI act automatically or require approval?"],
  "patterns": ["human-in-the-loop"]
}
</brief_update>`;
    }

    return `Interesting — so you're looking to design something around "${userMessages[0].content.slice(0, 50)}". Before we dive in, what's prompting this? Is this solving a problem you're seeing, or is it a new initiative?

<brief_update>
{
  "goal": "${userMessages[0].content.slice(0, 100)}"
}
</brief_update>`;
  }

  if (messageCount === 2) {
    return `Got it. That helps frame things. Who's the primary user here — is this for internal team members, external customers, or both?

<brief_update>
{
  "context": ["Problem-driven initiative", "Addressing existing pain points"],
  "openQuestions": ["Who is the primary user?", "What's the user's typical workflow?"]
}
</brief_update>`;
  }

  if (messageCount === 3) {
    return `That's helpful context. One thing worth considering: Progressive Disclosure — starting with the basics and revealing more advanced options as users get comfortable.

<pattern_identified>
{
  "patternId": "progressive-disclosure",
  "reason": "New users shouldn't be overwhelmed with all options at once"
}
</pattern_identified>

<brief_update>
{
  "context": ["Users may be unfamiliar with the feature"],
  "patterns": ["progressive-disclosure"]
}
</brief_update>`;
  }

  if (messageCount >= 4) {
    return `I think you've got enough clarity to start designing. Here's what we've established:

<brief_update>
{
  "decisions": [{"decision": "Start with MVP scope", "rationale": "Faster validation, less wasted effort"}],
  "successCriteria": ["Users can complete primary task", "Positive user feedback"],
  "readyToDesign": {
    "prompt": "Design a focused solution that addresses the core user need. Start with the primary use case, keep the interface minimal.",
    "checklist": ["Core user flow is clear", "Primary use case addressed", "Scope is manageable"]
  }
}
</brief_update>`;
  }

  return '';
}

// Mock responses for Map mode
function getMapMockResponse(messages: Message[]): string {
  const userMessages = messages.filter((m) => m.role === 'user');
  const messageCount = userMessages.length;

  if (messageCount === 1) {
    return `Got it — let's map this out. What's the entry point? How does a user first encounter this flow? Do they click a button, receive a notification, or land on a specific page?

<designmap_update>
{
  "overview": "${userMessages[0].content.slice(0, 100)}",
  "phase": "understand"
}
</designmap_update>`;
  }

  if (messageCount === 2) {
    return `Okay, so they start there. What's the first thing they see or do? Walk me through the initial screen or action.

<designmap_update>
{
  "addSteps": [
    {
      "id": "entry-point",
      "title": "Entry Point",
      "description": "User enters the flow",
      "states": [{"type": "happy", "label": "Normal entry", "description": "User arrives from expected path"}],
      "decisions": [],
      "patterns": [],
      "openQuestions": ["How do users discover this?"]
    }
  ],
  "phase": "map"
}
</designmap_update>`;
  }

  if (messageCount === 3) {
    return `Good. Now let's add some states to this step. What happens if there's no data? What about errors or loading states?

<designmap_update>
{
  "updateSteps": [
    {
      "id": "entry-point",
      "states": [
        {"type": "empty", "label": "No data", "description": "First-time user with nothing to show"},
        {"type": "loading", "label": "Loading", "description": "Fetching data from server"}
      ]
    }
  ],
  "addSteps": [
    {
      "id": "main-action",
      "title": "Main Action",
      "description": "User performs the primary action",
      "states": [{"type": "happy", "label": "Success", "description": "Action completes successfully"}],
      "decisions": [],
      "patterns": [],
      "openQuestions": []
    }
  ],
  "phase": "explore"
}
</designmap_update>

<pattern_identified>
{
  "patternId": "loading-progress",
  "reason": "Users need feedback while waiting for data to load",
  "flowStepId": "entry-point"
}
</pattern_identified>`;
  }

  if (messageCount >= 4) {
    return `This is shaping up well. Let me add error handling and we should have a solid flow mapped out.

<designmap_update>
{
  "updateSteps": [
    {
      "id": "main-action",
      "states": [
        {"type": "error", "label": "Failed", "description": "Action failed, show retry option"}
      ]
    }
  ],
  "constraints": ["Must work offline", "Response time under 2 seconds"],
  "phase": "synthesize"
}
</designmap_update>

<pattern_identified>
{
  "patternId": "error-recovery",
  "reason": "Users need clear paths to recover from errors",
  "flowStepId": "main-action"
}
</pattern_identified>`;
  }

  return '';
}

// Mock responses for Rationale mode
function getRationaleMockResponse(messages: Message[]): string {
  const userMessages = messages.filter((m) => m.role === 'user');
  const messageCount = userMessages.length;

  if (messageCount === 1) {
    return `Okay, let's work through this. What's the core problem you're solving? If this design didn't exist, what would users struggle with?

<rationale_update>
{
  "problem": "${userMessages[0].content.slice(0, 100)}",
  "phase": "problem"
}
</rationale_update>`;
  }

  if (messageCount === 2) {
    return `That's a clear problem statement. Now, who are the users affected by this? What constraints are you working within — timeline, technical limitations, team size?

<rationale_update>
{
  "context": ["Users face this problem regularly", "Current solutions are inadequate"],
  "phase": "context"
}
</rationale_update>`;
  }

  if (messageCount === 3) {
    return `Got it. Now let's capture the key decisions you've made. Walk me through one decision — what did you decide, and why? What alternatives did you consider and reject?

<rationale_update>
{
  "context": ["Timeline constraint noted", "Technical stack defined"],
  "addDecisions": [
    {
      "id": "d1",
      "title": "Core Approach",
      "what": "Starting with a simplified solution",
      "why": "Faster time to value, easier to validate assumptions",
      "rejected": [
        {"approach": "Full-featured launch", "reason": "Too much risk, too long to build"}
      ],
      "patterns": [],
      "openQuestions": ["Will users accept a minimal solution?"]
    }
  ],
  "phase": "decisions"
}
</rationale_update>`;
  }

  if (messageCount >= 4) {
    return `Strong rationale. Let me capture the pattern that applies here — this is a Human-in-the-Loop decision, keeping users in control of AI actions. This strengthens your case for stakeholders.

<rationale_update>
{
  "updateDecisions": [
    {
      "id": "d1",
      "patterns": [{"patternId": "human-in-the-loop", "application": "Users approve AI actions before execution", "caution": "May slow down power users"}]
    }
  ],
  "assumptions": ["Users prefer control over speed", "Trust is more important than efficiency for this use case"],
  "phase": "review"
}
</rationale_update>

<pattern_identified>
{
  "patternId": "human-in-the-loop",
  "reason": "Keeping users in control builds trust with AI features",
  "decisionId": "d1"
}
</pattern_identified>`;
  }

  return '';
}

// Get mock response based on mode
function getMockResponse(messages: Message[], mode: Mode): string {
  switch (mode) {
    case 'map':
      return getMapMockResponse(messages);
    case 'rationale':
      return getRationaleMockResponse(messages);
    case 'brief':
    default:
      return getBriefMockResponse(messages);
  }
}

export async function POST(request: Request) {
  try {
    const { messages, mode = 'brief' } = await request.json();

    // Use mock mode if enabled
    if (process.env.MOCK_MODE === 'true') {
      // Simulate a small delay like a real API
      await new Promise((resolve) => setTimeout(resolve, 800));
      return Response.json({
        message: getMockResponse(messages, mode as Mode),
      });
    }

    // Convert messages to Claude format
    const claudeMessages = messages.map((msg: Message) => ({
      role: msg.role,
      content: msg.content,
    }));

    const systemPrompt = getSystemPromptForMode(mode as Mode);

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
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
