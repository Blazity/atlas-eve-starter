# atlas-ash-starter

Clean Ash starter monorepo for building production-style agents without domain-specific baggage.
It keeps the first app intentionally small so teams can replace it with their own agent while
retaining strict defaults, explicit boundaries, and reviewable AI Harness artifacts.

This repository contains no real customers, credentials, third-party integration data, private
company records, or domain fixtures.

## Stack

- pnpm 10 workspace
- Turborepo
- Node 24.x
- TypeScript 6
- Biome
- Vitest
- Ash via `experimental-ash`

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

Pre-PR or pre-publication Ash check:

```bash
pnpm ash:build
```

`pnpm eval` is opt-in. It runs Ash eval sessions, can require provider credentials, and may spend
tokens. Do not put it in Husky hooks, pre-commit checks, or automatic local workflows.

## Workspace

### `apps/example-agent`

A replaceable echo agent that demonstrates the starter wiring:

- `agent/agent.ts` for the root Ash agent definition
- `agent/instructions.md` for concise agent instructions
- `agent/tools/echo.ts` for deterministic tool behavior
- `agent/channels/http.ts` for a local HTTP ingress example
- `evals/example.eval.ts` for an opt-in Ash eval

The HTTP channel uses `auth: null` only because this is a local domain-neutral example. Add an
explicit auth/session model before adapting the route for production.

Run it locally:

```bash
pnpm --filter @repo/example-agent dev
```

### `packages/example`

A tiny shared contract package used by the example app. It intentionally has no Ash dependency.
Replace it with your own shared schemas or remove it if your starter does not need a local package.

## Starter Defaults

- App behavior stays under each app's `agent/` root.
- Shared code lives in explicit `packages/*` imports.
- Required behavior belongs in tools, hooks, or code, not prompt-only text.
- Skills are optional guidance and should not be load-bearing.
- Unit tests cover deterministic code with Vitest.
- Ash evals are model-backed/manual verification, not routine checks.
- Biome is the formatter and linter. Prettier and ESLint are not included.

## Not Included

- Domain-specific examples
- Durable memory plugin
- Observability plugin
- Auth provider
- Database or vector store
- Production credentials
- Deployment-specific webhook setup

See [docs/architecture.md](./docs/architecture.md),
[docs/adding-a-new-agent.md](./docs/adding-a-new-agent.md), and
[docs/deterministic-boundaries.md](./docs/deterministic-boundaries.md) for the starter decisions.
