# Architecture

Authoritative human docs live at `docs/architecture.md` and `docs/deterministic-boundaries.md`.
This file captures the stable invariants an agent needs to know without reading those first.

## Monorepo Shape

- `apps/*` — independent Ash apps. Each owns its `agent/` root, fixtures (`data/`), `evals/`, and
  package manifest.
- `packages/*` — shared local workspace packages (`@blazity/*`), reusable building blocks rather
  than hidden global behavior.
- `docs/` — human architecture and onboarding docs.
- `.ai/` — AI Harness artifacts (memory, plans, research, decisions, skills, vocabulary).

## App Boundary

Each app under `apps/` has its own `agent/agent.ts`, `instructions.md`, `channels/`, `tools/`,
`hooks/`, `skills/`, `subagents/`, `lib/`, and `evals/`. App-local fixture data lives under
`apps/<app>/data/`, deliberately outside the Ash-authored `agent/` root so agents don't reach into
it as if it were part of the agent surface.

Apps must not import each other's tools, fixtures, subagents, or skills. Cross-app reuse goes
through a shared package.

## Package Boundary

- `@blazity/ash-plugin-governance` — deterministic prerequisite checks and hook helpers.
- `@blazity/ash-plugin-memory` — loads Markdown + frontmatter from explicit roots.
- `@blazity/ash-plugin-observability` — formats Ash stream events for local structured logging.
- `@blazity/ash-http-security` — shared HTTP channel hardening.
- `@blazity/company-context` — typed accessors over shared synthetic Markdown knowledge.

The `ash-plugin-*` naming is forward-looking. `experimental-ash@0.16.2` does not yet export
`experimental-ash/plugins`, so these packages currently expose normal Ash hook/tool/context
helpers. When the plugin subpath lands, the same behavior can be wrapped via `definePlugin`.

## Shared Context Boundary

Shared context must be **explicitly imported** by an app. The lead app calls
`@blazity/company-context`; the CV app does not implicitly receive it. This prevents accidental
context mixing and keeps each agent's knowledge surface reviewable.

Do not add hidden global context injection (e.g. a hook in a shared package that auto-loads
knowledge for every app).

## Subagent Boundary

Local subagents live under `agent/subagents/<id>/` with their own `agent.ts` and
`instructions.md`. Subagent `agent.ts` must include a `description` — Ash lowers that description
into the parent-visible delegation tool.

Subagents:

- Do not inherit parent history or sandbox state. The delegation message must carry everything the
  subagent needs.
- Can own tools, skills, hooks, lib code, sandbox files, and nested subagents.
- Cannot own root channels or schedules.

## Deterministic Boundary

Skills are on-demand guidance. They are not a guarantee that a required step happened. Required
work belongs in:

- **Tools** for typed executable behavior.
- **Hooks** for lifecycle context seeding/checking or stream-event observation.
- **Shared packages** for behavior reused across apps.

Example: the CV agent's scoring code loads the role rubric from authored code, not from prompt
text — that is what makes the score reproducible.

Strict long-running state machines (durable workflows) belong outside the free-form agent loop,
e.g. in Vercel Workflow/WDK with Ash triggering them through a tool or channel. The boundary is
documented; the WDK integration is not built in v1.

See [[product]] for what the apps actually do and [[stack]] for runtime versions and commands.
