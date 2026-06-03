# Architecture

## Why A Monorepo

This starter keeps a monorepo shape even though it begins with one app. The point is to make the
future app/package boundary obvious from the first commit: apps own Ash behavior, packages own
explicit shared code.

## pnpm And Turborepo

pnpm gives deterministic workspace linking for generic `@repo/*` packages. Turborepo coordinates
workspace checks without hiding each package's local scripts.

## App Boundary

Apps live under `apps/*`. Each app owns its Ash `agent/` root:

- `agent/agent.ts`
- `agent/instructions.md`
- `agent/tools/*`
- `agent/channels/*`
- optional `agent/hooks/*`
- optional `agent/subagents/*`

The starter includes `apps/example-agent`, a replaceable echo app. It is intentionally small and
domain-neutral.

The example HTTP channel is unauthenticated only as a local demo default. Production apps should
make auth, session ownership, and state boundaries explicit before exposing routes.

## Package Boundary

Packages live under `packages/*`. They are explicit local imports, not hidden global behavior.

The starter includes `packages/example`, a tiny schema/type package used by the example app. It has
no Ash dependency. Replace it with real shared contracts or remove it when a single app does not
need shared code.

## Deterministic Boundary

Required behavior belongs in deterministic code:

- tools for typed executable behavior
- hooks for lifecycle checks or event observation
- shared packages for reusable logic and schemas

Skills are guidance only. They can help an agent or developer follow a process, but they must not be
the only place a required behavior is enforced.

## Subagent Boundary

Local subagents, when added, live under `agent/subagents/<id>/`. Each subagent has its own
`agent.ts`, `instructions.md`, tools, skills, and context.

Subagents do not inherit parent history or sandbox state. Parent agents must pass enough
information in the delegation message. Subagents cannot own root channels or schedules.

## Plugin Boundary

Durable memory and observability plugins are intentionally outside this starter. They should live in
separate repositories and have their own manual testing and release process.

If this template later references plugins, keep those references as opt-in integrations rather than
built-in starter dependencies.
