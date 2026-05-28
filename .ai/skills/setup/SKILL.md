---
name: setup
description: Use when a repository needs AI Harness setup, repair/update, AGENTS.md refresh, AI memory refresh, vocabulary cleanup, or review after major codebase changes
---

# Set Up AI Harness

## Overview

Use this skill for first setup and later refreshes. The published CLI owns deterministic structure; this skill owns semantic repository understanding.

Humans and agents use the same deterministic entrypoint. Do not reimplement `init`, `doctor`, path repair, symlink repair, or managed file repair inside this skill. Call the CLI through `npx`.

## Bootstrap / Update Harness

Before inspecting repository meaning, announce the deterministic setup steps you are about to run.

From the repository root, run:

```bash
npx --yes @blazity-atlas/ai-harness@latest doctor
```

Then follow the CLI result:

- If AI Harness is missing or mostly uninitialized, run `npx --yes @blazity-atlas/ai-harness@latest init`.
- If `doctor` reports only fixable drift, run `npx --yes @blazity-atlas/ai-harness@latest doctor --fix`.
- If `doctor --fix` refuses because of a dirty worktree, stop and ask the user whether to commit, stash, or explicitly rerun with `--force`. Do not use `--force` automatically.
- If `doctor` reports manual conflicts, summarize those conflicts and stop before semantic setup.
- Rerun `npx --yes @blazity-atlas/ai-harness@latest doctor` after any init or fix command.
- Continue only when `doctor` exits clean.

If the current directory is not a git repository, stop and ask the user to run the skill from the repository root or initialize git first.

## Required Grounding

1. After the deterministic bootstrap is clean, read `.ai/config.json` and resolve every artifact location through it.
2. Inspect the repository before asking questions: README, package metadata, lockfiles, framework configs, existing docs, tests, and agent instructions.
3. Infer only obvious facts from code. Ask about product, domain, ownership, and workflow details that code cannot answer.
4. Mark unknowns explicitly instead of inventing facts.

## Customization Gate

After deterministic setup is clean and the repository has been inspected, ask whether the user wants standard setup or repository-specific AI Harness customization.

- If the user chooses standard setup, continue with the normal initial setup or refresh flow below.
- If the user chooses customization, or if their prompt already explicitly asks to customize AI Harness, read `customization.md` from this setup skill directory and follow that workflow.
- Do not read `customization.md` for a standard setup or refresh.

## Modes

### Initial Setup

Use when the harness is new or mostly empty. Build the first useful AI context for the repository.

### Refresh

Use after major codebase, architecture, dependency, command, or product changes. Compare existing AI context with the current repository and update only stale or missing facts.

## Interview Rules

- Ask one focused question at a time.
- Do not ask questions that repository inspection can answer.
- Recommend a default answer when asking the user to choose.
- Keep questions focused on facts that affect future agent behavior.

Good questions cover: product purpose, target users, current direction, deploy/runtime expectations, architectural invariants, common pitfalls, safe commands, branch/release workflow, domain vocabulary, and external systems.

## Outputs

- Keep `AGENTS.md` concise and high-signal. Preserve human content and the AI Harness managed block.
- Fill `.ai/LANGUAGE.md` with canonical terms and avoided synonyms.
- Fill `.ai/memory/product.md`, `.ai/memory/architecture.md`, and `.ai/memory/stack.md` with stable facts only.
- Append `.ai/memory/lessons.md` only for proven non-obvious pitfalls.
- Do not create new artifact roots. Use `.ai/config.json` paths.
- Run `npx --yes @blazity-atlas/ai-harness@latest doctor` again before reporting completion.

## Quality Bar

`AGENTS.md` should help an agent work safely within the first minute: what this repo is, how it is structured, what commands are safe, what rules matter, and what not to touch. Prefer short factual sections over long prose.
