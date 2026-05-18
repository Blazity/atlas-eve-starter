# Adding A New Agent

Use `.agents/skills/create-ash-agent` before adding a new app or subagent.

## New App

1. Create `apps/<agent-name>/package.json` and `tsconfig.json`.
2. Add `agent/agent.ts` and `agent/instructions.md`.
3. Add root-only `agent/channels/http.ts` if the app needs HTTP ingress.
4. Add app-local `data/` fixtures outside the Ash-authored `agent/` root.
5. Add tools for deterministic work.
6. Add hooks for lifecycle checks or observability.
7. Add skills only for optional guidance.
8. Add `evals/*.eval.ts` for opt-in behavior checks.

## New Subagent

Create `agent/subagents/<id>/agent.ts` and `instructions.md`. The subagent `agent.ts` must include a
`description`; Ash lowers that description into the parent-visible delegation tool.

Subagents can have tools, skills, hooks, lib code, sandbox files, and nested subagents. They cannot
have root channels or schedules.

## Skill vs Tool vs Hook vs Subagent vs Package

- Use a skill for optional guidance.
- Use a tool for typed executable behavior.
- Use a hook for lifecycle seeding/checking or event observation.
- Use a subagent for a separate specialist context.
- Use a shared package when behavior should be reused across apps.

## Avoid Context Mixing

Keep app-local fixtures under the app root. Put reusable synthetic knowledge in a shared package and
import it explicitly. Do not add hidden global context injection.
