# Wiring reference

Which config file each agent actually loads, and what to add to it.

Detect what the repo already has. Do not create config for an agent the user does not use.

| Agent                             | File it loads                                   | Detect with                                       |
| --------------------------------- | ----------------------------------------------- | ------------------------------------------------- |
| Claude Code                       | `CLAUDE.md` at repo root                        | `test -f CLAUDE.md`                               |
| Cursor                            | `.cursor/rules/*.mdc`, or legacy `.cursorrules` | `test -d .cursor/rules \|\| test -f .cursorrules` |
| GitHub Copilot                    | `.github/copilot-instructions.md`               | `test -f .github/copilot-instructions.md`         |
| Codex and other AGENTS.md readers | `AGENTS.md` at repo root                        | `test -f AGENTS.md`                               |

## The pointer line

Append this to whichever files exist. It is the same text for every target:

```markdown
## Product context

Read `llms.gist` at the repo root before describing this product, its positioning, or what
it deliberately does not do. It is the source of truth for those questions.
```

## Rules

- **Append, never rewrite.** These files hold the user's own instructions. Add a section at
  the end. Never reformat, reorder, or delete what is already there.
- **Check before adding.** If `llms.gist` is already referenced in the file, say so and
  change nothing.
- **If no config file exists,** do not guess. Ask which agent they use, then create only
  that one file containing only the pointer section.
- **`.cursor/rules/` takes an `.mdc` file,** not plain markdown. Write
  `.cursor/rules/llms-gist.mdc` with this frontmatter above the pointer section:

  ```
  ---
  description: Product context and positioning
  alwaysApply: true
  ---
  ```

- **Report exactly what changed.** List each file touched and say the file is not read
  until a new agent session starts.
