# Deterministic Boundaries

Ash gives agents flexible model reasoning, tools, hooks, skills, channels, evals, and subagents. A
starter should make the boundary between model behavior and deterministic code easy to review.

## Skills Are Guidance

Skills are on-demand instructions. They are useful for optional procedures, routing hints, and
specialist guidance. They are not proof that a required operation happened.

## Required Steps Belong In Code

If a step is mandatory, put it in authored code:

- Tools execute typed deterministic logic and API calls.
- Hooks seed or verify context around sessions and turns.
- Shared packages centralize reusable schemas and checks.

The example agent's echo response is built by `createEchoResponse`, not by prompt text. The model can
decide when to call the tool, but the response shape and length calculation are deterministic.

## Hooks Are For Lifecycle Boundaries

Use hooks when an app must seed context, fail fast before a turn, or observe accepted stream events.
Do not add hooks just to make the starter look feature-rich.

## Subagents Are Separate Specialist Contexts

Use a subagent when a task needs a distinct role, prompt, tool set, or sandbox. Do not use a subagent
just to load more instructions; a skill is cheaper when the root identity is enough.

## Evals Are Opt-In

Ash evals are useful for model-backed behavior checks, but they may need provider credentials and
spend tokens. Keep them as explicit commands such as `pnpm eval`, never as pre-commit or automatic
local checks.
