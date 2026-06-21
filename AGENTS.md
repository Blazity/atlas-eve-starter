# Project AI Instructions

## What This Repo Is

`atlas-eve-starter` is a clean Eve starter monorepo. It demonstrates strict, production-style agent
defaults without embedding a domain-specific app.

The repository is generic. Do not add real customers, credentials, third-party integration data,
private company records, or internal-only context.

Status: the Eve runtime is installed from the `eve` package. Let pnpm's default
minimum-release-age gate choose the installable version; on 2026-06-21 this resolves to
`eve@0.11.8`.

## Layout

- `apps/example-agent` — replaceable echo agent used as a smoke example.
- `packages/example` — replaceable shared contract package used by the example agent. It has no Eve
  dependency.
- `.ai/` — AI Harness artifacts, memory, decisions, plans, and repo-local skills.

## Boundaries

- App behavior lives under `apps/<app>/agent/`.
- App-local data, when needed, lives outside `agent/`, usually under `apps/<app>/data/`.
- Shared behavior or schemas live in explicit `packages/*` imports. Do not add hidden global context.
- Required steps belong in tools, hooks, or code. Skills are guidance only and must not be
  load-bearing.
- Subagents, when added, live under `agent/subagents/<id>/`. They do not inherit parent history or
  sandbox state, and cannot own root channels or schedules.

## Safe Commands

Default checks need no model credentials:

```bash
pnpm check
pnpm typecheck
pnpm test
pnpm eve:build
```

`pnpm eval` is opt-in. It runs Eve eval sessions, needs provider credentials, and may incur model
cost. Do not run it as part of routine checks, Husky hooks, or automatic local workflows.

## Conventions

- pnpm 11 workspace, Turborepo, Node 24.x, TypeScript 6 with `strict`, `verbatimModuleSyntax`,
  `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes`.
- Biome for format and lint: double quotes, trailing commas, 2-space indent, 100 col.
- Package names use generic starter scopes such as `@repo/example`. Do not brand template packages
  with internal company scopes.
- Conventional commits with a scope, for example `refactor(starter): simplify eve template`.

## Where To Look First

- `README.md` — quick starter overview and commands.
- `.ai/skills/create-eve-agent/SKILL.md` — design-first skill for planning Eve agent additions.

<!-- BEGIN AI-HARNESS: artifact-paths -->
## AI Harness Artifact Paths

`.ai/config.json` is the source of truth for AI artifact locations in this repository.
Before writing plans, research, decisions, ADRs, results, memory, vocabulary, or skill outputs, resolve the destination through `artifactRoot`, `paths`, and `pathAliases`.
If an imported skill, template, or instruction mentions a different path, map it through `.ai/config.json` before reading or writing files.
Do not create new documentation roots unless `.ai/config.json` explicitly allows them.
<!-- END AI-HARNESS: artifact-paths -->
