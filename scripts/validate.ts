#!/usr/bin/env bun
/**
 * zo-garden validator
 *
 * Reads INDEX.md and enforces the link-directory quality bar:
 *   - Entry lines under H2 sections must match the expected format
 *   - URLs must be absolute http(s)
 *   - No duplicate URLs across the whole index
 *   - No banned slop phrases anywhere in the file
 *
 * Exits non-zero if anything fails. CI runs this on every PR.
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const INDEX = join(ROOT, "INDEX.md");

// Banned phrases. Case-insensitive substring match.
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

// An entry line looks like:  - [Name](https://url) — Description. *(author)*
// The em-dash is required; the *(author)* tag is optional but encouraged.
const ENTRY_RE = /^- \[([^\]]+)\]\((https?:\/\/[^\s)]+)\)\s+—\s+(.+?)(?:\s+\*\(([^)]+)\)\*)?\s*$/;

// Placeholder lines we tolerate inside an empty section.
const PLACEHOLDER_RE = /^_No community entries yet\..*$/;

// HTML comment lines (format hints) we ignore.
const COMMENT_RE = /^\s*<!--.*-->\s*$/;

const errors: string[] = [];
const fail = (line: number, msg: string) => errors.push(`  ✗ INDEX.md:${line}: ${msg}`);

function checkBanned(line: number, text: string) {
  const lower = text.toLowerCase();
  for (const phrase of BANNED_PHRASES) {
    if (lower.includes(phrase)) {
      fail(line, `banned phrase "${phrase}" — see CONTRIBUTING.md`);
      return;
    }
  }
}

async function main() {
  let raw: string;
  try {
    raw = await readFile(INDEX, "utf-8");
  } catch {
    console.error("INDEX.md not found at repo root");
    process.exit(1);
  }

  const lines = raw.split("\n");
  const seenUrls = new Map<string, number>();
  let currentSection: string | null = null;
  let entryCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNo = i + 1;

    // Track section headers
    const h2 = line.match(/^## (.+)$/);
    if (h2) {
      currentSection = h2[1].trim();
      continue;
    }

    // Skip blank / horizontal rule / regular paragraphs / comments / placeholders
    if (line.trim() === "" || line.trim() === "---") continue;
    if (COMMENT_RE.test(line)) continue;
    if (PLACEHOLDER_RE.test(line.trim())) continue;

    // Entry candidates start with "- ["
    if (!line.startsWith("- [")) continue;

    const m = line.match(ENTRY_RE);
    if (!m) {
      fail(lineNo, `entry doesn't match expected format. Use:  - [Name](https://url) — Description. *(author)*`);
      continue;
    }

    const [, name, url, description, author] = m;

    // Duplicate URL check
    const normalized = url.replace(/\/+$/, "").toLowerCase();
    if (seenUrls.has(normalized)) {
      fail(lineNo, `duplicate URL — already listed on line ${seenUrls.get(normalized)}`);
    } else {
      seenUrls.set(normalized, lineNo);
    }

    // Description length sanity
    if (description.trim().length < 15) {
      fail(lineNo, `description is too short (${description.trim().length} chars). Say *when or why* a Zo user should care.`);
    }
    if (description.trim().length > 280) {
      fail(lineNo, `description exceeds 280 chars (${description.trim().length}). Tighten it.`);
    }

    // Banned phrases — name + description + author
    checkBanned(lineNo, name);
    checkBanned(lineNo, description);
    if (author) checkBanned(lineNo, author);

    // Description should end with punctuation
    const lastChar = description.trim().slice(-1);
    if (![".", "!", "?"].includes(lastChar)) {
      fail(lineNo, `description should end with a period.`);
    }

    entryCount++;
    void currentSection; // currentSection is informational; kept for future per-section rules
  }

  // Whole-file banned phrase pass (catches anything outside entry lines)
  const wholeFileLower = raw.toLowerCase();
  const headerEnd = raw.indexOf("##"); // skip prologue before sections? Actually, scan everything.
  for (const phrase of BANNED_PHRASES) {
    let idx = wholeFileLower.indexOf(phrase);
    while (idx !== -1) {
      // Convert idx to line number
      const upto = raw.slice(0, idx);
      const lineNo = upto.split("\n").length;
      const lineText = lines[lineNo - 1] ?? "";
      // Skip lines we already validated as entries (they have their own check)
      if (!ENTRY_RE.test(lineText)) {
        fail(lineNo, `banned phrase "${phrase}" — see CONTRIBUTING.md`);
      }
      idx = wholeFileLower.indexOf(phrase, idx + phrase.length);
    }
    void headerEnd;
  }

  if (errors.length > 0) {
    console.error(`\nzo-garden validate: ${errors.length} problem(s):\n`);
    for (const err of errors) console.error(err);
    console.error("");
    process.exit(1);
  }

  console.log(`✓ INDEX.md is clean (${entryCount} entries, ${seenUrls.size} unique URLs)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
