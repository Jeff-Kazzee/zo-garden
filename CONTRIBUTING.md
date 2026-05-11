# Contributing to zo-garden

We curate. We prune. We say no.

If that sounds harsh, the alternative is a registry where every install is a gamble. Other registries have tried that approach. They rot. This one won't.

## Before you open a PR

Read this whole file. It takes three minutes and prevents most rejected submissions.

## What we accept

| Type | Folder | What it is |
|---|---|---|
| Skill | `skills/` | An installable Agent Skill with a `SKILL.md`. Mirrors the [Agent Skills spec](https://agentskills.io/specification). |
| Persona | `personas/` | A persona definition (`.md` with frontmatter) describing identity, voice, and behavior. |
| Prompt | `prompts/` | A reusable prompt file (`.prompt.md`) for a specific workflow. |
| Resource | `resources.md` | An external link — project, blog post, course, video — that's worth knowing about. |

If your contribution doesn't fit one of these, open a discussion before building it.

## The quality bar

We reject submissions that fail any of the following. No exceptions.

### Functional

- [ ] **It works.** You ran it. End-to-end. On a clean Zo Computer.
- [ ] **Frontmatter is valid.** Required fields exist with the right types and lengths.
- [ ] **Scripts run on first try.** No undocumented dependencies, no path assumptions, no "you have to install X first" without saying so.
- [ ] **No secrets in the repo.** API keys, tokens, passwords — none. Use environment variables and document them.

### Substantive

- [ ] **The description tells me when to use it, not just what it is.** Compare:
  - ❌ "A helpful tool for analyzing data."
  - ✅ "Parse bank transaction CSVs from Apple Card, Chase, or Mint. Use when the user wants to find recurring charges or audit subscriptions."
- [ ] **The skill does one thing well.** If your `SKILL.md` describes three unrelated workflows, split it into three skills.
- [ ] **It's specific to a real use case.** Not "AI productivity assistant." Something a person would actually search for.

### Stylistic

- [ ] **No LLM slop.** Banned phrases in any user-facing copy (`SKILL.md`, descriptions, README): *delve, utilize, leverage (verb), holistic, robust, seamless, cutting-edge, synergy, paradigm, empower, deep dive, unpack, in terms of, it's important to note, at the end of the day, game-changer.*
- [ ] **Concrete language.** "Fix the file" beats "remediate the artifact." "Show" beats "demonstrate."
- [ ] **Exclamation points sparingly.** One per file, max.

### Safety

- [ ] **No destructive defaults.** A skill that deletes files should require confirmation or a `--force` flag.
- [ ] **No calls to private endpoints** without documenting them.
- [ ] **No data exfiltration.** If your skill sends data anywhere, it must be obvious from the description.
- [ ] **License is MIT-compatible.** No GPL, no proprietary, no "free for personal use only."

## Submission workflow

### For a Skill

1. Fork the repo.
2. Create your skill directory under `skills/<your-slug>/`. Slug rules: lowercase, hyphenated, must match the `name` field in frontmatter.
3. Add a `SKILL.md` with valid frontmatter. Use `skills/_example/SKILL.md` as a reference.
4. Add `scripts/`, `references/`, `assets/` as needed. No other top-level folders inside the skill.
5. (Optional but encouraged) Add a `DISPLAY.json` for UI presentation. See [DISPLAY.md spec](https://github.com/zocomputer/skills/blob/main/DISPLAY.md).
6. Run `bun install && bun validate` locally. Fix everything it flags.
7. Open a PR using the template. Fill in every section.

### For a Persona

1. Add a single file `personas/<your-slug>.md` with frontmatter (`name`, `description`, `author`).
2. The body is the persona's system prompt.
3. Run `bun validate`.
4. Open a PR.

### For a Prompt

1. Add a single file `prompts/<your-slug>.prompt.md`.
2. Include frontmatter (`name`, `description`, `author`).
3. The body is the prompt.
4. Run `bun validate`.
5. Open a PR.

### For a Resource (external link)

1. Add a row to `resources.md` under the appropriate section.
2. Format: `- [Name](url) — One-sentence description. (Author)`
3. Open a PR. Description must explain *why this matters*, not just what it is.

## Review process

- All PRs require approval from a CODEOWNER. Right now that's [@Jeff-Kazzee](https://github.com/Jeff-Kazzee).
- CI must pass.
- Expect feedback. Most first-time submissions need at least one revision.
- We close PRs that go stale (30 days without author response).

## Pushback policy

If your submission has a problem, we will tell you directly. Not "you might want to consider" — direct. This is intentional. We treat you like a capable contributor whose time is worth saving.

If you think we're wrong, push back. Submit a counterargument in the PR. We've changed our minds before.

## Code of conduct

See [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md). Standard Contributor Covenant. Be a person.

## Licensing

By contributing, you agree your submission is original work (or properly attributed) and MIT-licensed.
