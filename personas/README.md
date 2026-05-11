# Personas

Persona definitions for Zo Computer. A persona is a system prompt that shapes how Zo responds — voice, identity, behavior, hard constraints.

## Add a persona

1. Create `personas/<your-slug>.md` (lowercase, hyphenated filename).
2. Add frontmatter:
   ```yaml
   ---
   name: your-slug
   description: One sentence on what this persona is for and when to use it.
   author: your-handle
   ---
   ```
3. The body is the system prompt. Write it like you mean it — see `_example.md`.
4. Run `bun validate` from the repo root.
5. Open a PR.

## Use a persona

Copy the file's content into [Settings > AI > Personas](https://jeffkazzee.zo.computer/?t=settings&s=ai&d=personas) in your Zo Computer. Or download the file and paste manually.

## Quality bar

- The persona has a clear, single identity. "Helpful assistant" is not a persona.
- The system prompt is at least 100 characters and describes voice, behavior, and constraints.
- No banned LLM slop phrases.
