# Skills

Installable Agent Skills for Zo Computer. Each skill lives in its own directory and follows the [Agent Skills spec](https://agentskills.io/specification).

## Add a skill

1. Copy `_example/` to `skills/<your-slug>/`.
2. Edit `SKILL.md` — replace the frontmatter and body.
3. Add `scripts/`, `references/`, `assets/` as needed.
4. Run `bun validate` from the repo root.
5. Open a PR. See [`CONTRIBUTING.md`](../CONTRIBUTING.md).

## Install a skill

```bash
slug="<skill-slug>"; dest="Skills"; manifest_url="https://raw.githubusercontent.com/Jeff-Kazzee/zo-garden/main/manifest.json"; mkdir -p "$dest" && tarball_url="$(curl -fsSL "$manifest_url" | jq -r '.tarball_url')" && archive_root="$(curl -fsSL "$manifest_url" | jq -r '.archive_root')" && curl -L "$tarball_url" | tar -xz -C "$dest" --strip-components=2 "$archive_root/skills/$slug"
```

## Structure

```
skills/
└── your-slug/
    ├── SKILL.md          (required)
    ├── DISPLAY.json      (optional)
    ├── scripts/          (optional)
    ├── references/       (optional)
    └── assets/           (optional)
```

Anything else at the skill root is rejected by `bun validate`.
