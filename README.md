# atlas-eve-starter

✨ A clean Eve starter monorepo for building production-style agents without domain-specific
baggage.

The promise is simple: start from a small, reviewable template that already encodes practical agent
defaults, then replace the example with your own agent. It gives teams enough structure to move
quickly without hiding behavior in prompts, bundling plugins, or shipping a domain-specific demo
that has to be deleted first.

This repository contains no real customers, credentials, third-party integration data, private
company records, or domain fixtures.

## Why Use It

- 🧭 **Clear agent boundaries**: app behavior lives under `apps/*/agent`, while shared contracts
  live in explicit `packages/*` imports.
- 🧰 **Strict starter defaults**: pnpm, Turborepo, TypeScript, Biome, Vitest, Husky, and
  lint-staged are wired from the first commit.
- 🧪 **Checks that fit daily work**: `pnpm check`, `pnpm typecheck`, and `pnpm test` run without
  model credentials.
- 🤖 **Eve-native example**: the starter includes one replaceable echo agent with instructions,
  a deterministic tool, an HTTP channel, and a tiny eval.
- 📦 **Monorepo-ready shape**: the example package shows how to share schemas or contracts without
  making every package depend on Eve.
- 🔐 **Permission-aware workflow**: agent authors are prompted to review tools, channels, auth,
  state, and deterministic boundaries before adding complexity.
- 💸 **Opt-in evals**: model-backed Eve evals are available as a manual verification layer, not a
  hidden pre-commit cost.
- 🧹 **Generic by design**: no real customer data, no internal company context, no durable memory
  plugin, no observability plugin, and no production integration assumptions.

## Stack

- pnpm 11 workspace
- Turborepo
- Node 24.x
- TypeScript 6
- Biome
- Vitest
- Eve via `eve`

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
tokens. Do not put it in Husky hooks, pre-commit checks, or automatic local workflows.

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

### `packages/example`

A tiny shared contract package used by the example app. It intentionally has no Eve dependency.
Replace it with your own shared schemas or remove it if your starter does not need a local package.

## Starter Defaults

- App behavior stays under each app's `agent/` root.
- Shared code lives in explicit `packages/*` imports.
- Required behavior belongs in tools, hooks, or code, not prompt-only text.
- Skills are optional guidance and should not be load-bearing.
- Unit tests cover deterministic code with Vitest.
- Eve evals are model-backed/manual verification, not routine checks.
- Biome is the formatter and linter. Prettier and ESLint are not included.
