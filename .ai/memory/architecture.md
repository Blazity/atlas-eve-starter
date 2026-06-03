# Architecture

Authoritative human docs live at `docs/architecture.md` and `docs/deterministic-boundaries.md`.
This file captures stable invariants for AI agents working in this repo.

## Monorepo Shape

- `apps/example-agent` — replaceable domain-neutral Ash app.
- `packages/example` — replaceable shared schema/type package with no Ash dependency.
- `docs/` — human architecture and onboarding docs.
- `.ai/` — AI Harness artifacts, memory, plans, research, decisions, and repo-local skills.

## Boundaries

- Apps own Ash behavior under `apps/<app>/agent/`.
- Shared code must be imported explicitly from `packages/*`.
- Required behavior belongs in tools, hooks, or code, not prompt-only instructions.
- Skills are optional guidance and must not be load-bearing.
- Subagents, when added, are app-local by default and do not inherit parent history or sandbox
  state.

## Optional Integration Boundary

Runtime plugins and external integrations are out of scope for this starter. Keep them in separate
repositories or add them later as explicit opt-in integrations.

See [[product]] for the starter purpose and [[stack]] for runtime versions and commands.
