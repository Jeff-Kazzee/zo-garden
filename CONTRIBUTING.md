# Contributing to zo-garden

This is a link directory, not a code registry. You submit a link. We curate.

If that sounds light — it is, by design. Hosting code means we own its maintenance. Curating links means we vouch for taste. The work stays with you.

## Two ways to submit

### 1. Open an issue (preferred)

[Submit a link →](https://github.com/Jeff-Kazzee/zo-garden/issues/new?template=submit-link.yml)

Fill out the form. The maintainer adds the entry to `INDEX.md` when it clears the bar.

### 2. Open a PR (power user)

1. Fork.
2. Edit [`INDEX.md`](INDEX.md). Add your entry under the right section, in this format:
   ```
   - [Name](https://your-link) — One-sentence description that says when or why a Zo user should care. *(your-handle)*
   ```
3. Run `bun install && bun validate` locally. Fix anything it flags.
4. Open a PR. Use the template. Fill in every section.

## What we accept

Anything that fits one of the [`INDEX.md`](INDEX.md) sections:

- **Skills** — Installable Agent Skills hosted somewhere with a permalink.
- **Personas** — Persona definitions (system prompts).
- **Prompts** — Reusable prompts, single-purpose.
- **Tools & utilities** — CLIs, extensions, scripts.
- **Projects built on Zo** — Live sites, services, products.
- **Reading** — Posts, essays, threads.
- **Talks & videos** — Recorded sessions.
- **Courses & tutorials** — Structured material.

If your link doesn't fit, open an issue first and propose a section.

## The quality bar

### Must-haves

- [ ] **The link works** and points at a primary source. Not a screenshot, not a tweet about the thing — the thing itself.
- [ ] **The description tells a Zo user when or why to care.** Compare:
  - ❌ "A useful tool for data analysis."
  - ✅ "Parse Apple Card / Chase / Mint CSVs to find recurring charges. Use when auditing subscriptions."
- [ ] **No duplicates.** Search `INDEX.md` first.
- [ ] **Right section.** If unsure, ask.

### No slop

Banned phrases in any user-facing copy in this repo (descriptions, README, INDEX entries):

> *delve, utilize, holistic, seamless, cutting-edge, synergy, paradigm, empower, deep dive, in terms of, it's important to note, at the end of the day, game-changer.*

Concrete language wins. "Fix the file" beats "remediate the artifact."

### Safety & honesty

- **Disclose self-promotion.** Linking your own work is fine — say so in the issue/PR.
- **No paid placements.** This isn't a billboard. If money changed hands for a link, we won't take it.
- **No data-exfiltrating tools** without an obvious, prominent warning at the link itself.
- **Linked work needs a license you're allowed to share.** Your repo, your call — but if it's proprietary, say so.

## Review process

- All PRs and issue submissions require approval from a CODEOWNER (currently [@Jeff-Kazzee](https://github.com/Jeff-Kazzee)).
- CI must pass.
- Expect direct feedback. Most first-time submissions need at least one revision.
- We close stale submissions (30 days without response).

## Pruning

This directory is curated, not append-only. Entries get removed when:

- The link rots (404, parked domain, deleted repo).
- The work no longer reflects the quality bar.
- The author asks us to remove it.
- It becomes redundant with a stronger entry.

Pruning is not personal. It's the whole point of the place.

## Pushback policy

If your submission has a problem, we will tell you directly. Not "you might want to consider" — direct. This is intentional. We treat you like a capable contributor whose time is worth saving.

If you think we're wrong, push back in the issue or PR. We've changed our minds before.

## Code of conduct

See [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md). Standard Contributor Covenant. Be a person.

## Licensing

The contents of this repo are MIT-licensed. Linking to your work doesn't transfer rights — your repo, your license. By submitting, you confirm the link points at something you have the right to share.
