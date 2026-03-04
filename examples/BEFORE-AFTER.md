# Before & After: What AI tools get wrong without gist.design

These examples show how AI tools describe real products **without** a gist.design file vs. **with** one. The difference is what developers actually experience when AI tools build the wrong thing.

---

## Linear

### Before (without gist.design)

> Linear is a fast, modern project management tool similar to Jira. It offers sprint planning, issue tracking, and team collaboration features. It's designed to be faster and more streamlined than traditional project management tools, with a clean interface and keyboard shortcuts.

### What's wrong

- **"Similar to Jira"** — Linear is opinionated where Jira is customizable. There are no custom workflows, no configurable issue types, no admin-heavy setup. Calling it "like Jira" tells a coding assistant to build Jira-style flexibility.
- **"Sprint planning"** — Linear uses Cycles, not Sprints. Cycles auto-schedule, don't require ceremonies, and unfinished issues roll forward automatically. A coding assistant told "implement sprint planning" would build the wrong flow.
- **"Keyboard shortcuts"** — Undersells it. Linear is keyboard-_first_. The triage flow is designed around pressing a single key to move an issue. Mouse usage is supported but not the primary interaction.
- **"Team collaboration features"** — Generic. Doesn't mention that Linear's collaboration model is async-first with minimal real-time features. No live cursors, no simultaneous editing.

### After (with gist.design)

> Linear is a keyboard-first issue tracker with an opinionated workflow. Issues flow through a fixed pipeline: Triage → Backlog → Active (via Cycles) → Done. There are no customizable workflows or configurable issue types. Cycles auto-schedule and roll unfinished work forward — there are no sprint ceremonies. The triage flow is designed around single-keypress actions: press `1` to move to backlog, `2` to assign a cycle, `D` to dismiss. This is not Jira with a faster UI. It's a different philosophy: fewer options, stronger opinions, faster execution.

---

## v0 (Vercel)

### Before (without gist.design)

> v0 is an AI-powered code generation tool by Vercel, similar to ChatGPT but specialized for React. Users describe what they want and v0 generates the code. It supports React, Next.js, and Tailwind CSS.

### What's wrong

- **"Similar to ChatGPT but for React"** — v0 is iterative, not one-shot. Users generate, then select specific elements in the preview and refine them. This select-and-edit loop is the core interaction, not prompt-and-receive.
- **"Generates code"** — v0 generates deployable applications, not code snippets. The output runs in a live preview and can be deployed to Vercel directly. A coding assistant told "build something like v0" would build a code snippet generator.
- **Missing: shadcn/ui constraint** — v0 generates components using shadcn/ui specifically, not arbitrary React components. This constraint is a design decision that ensures consistent, composable output. AI tools don't know about this constraint.
- **Missing: select-and-edit** — The ability to click on a specific part of the generated UI and refine just that part is v0's key differentiator. No AI description mentions this.

### After (with gist.design)

> v0 is an iterative UI generation tool by Vercel. Users describe a UI, v0 generates a live preview using shadcn/ui components (not arbitrary React), and then users click on specific elements in the preview to refine them. The select-and-edit loop — generate, preview, select an element, describe changes, regenerate that part — is the core interaction. Output is a deployable Next.js application, not a code snippet. This is not ChatGPT for React code. It's closer to a design tool where the medium is functional code and the editing mechanism is natural language targeted at specific UI elements.

---

## Raycast

### Before (without gist.design)

> Raycast is a macOS productivity tool and launcher, similar to Alfred or Spotlight. It lets users quickly launch apps, search files, and run custom scripts. It has an extensions marketplace and recently added AI chat features.

### What's wrong

- **"Similar to Alfred or Spotlight"** — Raycast replaces multiple standalone tools: clipboard manager, window manager, snippet expander, and calculator. Alfred is a launcher with plugins. Raycast is a productivity OS with a launcher as the entry point.
- **"Custom scripts"** — Raycast extensions are React components rendered inside the launcher, not shell scripts. The extension API is JSX-based with a full component library. A developer told "build a Raycast extension" who thinks "script" would build the wrong thing entirely.
- **"AI chat features"** — Undersells the integration. AI chat in Raycast happens inside the launcher context. You can pipe clipboard content, selected text, or command output directly into an AI conversation without leaving the launcher. It's not a separate chat window.
- **"Extensions marketplace"** — Makes it sound like a plugin store. Raycast extensions have deep OS integration (clipboard, selected text, frontmost app context) that browser-based extension stores can't match.

### After (with gist.design)

> Raycast is a keyboard-driven productivity layer for macOS that replaces Spotlight, clipboard manager, window manager, and snippet tools with a single interface. Extensions are React components (JSX + Raycast component library), not scripts or plugins. AI chat is embedded inside the launcher: users invoke it with a keystroke, and the conversation has access to clipboard contents, selected text, and the frontmost application's context. Users can take action on AI responses — copy, paste into the current app, save as snippet, or pipe into another command — without leaving the launcher window. This is not Alfred with AI bolted on. It's a unified productivity OS where AI is one capability among many, all accessible through the same keyboard-first interface.

---

## Spark Mail

### Before (without gist.design)

> Spark Mail is an email client with AI features. It can help compose emails, manage your inbox with smart sorting, and set up follow-up reminders. Similar to Gmail's Smart Compose or Superhuman's AI features.

### What's wrong

- **"Similar to Gmail's Smart Compose"** — Smart Compose predicts the next few words. Spark drafts complete emails from thread context. Completely different interaction model.
- **"AI features"** — Generic. Doesn't describe that the AI generates editable grey text in the compose field, not suggestion chips or a separate panel. The user edits directly, never approves or rejects.
- **Missing: no AI badge** — Sent emails show zero indication of AI involvement. This is a deliberate design choice, not an omission.
- **Missing: thread-visible drafting** — The original email thread stays visible alongside the draft specifically so users can fact-check AI hallucinations by glancing up.

### After (with gist.design)

> Spark Mail's AI Email Composer generates full email drafts from thread context. Drafts appear as editable grey text in the compose field — not suggestion chips, not a side panel. Users edit directly; any keystroke converts AI text to regular text at that point. There is no accept/reject flow and no "AI-assisted" badge on sent emails. The original thread remains visible alongside the draft so users can visually verify AI claims against the actual conversation. This is not autocomplete (Smart Compose), not a chatbot, and it never sends emails the user hasn't edited and approved.
