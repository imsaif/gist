# llms-gist

Audits how AI tools describe your product, generates an `llms.gist` file at your project root, and wires a pointer to it into your agent config (CLAUDE.md, AGENTS.md, Cursor, Copilot) so coding assistants read it.

## Use

Inside the project you want to describe:

```
/llms-gist:llms-gist
```

Or ask Claude: "make a .gist file for this project".

## Source

This branch is generated from `plugins/llms-gist/` on the main branch of [imsaif/gist](https://github.com/imsaif/gist). Make changes there, not here.

MIT licensed.
