# Project AI Instructions

## What This Repo Is

`atlas-ash-starter` is an Ash starter monorepo demonstrating production-style agent patterns. All
data is synthetic — no real candidates, leads, customers, credentials, Slack data, or Blazity
records.

Status: the `experimental-ash` runtime and the `packages/ash-plugin-*` packages are experimental.
Before public release they should be replaced with non-experimental equivalents; if an experimental
dependency reaches a stable release after publication, replace it then.

## Layout

- `apps/cv-review-agent` — CV review with three subagents (evidence extraction, role-fit scoring,
  compliance review) and Slack delivery via Vercel Connect.
- `apps/lead-enrichment-agent` — lead enrichment that explicitly imports
  `@blazity/company-context`.
- `packages/ash-plugin-{governance,memory,observability}` — Ash hook/tool/context helpers. Named
  "plugin" but not yet wired as `definePlugin` because `experimental-ash@0.16.2` does not export
  `experimental-ash/plugins`.
- `packages/ash-http-security` — shared HTTP channel hardening.
- `packages/company-context` — typed accessors over shared synthetic Markdown knowledge.
- `docs/` — architecture, deterministic boundaries, per-agent setup, Ash note.

## Boundaries (Load-Bearing)

- App-local fixtures live under `apps/<app>/data/`, outside the Ash-authored `agent/` root.
- Shared context is **explicitly imported** by each app. No hidden global context injection.
- Required steps live in tools or hooks. Skills are guidance only and must not be load-bearing.
- Subagents live under `agent/subagents/<id>/` and do not inherit parent history or sandbox — the
  delegation message must carry everything the subagent needs.
- Subagents cannot own root channels or schedules.

## Safe Commands

Default checks need no model credentials:

```
pnpm check         # Biome format + lint
pnpm typecheck     # turbo typecheck across workspace
pnpm test          # turbo test (Vitest)
pnpm build         # turbo build
pnpm ash:build     # turbo ash:build
```

`pnpm eval` is **opt-in**: it runs Ash eval sessions, needs provider credentials, and may incur
model cost. Do not run it as part of routine checks.

## Conventions

- pnpm 10 workspace, Turborepo, Node 24.x, TypeScript 6 with `strict`, `verbatimModuleSyntax`,
  `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`.
- Biome for format + lint (double quotes, trailing commas, 2-space indent, 100 col).
- Conventional commits with a scope (`feat(cv): …`, `fix(agent): …`, `docs(starter): …`,
  `chore(repo): …`).

## Where To Look First

- `docs/architecture.md` — monorepo, app, package, and subagent boundaries.
- `docs/deterministic-boundaries.md` — skill-vs-tool-vs-hook decision rules.
- `docs/adding-a-new-agent.md` — checklist for new app or subagent.
- `.ai/skills/create-ash-agent/SKILL.md` — the agent-side skill for adding a new Ash app or
  subagent.

<!-- BEGIN AI-HARNESS: artifact-paths -->
## AI Harness Artifact Paths

`.ai/config.json` is the source of truth for AI artifact locations in this repository.
Before writing plans, research, decisions, ADRs, results, memory, vocabulary, or skill outputs, resolve the destination through `artifactRoot`, `paths`, and `pathAliases`.
If an imported skill, template, or instruction mentions a different path, map it through `.ai/config.json` before reading or writing files.
Do not create new documentation roots unless `.ai/config.json` explicitly allows them.
<!-- END AI-HARNESS: artifact-paths -->
