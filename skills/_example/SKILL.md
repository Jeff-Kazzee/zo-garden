---
name: _example
description: A reference skill showing the structure and frontmatter that zo-garden requires. Use this as the starting template when contributing a new skill. Replace every field below before submitting — the validator skips this directory but a real skill must pass.
compatibility: Created for Zo Computer
metadata:
  author: jeffkazzee.zo.computer
allowed-tools: Bash Read
---

# _example

This is the reference skill. Copy this whole directory to `skills/<your-slug>/` and replace everything.

## When to use this skill

Describe the triggers. What does a user have to ask for, or what does the environment have to look like, for the agent to activate this skill? Be concrete.

Bad: "When the user needs help with data."
Good: "When the user mentions 'cancel subscriptions', 'audit subscriptions', or 'find recurring charges', and has a bank transaction CSV available."

## How it works

Walk through the workflow. If there are scripts in `scripts/`, name them and describe what they do. If there are reference docs in `references/`, point to them.

## Prerequisites

- Required environment variables (document them, never hardcode values)
- Required tools or dependencies
- Any one-time setup the user has to do

## Examples

Show one or two concrete examples of how an agent would use this skill in a real session. Sample prompts and expected outcomes go a long way.

## Limitations

Be honest about what this skill can't do. Hiding limitations is how registries get a reputation for being unreliable.
