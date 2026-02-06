import Anthropic from '@anthropic-ai/sdk';
import {
  getBriefSystemPrompt,
  getMapSystemPrompt,
  getCritiqueSystemPrompt,
  getStakeholderSystemPrompt,
  getIASystemPrompt,
  getResearchSystemPrompt,
  getIdeationSystemPrompt,
  getConstraintsSystemPrompt,
  getChatSystemPrompt,
} from '@/lib/constants';
import { Message } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

type Mode =
  | 'chat'
  | 'brief'
  | 'map'
  | 'critique'
  | 'stakeholder'
  | 'ia'
  | 'research'
  | 'ideate'
  | 'constraints';

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
    case 'research':
      return getResearchSystemPrompt();
    case 'ideate':
      return getIdeationSystemPrompt();
    case 'constraints':
      return getConstraintsSystemPrompt();
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

// Mock responses for Research mode
function getResearchMockResponse(messages: Message[]): string {
  const userMessages = messages.filter((m) => m.role === 'user');
  const messageCount = userMessages.length;

  if (messageCount === 1) {
    return `Interesting. Before we go deeper, let me understand the landscape. You mentioned your users — but let's be more specific. Can you describe one real person who would use this? What's their role, and what are they trying to accomplish when they reach for your product?

<research_update>
{
  "productContext": "${userMessages[0].content.slice(0, 100)}",
  "phase": "context"
}
</research_update>`;
  }

  if (messageCount === 2) {
    return `That's a good start. Now let's dig into the pain. What's the biggest frustration this person faces today when trying to accomplish that goal? How are they currently working around it?

<research_update>
{
  "addSegments": [
    {
      "id": "seg-1",
      "name": "Primary User",
      "description": "Core user segment based on initial description",
      "goals": ["Complete their primary task efficiently"],
      "frustrations": ["Current solutions are clunky or slow"]
    }
  ],
  "phase": "discover"
}
</research_update>`;
  }

  if (messageCount === 3) {
    return `Good insight. The workaround tells us a lot about what they actually value. Let me push further — what would success look like from their perspective? Not your product's success, but their personal win.

<research_update>
{
  "addPainPoints": [
    {
      "id": "pp-1",
      "segment": "seg-1",
      "pain": "Current workflow requires too many manual steps",
      "severity": "high",
      "frequency": "Daily"
    }
  ],
  "currentSolutions": ["Manual workarounds with existing tools"],
  "phase": "empathize"
}
</research_update>`;
  }

  if (messageCount === 4) {
    return `We're building a solid picture. To validate these assumptions, I'd recommend starting with user interviews — 5-8 people from this segment. Focus on their current workflow, not your solution.

<research_update>
{
  "unmetNeeds": ["Automated workflow that reduces manual steps", "Faster time to completion"],
  "addResearchMethods": [
    {
      "id": "rm-1",
      "method": "User interviews",
      "goal": "Validate pain points and current workarounds",
      "effort": "medium"
    },
    {
      "id": "rm-2",
      "method": "Contextual inquiry",
      "goal": "Observe actual workflow in context",
      "effort": "high"
    }
  ],
  "phase": "methods"
}
</research_update>`;
  }

  if (messageCount >= 5) {
    return `Here's what we've learned. Your research canvas is taking shape — the key insight is that users care more about speed than features.

<research_update>
{
  "keyInsights": [
    "Users prioritize speed over feature richness",
    "Current workarounds reveal the core value proposition",
    "The primary segment has clear, validated pain points"
  ],
  "phase": "synthesize"
}
</research_update>`;
  }

  return '';
}

