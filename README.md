<p align="center">
  <a href="https://github.com/Blazity/atlas">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/Blazity/atlas/main/assets/atlas-logo-dark.svg">
      <img alt="Atlas" src="https://raw.githubusercontent.com/Blazity/atlas/main/assets/atlas-logo-light.svg" width="202">
    </picture>
  </a>
</p>

<h1 align="center">Atlas Eve Starter</h1>

<p align="center">
  A clean Eve starter monorepo with Atlas AI documentation, memory, skills, and review gates built in.
</p>

---

Atlas Eve Starter is a small, reviewable template for building production-style Eve agents. It gives
you the starter wiring, repository structure, and AI-facing documentation defaults up front, so your
team can replace the example agent with real product behavior instead of first inventing the
project shape.

The repository is initialized with [Atlas](https://github.com/Blazity/atlas), Blazity's
framework-agnostic AI documentation scaffold. Atlas adds the `.ai/` workspace, shared agent
instructions, durable memory files, managed skills, artifact paths, and doctor/review gates that help
coding agents work from explicit project context.

## Why Use It

- 🗺️ **Atlas from the first commit**: best-practice AI documentation, memory, skills, and structural
  gates are already part of the repo.
- 🤖 **Eve-native setup**: the example app includes a replaceable Eve agent, deterministic tool, HTTP
  channel, and opt-in eval.
- 🧪 **Initial eval setup**: model-backed evals are ready for pre-PR or pre-publication confidence
  checks without becoming a hidden local workflow cost.
- 🧭 **Reviewable agent boundaries**: app behavior stays under `apps/*/agent`, while shared contracts
  live in explicit `packages/*` imports.
- 🧰 **Production-style defaults**: pnpm, Turborepo, TypeScript, Biome, Vitest, Husky, and lint-staged
  are wired from the start.
- 📦 **Multi-agent context setup**: Atlas keeps shared instructions, memory, skills, and artifacts
  in one place for every coding agent in the repo.

## Stack

- pnpm 11 workspace
- Turborepo
- Node 24.x
- TypeScript 6
- Biome
- Vitest
- Eve via `eve`
- Atlas AI documentation scaffold

## Install

Use Node 24 (`.node-version` and `.nvmrc` are included).

```bash
pnpm install
```

## Checks

Routine checks do not require model credentials:

```bash
pnpm check
pnpm typecheck
pnpm test
```

Pre-PR or pre-publication Eve check:

```bash
pnpm eve:build
```

`pnpm eval` is opt-in. It runs Eve eval sessions, can require provider credentials, and may spend
tokens. Keep it as a manual confidence check instead of a Husky hook, pre-commit check, or automatic
local workflow.

## Workspace

### `apps/example-agent`

A replaceable echo agent that demonstrates the starter wiring:

- `agent/agent.ts` for the root Eve agent definition
- `agent/instructions.md` for concise agent instructions
- `agent/tools/echo.ts` for deterministic tool behavior
- `agent/channels/http.ts` for a local HTTP ingress example
- `evals/example.eval.ts` for an opt-in Eve eval

The HTTP channel uses `auth: null` only because this is a local domain-neutral example. Add an
explicit auth/session model before adapting the route for production.

Run it locally:

```bash
pnpm --filter @repo/example-agent dev
```

### `.ai`

Atlas-managed AI context for the repository:

- `config.json` as the source of truth for artifact paths
- `LANGUAGE.md` for project vocabulary
- `memory/` for stable project context
- `plans/`, `research/`, `decisions/`, and `results/` for agent artifacts
- `skills/` for setup, review, and Eve-agent guidance

### `packages/example`

A tiny shared contract package used by the example app. Replace it with your own shared schemas or
remove it if your starter does not need a local package.

## What It Includes

- A working Eve example app with local HTTP ingress.
- A shared package pattern for contracts and schemas.
- Atlas-managed AI instructions, memory, skills, and artifact paths.
- Deterministic checks for formatting, linting, types, and tests.
- Manual Eve build and eval commands for higher-confidence review.
