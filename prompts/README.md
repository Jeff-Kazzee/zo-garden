# Prompts

Reusable prompt files for specific workflows. Lighter than a Skill — no scripts, no install step. Just a `.prompt.md` file you drop in your workspace and reference when needed.

## Add a prompt

1. Create `prompts/<your-slug>.prompt.md`.
2. Add frontmatter:
   ```yaml
   ---
   name: your-slug
   description: One sentence on what this prompt does and when to use it.
   author: your-handle
   ---
   ```
3. The body is the prompt.
4. Run `bun validate` from the repo root.
5. Open a PR.

## Use a prompt

Save the file into a workspace folder. Reference it by path when asking your agent to run it.

## Quality bar

- Prompt body is at least 50 characters and specific to a real workflow.
- No banned LLM slop phrases.
- If the prompt expects variables (inputs), document them at the top.