// Mock responses for Ideation mode
function getIdeationMockResponse(messages: Message[]): string {
  const userMessages = messages.filter((m) => m.role === 'user');
  const messageCount = userMessages.length;

  if (messageCount === 1) {
    return `Got it. Before we jump to approaches, let me make sure I understand the problem clearly. Who is experiencing this problem, and what's the cost of it going unsolved? I want to make sure we're solving the right thing.

<ideation_update>
{
  "problemStatement": "${userMessages[0].content.slice(0, 100)}",
  "phase": "problem"
}
</ideation_update>`;
  }

  if (messageCount === 2) {
    return `Good — the problem is clear. Now let's diverge. I'm going to suggest three very different approaches. Don't evaluate yet — just consider each one:

**Approach A:** Start minimal — solve the core problem with the simplest possible interface.
**Approach B:** Go AI-first — let AI handle the heavy lifting with human oversight.
**Approach C:** Community-driven — leverage users helping each other.

Which resonates? Or should we push for more options?

<ideation_update>
{
  "addApproaches": [
    {
      "id": "app-1",
      "title": "Minimal MVP",
      "description": "Solve the core problem with the simplest possible interface",
      "targetUsers": "All users equally",
      "strengths": ["Fast to build", "Easy to test", "Low risk"],
      "weaknesses": ["May feel underwhelming", "Limited differentiation"],
      "effort": "low",
      "patterns": []
    },
    {
      "id": "app-2",
      "title": "AI-First",
      "description": "Let AI handle the heavy lifting with human oversight",
      "targetUsers": "Power users who want automation",
      "strengths": ["Differentiated", "Scalable", "Reduces manual work"],
      "weaknesses": ["Trust issues", "Higher complexity", "AI accuracy concerns"],
      "effort": "high",
      "patterns": ["human-in-the-loop"]
    },
    {
      "id": "app-3",
      "title": "Community-Driven",
      "description": "Leverage users helping each other to solve the problem",
      "targetUsers": "Users who value peer knowledge",
      "strengths": ["Network effects", "Self-sustaining", "Rich content"],
      "weaknesses": ["Cold start problem", "Quality control", "Slow initial traction"],
      "effort": "medium",
      "patterns": []
    }
  ],
  "phase": "diverge"
}
</ideation_update>`;
  }

  if (messageCount === 3) {
    return `Now let's evaluate. Before we compare, what criteria matter most to you? I'd suggest we think about: technical feasibility, time to value for users, and team capacity. Are there other must-haves?

<ideation_update>
{
  "addEvaluationCriteria": [
    {
      "id": "ec-1",
      "criterion": "Technical feasibility",
      "weight": "must-have"
    },
    {
      "id": "ec-2",
      "criterion": "Time to value for users",
      "weight": "important"
    },
    {
      "id": "ec-3",
      "criterion": "Team capacity to build and maintain",
      "weight": "important"
    }
  ],
  "phase": "evaluate"
}
</ideation_update>`;
  }

  if (messageCount >= 4) {
    return `Based on our criteria, I'd recommend starting with the Minimal MVP approach but borrowing the AI-assist idea for one key interaction. Ship fast, validate, then layer in intelligence.

<ideation_update>
{
  "recommendation": {
    "approachId": "app-1",
    "reasoning": "Start minimal to validate the core problem, then iterate toward AI-first for the highest-impact interaction. This balances speed with differentiation.",
    "nextSteps": [
      "Define the MVP feature set (1-2 core interactions)",
      "Prototype the key screen for user testing",
      "Identify which interaction benefits most from AI-assist"
    ]
  },
  "phase": "converge"
}
</ideation_update>`;
  }

  return '';
}

// Mock responses for Constraints mode
function getConstraintsMockResponse(messages: Message[]): string {
  const userMessages = messages.filter((m) => m.role === 'user');
  const messageCount = userMessages.length;

  if (messageCount === 1) {
    return `Got it. Let's start surfacing constraints. First, the technical landscape — what existing systems does this need to integrate with? Any API limitations, browser requirements, or performance budgets?

<constraints_update>
{
  "projectContext": "${userMessages[0].content.slice(0, 100)}",
  "phase": "context"
}
</constraints_update>`;
  }

  if (messageCount === 2) {
    return `Good to know. Now let's talk timeline and resources. When does this need to ship? How big is the team? And are there any business constraints — revenue targets, compliance requirements, brand guidelines?

<constraints_update>
{
  "addConstraints": [
    {
      "id": "c-1",
      "category": "technical",
      "constraint": "Must integrate with existing system APIs",
      "severity": "hard",
      "source": "Engineering team"
    },
    {
      "id": "c-2",
      "category": "technical",
      "constraint": "Must support mobile browsers",
      "severity": "hard",
      "source": "Product requirements"
    }
  ],
  "phase": "surface"
}
</constraints_update>`;
  }

  if (messageCount === 3) {
    return `These constraints are actually clarifying. Let me spell out what each means for your design:

The API integration means you can't redesign the data model — you work with what exists. The timeline means you need to cut scope aggressively. These aren't blockers, they're decisions already made for you.

<constraints_update>
{
  "addConstraints": [
    {
      "id": "c-3",
      "category": "timeline",
      "constraint": "Must ship within current quarter",
      "severity": "hard",
      "source": "Product roadmap"
    },
    {
      "id": "c-4",
      "category": "resource",
      "constraint": "Small team — 2 developers, 1 designer",
      "severity": "soft",
      "source": "Team capacity"
    }
  ],
  "addDesignImplications": [
    {
      "id": "di-1",
      "constraintId": "c-1",
      "implication": "Data model is fixed — design must adapt to existing API structure",
      "designResponse": "Map UI to existing data fields rather than ideal information architecture"
    },
    {
      "id": "di-2",
      "constraintId": "c-3",
      "implication": "Limited time means aggressive scope cutting",
      "designResponse": "Focus on one core flow, defer secondary features to v2"
    }
  ],
  "phase": "implications"
}
</constraints_update>`;
  }

  if (messageCount === 4) {
    return `Here's the interesting part — these constraints actually help your design. A small team means less coordination overhead. A tight timeline forces focus. And fixed APIs mean fewer decisions to make.

<constraints_update>
{
  "opportunities": [
    "Tight timeline forces focus on the one flow that matters most",
    "Small team means faster decisions and less design-by-committee",
    "Fixed API reduces decision fatigue — work with what exists",
    "Mobile-first constraint leads to simpler, more focused interfaces"
  ],
  "phase": "opportunities"
}
</constraints_update>`;
  }

  if (messageCount >= 5) {
    return `Your constraint map is complete. The key takeaway: your constraints have already made several design decisions for you. Lean into them.

<constraints_update>
{
  "phase": "synthesize"
}
</constraints_update>`;
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
    case 'research':
      return getResearchMockResponse(messages);
    case 'ideate':
      return getIdeationMockResponse(messages);
    case 'constraints':
      return getConstraintsMockResponse(messages);
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
