import Anthropic from '@anthropic-ai/sdk';
import {
  getBriefSystemPrompt,
  getMapSystemPrompt,
  getCritiqueSystemPrompt,
  getStakeholderSystemPrompt,
  getIASystemPrompt,
  getChatSystemPrompt,
} from '@/lib/constants';
import { Message } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

type Mode = 'chat' | 'brief' | 'map' | 'critique' | 'stakeholder' | 'ia';

// Get system prompt based on mode
function getSystemPromptForMode(mode: Mode): string {
  switch (mode) {
    case 'chat':
      return getChatSystemPrompt();
    case 'map':
      return getMapSystemPrompt();
    case 'critique':
      return getCritiqueSystemPrompt();
    case 'stakeholder':
      return getStakeholderSystemPrompt();
    case 'ia':
      return getIASystemPrompt();
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

// Mock responses for Critique mode
function getCritiqueMockResponse(messages: Message[]): string {
  const userMessages = messages.filter((m) => m.role === 'user');
  const messageCount = userMessages.length;

  if (messageCount === 1) {
    return `Thanks for sharing this design. I can see it's a form interface with several input fields. Let me analyze it.

First, what's working well:
- Clean visual hierarchy
- Clear section groupings
- Consistent spacing

<critique_update>
{
  "imageDescription": "Form interface with multiple input fields and submit button",
  "whatsWorking": ["Clean visual hierarchy", "Clear section groupings", "Consistent spacing"],
  "phase": "analyze"
}
</critique_update>`;
  }

  if (messageCount === 2) {
    return `Now let me look at potential improvements. I've identified a few issues:

<critique_update>
{
  "addIssues": [
    {
      "id": "i1",
      "severity": "major",
      "category": "Feedback",
      "title": "No input validation feedback",
      "description": "Users won't know if their input is valid until they submit",
      "suggestion": "Add inline validation with real-time feedback"
    },
    {
      "id": "i2",
      "severity": "minor",
      "category": "Accessibility",
      "title": "Low contrast on placeholder text",
      "description": "Placeholder text may be hard to read for some users",
      "suggestion": "Increase contrast ratio to meet WCAG AA standards"
    }
  ],
  "phase": "deep-dive"
}
</critique_update>

<pattern_identified>
{
  "patternId": "input-validation",
  "reason": "Real-time validation helps users correct errors before submission"
}
</pattern_identified>`;
  }

  if (messageCount >= 3) {
    return `Let me summarize the priority fixes for this design:

<critique_update>
{
  "priorityFixes": [
    "Add inline validation with real-time feedback",
    "Improve placeholder text contrast",
    "Consider adding a progress indicator for multi-step forms"
  ],
  "patterns": [{"patternId": "progressive-disclosure", "reason": "Break complex forms into manageable steps"}],
  "phase": "synthesize"
}
</critique_update>`;
  }

  return '';
}

// Mock responses for Stakeholder mode
function getStakeholderMockResponse(messages: Message[]): string {
  const userMessages = messages.filter((m) => m.role === 'user');
  const messageCount = userMessages.length;

  if (messageCount === 1) {
    return `Got it. Before we prep for that conversation, tell me more about the context. Who specifically will you be presenting to? What's their primary concern — cost, timeline, risk, or something else?

<stakeholder_update>
{
  "designDecision": "${userMessages[0].content.slice(0, 100)}",
  "phase": "context"
}
</stakeholder_update>`;
  }

  if (messageCount === 2) {
    return `That's helpful context. Now let's anticipate the objections. Based on what you've told me, I'd expect questions like:

<stakeholder_update>
{
  "context": ["Executive audience", "Primary concern is timeline"],
  "addObjections": [
    {
      "id": "o1",
      "stakeholder": "Executive",
      "objection": "Why can't we just ship the simpler version faster?",
      "counterArguments": ["The simpler version creates technical debt we'll pay for later", "User research shows the core feature is essential for adoption"],
      "evidenceNeeded": ["Technical debt estimate from engineering", "User research quotes"]
    }
  ],
  "phase": "objections"
}
</stakeholder_update>`;
  }

  if (messageCount === 3) {
    return `Good. Let's add more potential objections and start building your counter-arguments:

<stakeholder_update>
{
  "addObjections": [
    {
      "id": "o2",
      "stakeholder": "Engineering",
      "objection": "This seems over-engineered for an MVP",
      "counterArguments": ["We've scoped to the minimum viable feature set", "The architecture choices prevent costly rewrites later"],
      "evidenceNeeded": ["Architecture diagram showing flexibility", "Comparison with competitor launch timelines"]
    }
  ],
  "phase": "evidence"
}
</stakeholder_update>`;
  }

  if (messageCount >= 4) {
    return `You're well-prepared now. Here are your key talking points:

<stakeholder_update>
{
  "talkingPoints": [
    "This approach balances speed with quality",
    "User research validates the core feature set",
    "We've reduced scope to the minimum viable solution"
  ],
  "riskMitigations": [
    "We have a rollback plan if metrics don't meet targets",
    "Phased rollout reduces blast radius"
  ],
  "phase": "synthesize"
}
</stakeholder_update>`;
  }

  return '';
}

// Mock responses for IA mode
function getIAMockResponse(messages: Message[]): string {
  const userMessages = messages.filter((m) => m.role === 'user');
  const messageCount = userMessages.length;

  if (messageCount === 1) {
    return `Interesting. Let's start by understanding the content. What are the main things users need to find or do in this product? Think about the core user goals.

<ia_update>
{
  "projectName": "${userMessages[0].content.slice(0, 50)}",
  "phase": "understand"
}
</ia_update>`;
  }

  if (messageCount === 2) {
    return `Good. Let me start building a content inventory based on what you've described:

<ia_update>
{
  "addContent": [
    {
      "id": "p1",
      "name": "Dashboard",
      "type": "page",
      "description": "Overview of key metrics and recent activity"
    },
    {
      "id": "p2",
      "name": "Settings",
      "type": "page",
      "description": "User preferences and account configuration"
    },
    {
      "id": "s1",
      "name": "User Profile",
      "type": "section",
      "description": "Personal information and avatar",
      "parent": "p2"
    }
  ],
  "phase": "inventory"
}
</ia_update>`;
  }

  if (messageCount === 3) {
    return `Now let's think about the navigation. How should users move between these areas?

<ia_update>
{
  "addContent": [
    {
      "id": "p3",
      "name": "Help Center",
      "type": "page",
      "description": "Documentation and support resources"
    }
  ],
  "navigation": [
    {
      "id": "n1",
      "label": "Dashboard",
      "path": "/",
      "children": []
    },
    {
      "id": "n2",
      "label": "Settings",
      "path": "/settings",
      "children": [
        {"id": "n2-1", "label": "Profile", "path": "/settings/profile"},
        {"id": "n2-2", "label": "Account", "path": "/settings/account"}
      ]
    },
    {
      "id": "n3",
      "label": "Help",
      "path": "/help"
    }
  ],
  "phase": "navigation"
}
</ia_update>`;
  }

  if (messageCount >= 4) {
    return `Your IA is taking shape. Here's what we have, with some open questions to resolve:

<ia_update>
{
  "openQuestions": [
    "Should Settings be in the main nav or a user menu?",
    "Do we need a search feature for the Help Center?",
    "How deep should the navigation go — max 2-3 levels recommended"
  ],
  "phase": "synthesize"
}
</ia_update>`;
  }

  return '';
}

// Mock responses for Chat mode (general)
function getChatMockResponse(messages: Message[]): string {
  const userMessages = messages.filter((m) => m.role === 'user');
  const messageCount = userMessages.length;
  const lastMessage = userMessages[userMessages.length - 1]?.content.toLowerCase() || '';

  // Detect potential modes from the message
  const mentionsFlow =
    lastMessage.includes('flow') || lastMessage.includes('journey') || lastMessage.includes('step');
  const mentionsCritique =
    lastMessage.includes('screenshot') ||
    lastMessage.includes('feedback') ||
    lastMessage.includes('review');
  const mentionsStakeholder =
    lastMessage.includes('present') ||
    lastMessage.includes('stakeholder') ||
    lastMessage.includes('defend');
  const mentionsIA =
    lastMessage.includes('navigation') ||
    lastMessage.includes('structure') ||
    lastMessage.includes('organize');

  if (messageCount === 1) {
    if (mentionsFlow) {
      return `Sounds like you're working on a user flow. I can help you think through each step, identify edge cases, and spot potential issues.

Want to switch to Map mode to properly walk through this journey? It'll help us capture each step systematically.

<mode_suggestion>
{
  "suggestedMode": "map",
  "reason": "You're describing a user flow — Map mode helps walk through each step"
}
</mode_suggestion>`;
    }

    if (mentionsCritique) {
      return `Got it — you want feedback on a design. I can analyze it for UX patterns, accessibility issues, and potential improvements.

Want to switch to Critique mode? You can share a screenshot and I'll give you structured feedback.

<mode_suggestion>
{
  "suggestedMode": "critique",
  "reason": "You want design feedback — Critique mode provides structured analysis"
}
</mode_suggestion>`;
    }

    if (mentionsStakeholder) {
      return `Presenting to stakeholders can be tricky. I can help you anticipate objections, prepare counter-arguments, and organize your talking points.

Want to switch to Stakeholder mode to prep for that conversation?

<mode_suggestion>
{
  "suggestedMode": "stakeholder",
  "reason": "You need to present/defend a decision — Stakeholder mode helps prep"
}
</mode_suggestion>`;
    }

    if (mentionsIA) {
      return `Organizing content and navigation is crucial for good UX. I can help you think through the information architecture.

Want to switch to IA mode to structure this properly?

<mode_suggestion>
{
  "suggestedMode": "ia",
  "reason": "You're organizing content/navigation — IA mode helps structure it"
}
</mode_suggestion>`;
    }

    return `Interesting! Tell me more about what you're trying to achieve. Are you:

- **Clarifying requirements** for something new?
- **Mapping out a flow** or user journey?
- **Getting feedback** on an existing design?
- **Preparing to present** to stakeholders?
- **Organizing content** and navigation?

The more context you give me, the better I can help.`;
  }

  if (messageCount >= 2) {
    return `Based on what you're describing, it sounds like you might benefit from Brief mode — it'll help us clarify what you're building before diving into design.

Want to switch modes, or would you like to continue chatting here?

<mode_suggestion>
{
  "suggestedMode": "brief",
  "reason": "Clarifying requirements before design helps avoid wasted effort"
}
</mode_suggestion>`;
  }

  return '';
}

// Get mock response based on mode
function getMockResponse(messages: Message[], mode: Mode): string {
  switch (mode) {
    case 'chat':
      return getChatMockResponse(messages);
    case 'map':
      return getMapMockResponse(messages);
    case 'critique':
      return getCritiqueMockResponse(messages);
    case 'stakeholder':
      return getStakeholderMockResponse(messages);
    case 'ia':
      return getIAMockResponse(messages);
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
