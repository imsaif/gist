# gist

> One file that makes your product readable to every AI tool.

## Quick start

```bash
curl -fsSL llmsgist.org/i | bash
```

Then in Claude Code:

```
/llms-gist
```

It audits how AI tools see your project and generates a `.gist` file to fix the gaps.

---

## Why

AI tools (coding assistants like Cursor and Claude Code, agents like ChatGPT and Claude) can read your product's HTML and docs. They can't read your positioning, audience, "not for", or what AI tools commonly get wrong about you. So they guess.

A `.gist` file fixes that. A single structured file at your project root that captures what your product is, who it's for, and what AI tools commonly get wrong, readable by any AI tool.

```
robots.txt    → for crawlers      → "What can you access?"
sitemap.xml   → for search engines → "What pages exist?"
llms.txt      → for AI tools       → "What content matters?"
.gist         → for AI tools       → "How should you talk about this product?"
```

<details>
<summary><strong>See the difference: Linear without vs. with .gist</strong></summary>

### Before (without .gist)

> Linear is a fast, modern project management tool similar to Jira. It offers sprint planning, issue tracking, and team collaboration features. It's designed to be faster and more streamlined than traditional project management tools, with a clean interface and keyboard shortcuts.

**What's wrong:**

- "Similar to Jira": Linear is opinionated where Jira is customizable. Statuses are editable inside a category, but the status categories themselves are fixed, and there are no Jira-style issue types.
- "Sprint planning": Linear uses Cycles, not Sprints. Cycles auto-schedule, don't require ceremonies, and unfinished issues roll forward.
- "Keyboard shortcuts": undersells it. Linear is keyboard-_first_. Triage is designed around single-keypress actions.

### After (with .gist)

> Linear is a keyboard-first issue tracker with an opinionated workflow. Issues flow through fixed status categories: Backlog → Todo → In Progress → Done, plus Canceled. Teams can add and rename statuses inside a category, but the categories cannot be reordered and there are no Jira-style issue types. Cycles auto-schedule and roll unfinished work forward, so there are no sprint ceremonies. The triage flow is designed around single-keypress actions: press `1` to move to backlog, `2` to assign a cycle, `D` to dismiss. This is not Jira with a faster UI. It's a different philosophy: fewer options, stronger opinions, faster execution.

See [examples/BEFORE-AFTER.md](examples/BEFORE-AFTER.md) for more products (v0, Raycast, Spark Mail).

</details>

## How it works

Four steps, run in order by the `/llms-gist` skill.

### Audit

Reads what's already in the repo, README, package metadata, existing agent config files, key source files, and describes the product the way an AI tool would if asked "what does this do?" It scores readability across positioning, features, interaction model, and boundaries, then lists the specific gaps.

### Generate

Turns the audit gaps (or a guided conversation, in the fuller modes) into a `.gist` file, written as `llms.gist` at the project root.

### Wire it in

A file at the project root is not read just because it exists. The skill checks which agent config files the repo has (`CLAUDE.md`, `.cursor/rules`, `.github/copilot-instructions.md`, `AGENTS.md`) and appends a pointer to `llms.gist` in each one it finds, never rewriting what's already there.

### Verify

Proves the wiring worked instead of assuming it. It picks a question only `llms.gist` answers, asks you to put it to a fresh Claude Code session without naming the file, and reads the result honestly: right means the wiring works, wrong means the pointer didn't land.

## What the file captures

- **Product Overview**: what it is, who it's for, how AI fits
- **Per feature:**
  - **Intent**: goal, user, core anxiety, scope boundaries
  - **Interaction Model**: primary flow, key interactions, error handling
  - **Design Decisions**: chose X over Y because Z
  - **Patterns Used**: specific implementations with links to [aiuxdesign.guide](https://aiuxdesign.guide)
  - **Constraints**: technical, business, and user limitations
  - **Not This**: what it's NOT (prevents competitor blending)
  - **Open Questions**: what's still unresolved

See [skills/llms-gist/references/file-format.md](skills/llms-gist/references/file-format.md) for the full spec.

## Examples

- [linear.gist](examples/linear.gist): opinionated project management
- [v0.gist](examples/v0.gist): iterative AI UI generation
- [raycast.gist](examples/raycast.gist): extensible desktop launcher with AI
- [spark-mail.gist](examples/spark-mail.gist): AI email composition
- [BEFORE-AFTER.md](examples/BEFORE-AFTER.md): what AI gets wrong without vs. with .gist

## Using the file with your tools

| Tool                 | How to use                                  |
| -------------------- | ------------------------------------------- |
| **Cursor**           | `@Docs > Add new doc` → point to the file   |
| **Claude Code**      | Already at project root, read automatically |
| **ChatGPT / Claude** | Paste contents or upload the file           |
| **Copilot**          | Add to `.github/copilot-instructions.md`    |
| **llms.txt**         | Add a reference in your `llms.txt`          |

The Wire it in step now does this for you. The table is here for reference and for tools the skill does not yet detect.

## What this does not do

This makes your coding agent describe your product correctly, because its config points
at the file. It does not change what ChatGPT tells someone who asks about your product
on the web. Those models read pages a search index already contains, and a file nothing
links to is not in any index.

## Development

```bash
npm install
npm run dev
npm test
```

`src/lib/audit/` is dormant and intentionally unreferenced. See its own README before touching it.

## License

MIT
