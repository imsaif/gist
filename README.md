# gist.design

> One file that makes your product readable to every AI tool.

## Quick start

```bash
curl -fsSL https://raw.githubusercontent.com/imsaif/gist/main/install.sh | bash
```

Then in Claude Code:

```
/gist-design
```

It audits how AI tools see your project and generates a `.gist.design` file to fix the gaps.

---

## Why

AI tools — coding assistants like Cursor and Claude Code, agents like ChatGPT and Perplexity — can read your product's HTML and docs. They can't read your design decisions, interaction rationale, rejected alternatives, or what your product is NOT. So they guess.

gist.design fixes that. A single structured file at your project root that captures how your product actually works and why — readable by any AI tool.

```
robots.txt    → for crawlers      → "What can you access?"
sitemap.xml   → for search engines → "What pages exist?"
llms.txt      → for AI tools       → "What content matters?"
gist.design   → for AI tools       → "How does it actually work, and why?"
```

<details>
<summary><strong>See the difference: Linear without vs. with gist.design</strong></summary>

### Before (without gist.design)

> Linear is a fast, modern project management tool similar to Jira. It offers sprint planning, issue tracking, and team collaboration features. It's designed to be faster and more streamlined than traditional project management tools, with a clean interface and keyboard shortcuts.

**What's wrong:**

- "Similar to Jira" — Linear is opinionated where Jira is customizable. No custom workflows, no configurable issue types.
- "Sprint planning" — Linear uses Cycles, not Sprints. Cycles auto-schedule, don't require ceremonies, and unfinished issues roll forward.
- "Keyboard shortcuts" — Undersells it. Linear is keyboard-_first_. Triage is designed around single-keypress actions.

### After (with gist.design)

> Linear is a keyboard-first issue tracker with an opinionated workflow. Issues flow through a fixed pipeline: Triage → Backlog → Active (via Cycles) → Done. There are no customizable workflows or configurable issue types. Cycles auto-schedule and roll unfinished work forward — there are no sprint ceremonies. The triage flow is designed around single-keypress actions: press `1` to move to backlog, `2` to assign a cycle, `D` to dismiss. This is not Jira with a faster UI. It's a different philosophy: fewer options, stronger opinions, faster execution.

See [examples/BEFORE-AFTER.md](examples/BEFORE-AFTER.md) for more products (v0, Raycast, Spark Mail).

</details>

## Install

### Option 1: One-liner (recommended)

```bash
curl -fsSL https://raw.githubusercontent.com/imsaif/gist/main/install.sh | bash
```

Installs to `~/.claude/skills/gist-design/`. Works across all your projects.

### Option 2: Git clone

```bash
git clone --depth 1 https://github.com/imsaif/gist.git /tmp/gist && \
  mkdir -p ~/.claude/skills && \
  cp -r /tmp/gist/skills/gist-design ~/.claude/skills/gist-design && \
  rm -rf /tmp/gist
```

### Option 3: Project-level (for teams)

Copy `skills/gist-design/` into your repo's `.claude/skills/` directory. Commit it so every team member gets the skill automatically.

```bash
git clone --depth 1 https://github.com/imsaif/gist.git /tmp/gist && \
  mkdir -p .claude/skills && \
  cp -r /tmp/gist/skills/gist-design .claude/skills/gist-design && \
  rm -rf /tmp/gist
```

## Usage

Three modes in Claude Code:

```
/gist-design          ← audit your current project (default)
/gist-design quick    ← generate a starter file in 2-3 turns
/gist-design create   ← full guided conversation
```

- **Audit** — reads your repo, describes your product as AI tools would, scores readability, highlights gaps
- **Quick** — one question, then generates a starter `.gist.design` file you can refine later
- **Create** — guided conversation that documents features, decisions, and boundaries in depth

## What the file captures

- **Product Overview** — what it is, who it's for, how AI fits
- **Per feature:**
  - **Intent** — goal, user, core anxiety, scope boundaries
  - **Interaction Model** — primary flow, key interactions, error handling
  - **Design Decisions** — chose X over Y because Z
  - **Patterns Used** — specific implementations with links to [aiuxdesign.guide](https://aiuxdesign.guide)
  - **Constraints** — technical, business, and user limitations
  - **Not This** — what it's NOT (prevents competitor blending)
  - **Open Questions** — what's still unresolved

See [skills/gist-design/references/file-format.md](skills/gist-design/references/file-format.md) for the full spec.

## Examples

- [linear.gist.design](examples/linear.gist.design) — opinionated project management
- [v0.gist.design](examples/v0.gist.design) — iterative AI UI generation
- [raycast.gist.design](examples/raycast.gist.design) — extensible desktop launcher with AI
- [spark-mail.gist.design](examples/spark-mail.gist.design) — AI email composition
- [BEFORE-AFTER.md](examples/BEFORE-AFTER.md) — what AI gets wrong without vs. with gist.design

## Using the file with your tools

| Tool                 | How to use                                   |
| -------------------- | -------------------------------------------- |
| **Cursor**           | `@Docs > Add new doc` → point to the file    |
| **Claude Code**      | Already at project root — read automatically |
| **ChatGPT / Claude** | Paste contents or upload the file            |
| **Copilot**          | Add to `.github/copilot-instructions.md`     |
| **llms.txt**         | Add a reference in your `llms.txt`           |

## Web app

Also available at [www.gist.design](https://www.gist.design) — no installation needed.

## Development (web app)

### Prerequisites

- Node.js 18+
- Anthropic API key (optional — set `MOCK_MODE=true` for testing)

### Setup

```bash
git clone https://github.com/imsaif/gist.git
cd gist
npm install
cp .env.example .env.local
```

### Environment Variables

```env
ANTHROPIC_API_KEY=your_api_key_here   # Required for /create and /audit
OPENAI_API_KEY=your_api_key_here      # Required for /audit (ChatGPT queries)
PERPLEXITY_API_KEY=your_api_key_here  # Optional for /audit (Perplexity queries)
MOCK_MODE=true                        # Set to use mock responses without API keys
```

### Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm start        # Start production server
```

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** Claude API (Anthropic), OpenAI API, Perplexity API
- **Deployment:** Vercel

## Pattern Library

Powered by [aiuxdesign.guide](https://aiuxdesign.guide) — 36 AI UX design patterns (including agentic patterns) from ChatGPT, Claude, GitHub Copilot, Midjourney, Devin, and 50+ shipped products.

## License

MIT
