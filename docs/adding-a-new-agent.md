# Adding A New Agent

Use `.ai/skills/create-ash-agent` before adding a new app, subagent, or reusable agent package. The
skill should produce a plan first; implementation should happen in a separate follow-up step.

## New App

1. Define the agent's purpose and non-goals.
2. Decide which behavior must be deterministic and belongs in tools, hooks, or shared code.
3. Create `apps/<agent-name>/package.json` and `tsconfig.json`.
4. Add `agent/agent.ts` and `agent/instructions.md`.
5. Add root-only `agent/channels/http.ts` if the app needs HTTP ingress.
6. Add tools for deterministic work.
7. Add hooks only when lifecycle checks or event observation are required.
8. Add app-local data outside `agent/` when fixtures are needed.
9. Add `evals/*.eval.ts` only for opt-in model-backed verification.

## New Subagent

Create `agent/subagents/<id>/agent.ts` and `instructions.md`. The subagent `agent.ts` must include a
`description`; Ash lowers that description into the parent-visible delegation tool.

Default to app-local subagents. Extract a subagent or shared package only when there is immediate
reuse, not just possible future reuse.

Subagents can have tools, skills, hooks, lib code, sandbox files, and nested subagents. They cannot
have root channels or schedules.

## Skill vs Tool vs Hook vs Subagent vs Package

- Use a skill for optional guidance.
- Use a tool for typed executable behavior.
- Use a hook for lifecycle checks or event observation.
- Use a subagent for a separate specialist context.
- Use a shared package when behavior or schemas are reused across apps.

## Review Questions

- Can a required step be performed deterministically instead of by the model?
- Are tool and channel permissions the minimum needed?
- Is auth, session, and state ownership explicit?
- Are evals opt-in and documented as model-backed?
- Are secrets and generated local state excluded from git?
