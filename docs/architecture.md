# Architecture

## Why A Monorepo

`atlas-ash-starter` is a monorepo because the examples are separate Ash apps but share operating
patterns. The workspace keeps app boundaries visible while letting local packages carry reusable
governance, memory, observability, and shared context code.

## pnpm And Turborepo

pnpm gives deterministic workspace linking for `@blazity/*` packages. Turborepo coordinates
typecheck, test, build, Ash build, and eval tasks without hiding each package's local scripts.

## App Boundaries

Each app under `apps/` has its own `agent/` root, HTTP channel, instructions, tools, hooks, skills,
subagents, fixtures, and evals. App-local fixture data stays under that app's app-root `data/`
directory, outside the Ash-authored `agent/` slots.

The examples are intentionally independent:

- `cv-review-agent` owns CV fixtures, role fixtures, candidate review tools, and CV subagents.
- `lead-enrichment-agent` owns lead fixtures and lead enrichment tools.

## Package Boundaries

Shared packages under `packages/` are reusable building blocks, not hidden global behavior:

- `@blazity/ash-plugin-governance` exposes deterministic prerequisite checks and hook helpers.
- `@blazity/ash-plugin-memory` loads Markdown/frontmatter from explicit roots.
- `@blazity/ash-plugin-observability` formats Ash stream events for local structured logging.
- `@blazity/company-context` exposes typed helpers for shared synthetic Markdown knowledge.

## Shared Context Boundary

Shared context must be imported explicitly. The lead app calls `@blazity/company-context`; the CV
app does not receive that context implicitly. This prevents accidental context mixing and makes each
agent's knowledge surface reviewable.

## Plugin Boundary

Current docs include a v1-ready plugin research spec, but `experimental-ash@0.16.2` does not yet
export `experimental-ash/plugins`. The local packages therefore expose Ash hook/tool/context helper
surfaces that apps can register through normal Ash slots today. When the plugin subpath lands, these
packages can wrap the same core behavior with `definePlugin`.

## Subagent Boundary

Local subagents live under `agent/subagents/<id>/`. Each subagent has its own `agent.ts`,
`instructions.md`, tools, skills, and context. Parent agents must pass enough information in the
delegation message because subagents do not inherit parent history or sandbox state.
