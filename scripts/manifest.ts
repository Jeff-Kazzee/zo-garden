#!/usr/bin/env bun
/**
 * Generate manifest.json for zo-garden.
 *
 * Mirrors the shape of zocomputer/skills/manifest.json so the same install
 * pattern works. Run on merges to main via CI; also runnable locally.
 */

import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { parse as parseYAML } from "yaml";

const ROOT = new URL("..", import.meta.url).pathname;
const SKILLS_DIR = join(ROOT, "skills");
const PERSONAS_DIR = join(ROOT, "personas");
const PROMPTS_DIR = join(ROOT, "prompts");

const REPO = "Jeff-Kazzee/zo-garden";
const BRANCH = "main";

interface SkillEntry {
  slug: string;
  name: string;
  description: string;
  path: string;
  date_added: string;
  metadata?: Record<string, unknown>;
}

interface PersonaEntry {
  slug: string;
  name: string;
  description: string;
  path: string;
  author: string;
}

interface PromptEntry {
  slug: string;
  name: string;
  description: string;
  path: string;
  author: string;
}

interface Manifest {
  archive_root: string;
  tarball_url: string;
  generated_at: string;
  skills: SkillEntry[];
  personas: PersonaEntry[];
  prompts: PromptEntry[];
}

function extractFrontmatter(content: string): Record<string, unknown> | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  try {
    return parseYAML(match[1]) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function gitDateForPath(path: string): Promise<string> {
  // Best-effort: use file mtime as a fallback if git isn't available.
  try {
    const proc = Bun.spawn(["git", "log", "-1", "--format=%cs", "--", path], {
      cwd: ROOT,
      stdout: "pipe",
    });
    const text = (await new Response(proc.stdout).text()).trim();
    if (text) return text;
  } catch {
    // ignore
  }
  const s = await stat(path);
  return s.mtime.toISOString().slice(0, 10);
}

async function buildSkills(): Promise<SkillEntry[]> {
  const out: SkillEntry[] = [];
  let entries;
  try {
    entries = await readdir(SKILLS_DIR, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith(".") || entry.name === "_example") continue;
    const skillMd = join(SKILLS_DIR, entry.name, "SKILL.md");
    try {
      const raw = await readFile(skillMd, "utf-8");
      const fm = extractFrontmatter(raw);
      if (!fm) continue;
      const date_added = await gitDateForPath(skillMd);
      out.push({
        slug: entry.name,
        name: (fm.name as string) ?? entry.name,
        description: (fm.description as string) ?? "",
        path: `skills/${entry.name}`,
        date_added,
        metadata: fm.metadata as Record<string, unknown> | undefined,
      });
    } catch {
      // skip
    }
  }
  return out.sort((a, b) => a.slug.localeCompare(b.slug));
}

async function buildPersonas(): Promise<PersonaEntry[]> {
  const out: PersonaEntry[] = [];
  let entries;
  try {
    entries = await readdir(PERSONAS_DIR, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    if (entry.name === "README.md" || entry.name.startsWith("_")) continue;
    const slug = entry.name.replace(/\.md$/, "");
    const file = join(PERSONAS_DIR, entry.name);
    const raw = await readFile(file, "utf-8");
    const fm = extractFrontmatter(raw);
    if (!fm) continue;
    out.push({
      slug,
      name: (fm.name as string) ?? slug,
      description: (fm.description as string) ?? "",
      author: (fm.author as string) ?? "",
      path: `personas/${entry.name}`,
    });
  }
  return out.sort((a, b) => a.slug.localeCompare(b.slug));
}

async function buildPrompts(): Promise<PromptEntry[]> {
  const out: PromptEntry[] = [];
  let entries;
  try {
    entries = await readdir(PROMPTS_DIR, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".prompt.md")) continue;
    if (entry.name.startsWith("_")) continue;
    const slug = entry.name.replace(/\.prompt\.md$/, "");
    const file = join(PROMPTS_DIR, entry.name);
    const raw = await readFile(file, "utf-8");
    const fm = extractFrontmatter(raw);
    if (!fm) continue;
    out.push({
      slug,
      name: (fm.name as string) ?? slug,
      description: (fm.description as string) ?? "",
      author: (fm.author as string) ?? "",
      path: `prompts/${entry.name}`,
    });
  }
  return out.sort((a, b) => a.slug.localeCompare(b.slug));
}

async function main() {
  const archive_root = `${REPO.split("/")[1]}-${BRANCH}`;
  const tarball_url = `https://codeload.github.com/${REPO}/tar.gz/refs/heads/${BRANCH}`;

  const skills = await buildSkills();
  const personas = await buildPersonas();
  const prompts = await buildPrompts();

  const manifest: Manifest = {
    archive_root,
    tarball_url,
    generated_at: new Date().toISOString(),
    skills,
    personas,
    prompts,
  };

  const outPath = join(ROOT, "manifest.json");
  await writeFile(outPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`Wrote ${outPath}`);
  console.log(`  ${skills.length} skills, ${personas.length} personas, ${prompts.length} prompts`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
