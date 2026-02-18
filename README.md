# gist.design

> One file that makes your product readable to every AI tool.

AI tools — coding assistants like Cursor and Claude Code, agents like ChatGPT and Perplexity — can read your product's HTML and docs. They can't read your design decisions, interaction rationale, rejected alternatives, or what your product is NOT. So they guess.

gist.design fixes that. A single structured file at your project root that captures how your product actually works and why — readable by any AI tool.

```
robots.txt    → for crawlers      → "What can you access?"
sitemap.xml   → for search engines → "What pages exist?"
llms.txt      → for AI tools       → "What content matters?"
gist.design   → for AI tools       → "How does it actually work, and why?"
```

## Two ways to generate

### Claude Code skill (for developers)

Use the skill directly in Claude Code. It reads your project, audits how AI tools would describe it, and generates a gist.design file through guided conversation.

```bash
# Install the skill
git clone https://github.com/imsaif/gist.git ~/.claude/skills/gist-design
```

Then in Claude Code:

```
/gist-design
```

Three workflows:

- **Create** — building something new, want AI tools to understand it
- **Fix** — AI tools already get your product wrong
- **Audit** — see how AI tools currently describe your project, then fix the gaps

### Web app (for everyone)

Visit [gist.design/create](https://gist.design/create) for a guided conversation in the browser. No installation needed.

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

See [references/file-format.md](references/file-format.md) for the full spec and [references/example-spark-mail.gist.design](references/example-spark-mail.gist.design) for an example.

## Using the file with your tools

| Tool                 | How to use                                   |
| -------------------- | -------------------------------------------- |
| **Cursor**           | `@Docs > Add new doc` → point to the file    |
| **Claude Code**      | Already at project root — read automatically |
| **ChatGPT / Claude** | Paste contents or upload the file            |
| **Copilot**          | Add to `.github/copilot-instructions.md`     |
| **llms.txt**         | Add a reference in your `llms.txt`           |

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
ANTHROPIC_API_KEY=your_api_key_here
MOCK_MODE=true  # Set to use mock responses without API key
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
- **AI:** Claude API (Anthropic)

## Pattern Library

Powered by [aiuxdesign.guide](https://aiuxdesign.guide) — 36 AI UX design patterns (including agentic patterns) from ChatGPT, Claude, GitHub Copilot, Midjourney, Devin, and 50+ shipped products.

## License

MIT
