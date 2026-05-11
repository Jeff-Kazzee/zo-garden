# zo-garden

A community-curated **directory of links** for [Zo Computer](https://zo.computer) and adjacent AI tooling — Skills, Personas, Prompts, tools, projects, and writing worth your time.

The official [`zocomputer/skills`](https://github.com/zocomputer/skills) registry hosts code curated by Zo. This is different: a thin, opinionated index of work that lives elsewhere. Higher signal, lower volume, no hosting overhead.

> Things grow here. Things also get pruned.

## The index

→ **[`INDEX.md`](INDEX.md)** — the directory itself, grouped by type.

Entries point at the real source — a GitHub repo, a gist, a personal site, a video, a course. We don't host code. We vouch for links.

## Submit a link

Two ways, pick one:

1. **[Open an issue](https://github.com/Jeff-Kazzee/zo-garden/issues/new?template=submit-link.yml)** — fastest. Fill out the form, the maintainer adds it to `INDEX.md`.
2. **Open a PR** — edit `INDEX.md` directly. Use the PR template. See [`CONTRIBUTING.md`](CONTRIBUTING.md).

Either way: the description must explain *why this is worth a Zo user's attention*, not just what it is.

## What we accept

| Section | What belongs there |
|---|---|
| Skills | Installable Agent Skills hosted on GitHub, gists, or your own site |
| Personas | Persona definitions (system prompts) you can copy into Zo |
| Prompts | Reusable prompts, single-purpose, copy-and-run |
| Tools & utilities | CLIs, extensions, scripts that play well with Zo or AI workflows |
| Projects built on Zo | Sites, services, products, experiments running on Zo Computer |
| Reading | Posts, essays, threads on AI-assisted development |
| Talks & videos | Recorded talks, demos, conference sessions |
| Courses & tutorials | Structured learning material |

If your submission doesn't fit, [open an issue](https://github.com/Jeff-Kazzee/zo-garden/issues/new) and propose a new section.

## Quality bar

Submissions clear all of these or they don't get merged:

- **The link works** and points at a primary source (not a Twitter screenshot of the thing).
- **The description tells a Zo user when or why to care** — not just what it is. "Helpful tool" gets rejected on sight.
- **No LLM slop.** Banned phrases listed in [`CONTRIBUTING.md`](CONTRIBUTING.md).
- **No spam, no self-aggrandizing fluff.** One line, specific, useful.
- **No duplicates.** Check the index first.

## Validation

```bash
bun install
bun validate
```

The validator checks `INDEX.md` for banned phrases, duplicate URLs, and broken entry format. CI runs it on every PR.

## License

MIT. See [`LICENSE`](LICENSE). Linking to your work doesn't transfer rights — your repo, your license. By submitting, you confirm the link points at something you have the right to share.
