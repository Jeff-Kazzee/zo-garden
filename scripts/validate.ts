#!/usr/bin/env bun
/**
 * zo-garden validator
 *
 * Walks skills/, personas/, prompts/ and enforces the quality bar.
 * Exits non-zero if anything fails. CI runs this on every PR.
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { parse as parseYAML } from "yaml";

const ROOT = new URL("..", import.meta.url).pathname;
const SKILLS_DIR = join(ROOT, "skills");
const PERSONAS_DIR = join(ROOT, "personas");
const PROMPTS_DIR = join(ROOT, "prompts");

// ---- Banned slop phrases. Case-insensitive substring match. ----
const BANNED_PHRASES = [
  "delve",
  "utilize",
  "holistic",
  "seamless",
  "cutting-edge",
  "synergy",
  "paradigm",
  "empower",
  "deep dive",
  "in terms of",
  "it's important to note",
  "at the end of the day",
  "game-changer",
  "game changer",
];
// "leverage" only banned as verb — we skip it because static detection is unreliable.
// "robust" and "unpack" sometimes have legitimate technical uses; left out to avoid false positives.

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type Result = { ok: true } | { ok: false; errors: string[] };
const allErrors: string[] = [];

function fail(file: string, msg: string) {
  allErrors.push(`  ✗ ${relative(ROOT, file)}: ${msg}`);
}

function pass(file: string, msg: string) {
  console.log(`  ✓ ${relative(ROOT, file)}: ${msg}`);
}

// ---- Frontmatter helpers ----
function extractFrontmatter(content: string): { fm: Record<string, unknown> | null; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { fm: null, body: content };
  try {
    const fm = parseYAML(match[1]) as Record<string, unknown>;
    return { fm, body: match[2] };
  } catch {
    return { fm: null, body: content };
  }
}

function checkBannedPhrases(file: string, text: string) {
  const lower = text.toLowerCase();
  for (const phrase of BANNED_PHRASES) {
    if (lower.includes(phrase)) {
      fail(file, `banned phrase "${phrase}" — see CONTRIBUTING.md`);
      return;
    }
  }
}

// ---- Skill validator ----
async function validateSkill(skillDir: string, slug: string): Promise<void> {
  const errorsBefore = allErrors.length;
  const skillMd = join(skillDir, "SKILL.md");
  let raw: string;
  try {
    raw = await readFile(skillMd, "utf-8");
  } catch {
    fail(skillDir, "missing SKILL.md");
    return;
  }

  const { fm, body } = extractFrontmatter(raw);
  if (!fm) {
    fail(skillMd, "invalid or missing YAML frontmatter");
    return;
  }

  // name
  if (typeof fm.name !== "string") {
    fail(skillMd, "frontmatter.name is required and must be a string");
  } else {
    if (!SLUG_RE.test(fm.name)) fail(skillMd, `frontmatter.name "${fm.name}" must be lowercase, hyphenated, no consecutive/leading/trailing hyphens`);
    if (fm.name !== slug) fail(skillMd, `frontmatter.name "${fm.name}" must match directory name "${slug}"`);
    if (fm.name.length < 1 || fm.name.length > 64) fail(skillMd, "frontmatter.name must be 1–64 chars");
  }

  // description
  if (typeof fm.description !== "string") {
    fail(skillMd, "frontmatter.description is required and must be a string");
  } else {
    if (fm.description.length < 20) fail(skillMd, `frontmatter.description is too short (${fm.description.length} chars). Tell us *when* to use this skill.`);
    if (fm.description.length > 1024) fail(skillMd, `frontmatter.description exceeds 1024 chars (${fm.description.length})`);
    checkBannedPhrases(skillMd, fm.description);
  }

  // metadata.author
  const metadata = fm.metadata as Record<string, unknown> | undefined;
  if (!metadata || typeof metadata.author !== "string" || metadata.author.length === 0) {
    fail(skillMd, "frontmatter.metadata.author is required");
  }

  // body sanity — banned phrases
  if (body) checkBannedPhrases(skillMd, body);

  // body must not be empty for community submissions
  if (body.trim().length < 50) {
    fail(skillMd, "SKILL.md body is too short. Explain how to use this skill.");
  }

  // Allowed subdirectories only
  const entries = await readdir(skillDir, { withFileTypes: true });
  const allowedSubdirs = new Set(["scripts", "references", "assets"]);
  const allowedRootFiles = new Set(["SKILL.md", "DISPLAY.json", "README.md", ".gitignore"]);
  for (const entry of entries) {
    if (entry.isDirectory() && !allowedSubdirs.has(entry.name)) {
      fail(skillDir, `disallowed subdirectory "${entry.name}". Allowed: scripts/, references/, assets/`);
    }
    if (entry.isFile() && !allowedRootFiles.has(entry.name)) {
      fail(skillDir, `unexpected root file "${entry.name}". Allowed at root: SKILL.md, DISPLAY.json, README.md`);
    }
  }

  // Optional DISPLAY.json — if present, must be valid JSON
  const displayPath = join(skillDir, "DISPLAY.json");
  try {
    const displayRaw = await readFile(displayPath, "utf-8");
    try {
      JSON.parse(displayRaw);
    } catch {
      fail(displayPath, "DISPLAY.json is not valid JSON");
    }
  } catch {
    // not present — fine
  }

  if (allErrors.length === errorsBefore) pass(skillDir, "skill ok");
}

// ---- Persona validator ----
async function validatePersona(file: string, slug: string): Promise<void> {
  const errorsBefore = allErrors.length;
  const raw = await readFile(file, "utf-8");
  const { fm, body } = extractFrontmatter(raw);
  if (!fm) {
    fail(file, "missing or invalid YAML frontmatter");
    return;
  }
  if (typeof fm.name !== "string") fail(file, "frontmatter.name is required");
  else if (fm.name !== slug) fail(file, `frontmatter.name "${fm.name}" must match filename slug "${slug}"`);
  if (typeof fm.description !== "string" || fm.description.length < 20) {
    fail(file, "frontmatter.description must be at least 20 chars");
  } else {
    checkBannedPhrases(file, fm.description);
  }
  if (typeof fm.author !== "string" || fm.author.length === 0) {
    fail(file, "frontmatter.author is required");
  }
  if (body.trim().length < 100) fail(file, "persona body is too short — write the actual system prompt");
  checkBannedPhrases(file, body);
  if (allErrors.length === errorsBefore) pass(file, "persona ok");
}

// ---- Prompt validator ----
async function validatePrompt(file: string, slug: string): Promise<void> {
  const errorsBefore = allErrors.length;
  const raw = await readFile(file, "utf-8");
  const { fm, body } = extractFrontmatter(raw);
  if (!fm) {
    fail(file, "missing or invalid YAML frontmatter");
    return;
  }
  if (typeof fm.name !== "string") fail(file, "frontmatter.name is required");
  else if (fm.name !== slug) fail(file, `frontmatter.name "${fm.name}" must match filename slug "${slug}"`);
  if (typeof fm.description !== "string" || fm.description.length < 20) {
    fail(file, "frontmatter.description must be at least 20 chars");
  }
  if (typeof fm.author !== "string" || fm.author.length === 0) {
    fail(file, "frontmatter.author is required");
  }
  if (body.trim().length < 50) fail(file, "prompt body is too short");
  checkBannedPhrases(file, body);
  if (allErrors.length === errorsBefore) pass(file, "prompt ok");
}

// ---- Walk and dispatch ----
async function safeReadDir(dir: string) {
  try {
    return await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

async function main() {
  console.log("zo-garden validator\n");

  // Skills
  const skillEntries = await safeReadDir(SKILLS_DIR);
  let skillCount = 0;
  for (const entry of skillEntries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith(".") || entry.name === "_example") continue;
    if (!SLUG_RE.test(entry.name)) {
      fail(join(SKILLS_DIR, entry.name), `skill directory name "${entry.name}" must be lowercase-hyphenated`);
      continue;
    }
    await validateSkill(join(SKILLS_DIR, entry.name), entry.name);
    skillCount++;
  }

  // Personas
  const personaEntries = await safeReadDir(PERSONAS_DIR);
  let personaCount = 0;
  for (const entry of personaEntries) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    if (entry.name.startsWith("_") || entry.name === "README.md") continue;
    const slug = entry.name.replace(/\.md$/, "");
    if (!SLUG_RE.test(slug)) {
      fail(join(PERSONAS_DIR, entry.name), `persona filename slug "${slug}" must be lowercase-hyphenated`);
      continue;
    }
    await validatePersona(join(PERSONAS_DIR, entry.name), slug);
    personaCount++;
  }

  // Prompts
  const promptEntries = await safeReadDir(PROMPTS_DIR);
  let promptCount = 0;
  for (const entry of promptEntries) {
    if (!entry.isFile() || !entry.name.endsWith(".prompt.md")) continue;
    if (entry.name.startsWith("_")) continue;
    const slug = entry.name.replace(/\.prompt\.md$/, "");
    if (!SLUG_RE.test(slug)) {
      fail(join(PROMPTS_DIR, entry.name), `prompt filename slug "${slug}" must be lowercase-hyphenated`);
      continue;
    }
    await validatePrompt(join(PROMPTS_DIR, entry.name), slug);
    promptCount++;
  }

  console.log(`\nValidated: ${skillCount} skills, ${personaCount} personas, ${promptCount} prompts`);

  if (allErrors.length > 0) {
    console.error(`\n${allErrors.length} error(s):\n`);
    for (const e of allErrors) console.error(e);
    console.error("\nFailed. Fix the above and run `bun validate` again.\n");
    process.exit(1);
  }

  console.log("\nAll checks passed.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
