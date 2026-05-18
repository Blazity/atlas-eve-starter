# Deterministic Boundaries

Ash gives agents flexible model reasoning, tools, hooks, skills, channels, and subagents. Production
systems should decide which work belongs in deterministic code and which work can stay in the
agent loop.

## Skills Are Guidance

Skills are on-demand instructions. They are useful for optional procedures, routing hints, and
specialist guidance, but they are not a guarantee that a required operation happened.

## Required Steps Belong In Code

If a step is mandatory, put it in authored code:

- Tools execute typed business logic and API calls.
- Hooks seed or verify context around sessions and turns.
- Shared packages centralize reusable checks.
- Context keys make loaded state explicit.

In the CV app, scoring code loads the role rubric before scoring. This does not rely on prompt text.

## Hooks Can Seed Or Check Context

Lifecycle hooks can load context or fail fast before a turn. Stream-event hooks observe accepted
runtime events and are useful for local audit logs or metrics.

## Subagents Are Separate Specialist Contexts

Use a subagent when a task needs a distinct role, prompt, tool set, or sandbox. Do not use a
subagent just to load more instructions; a skill is cheaper when the root identity is enough.

## Durable Workflows

Strict long-running state machines should live outside the free-form agent loop, for example in
Vercel Workflow/WDK, with Ash triggering them through a tool or channel. This starter documents that
boundary but does not implement Workflow/WDK in v1.
