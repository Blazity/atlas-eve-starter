# AI Harness Customization

Use this file only after the user explicitly chooses repository-specific AI Harness customization.

## Purpose

Customization adapts the installed harness to the repository's working style after the CLI has created a valid deterministic baseline.

The CLI owns templates, paths, managed files, symlinks, and repair behavior. This workflow owns user preferences, team conventions, and project-specific agent guidance.

## Ground Rules

- Read `.ai/config.json` before proposing file changes.
- Preserve human-authored content outside managed blocks.
- Ask one focused question at a time.
- Prefer concrete choices with a recommended default.
- Do not invent product, ownership, deployment, or workflow facts.
- Do not create new artifact roots unless the user explicitly asks for them.
- If customization changes artifact paths, update `.ai/config.json` first and run `doctor` before moving files.

## Interview Areas

Ask only for information that affects future agent behavior.

Good customization topics:

- artifact layout preferences;
- enabled workflow areas: plans, research, decisions, ADRs, results, memory, vocabulary, and local skills;
- preferred agent strictness: lightweight, standard, or strict;
- supported agent surfaces: AGENTS, Claude, Cursor, or generic local skills;
- project type: app, library, monorepo, agency/client project, or custom;
- safe commands and commands that require approval;
- branch, release, deployment, and QA expectations;
- domain vocabulary and avoided terminology;
- project-specific local skills the team wants agents to use.

## Template Awareness

Inspect `template` in `.ai/config.json` when present.

- `standard`: keep guidance general and concise.
- `library`: emphasize public API stability, examples, release notes, compatibility, and documentation.
- `app`: emphasize runtime behavior, environment variables, deployment, QA evidence, and product context.
- `monorepo`: emphasize package boundaries, workspace commands, shared contracts, and cross-package blast radius.
- `agency`: emphasize client context, handoff notes, decision history, vocabulary, and delivery constraints.

Templates are starting points. If the repository needs a different shape, ask before changing `.ai/config.json`.

## Update Targets

Use configured paths, not hardcoded locations.

- `AGENTS.md`: concise repo-level rules, commands, invariants, and safety boundaries.
- `LANGUAGE.md`: canonical project terms and avoided synonyms.
- `memory/product.md`: stable product, user, business, or client facts.
- `memory/architecture.md`: stable architecture facts, boundaries, and invariants.
- `memory/stack.md`: runtime, package manager, framework, test, and deployment facts.
- `memory/lessons.md`: only proven, non-obvious pitfalls.
- `skills/`: optional project-local skills requested by the user.

## Completion

After applying customization:

1. Run `npx --yes @blazity-atlas/ai-harness@latest doctor`.
2. Stop if doctor reports manual conflicts.
3. Summarize the customization choices and files changed.
