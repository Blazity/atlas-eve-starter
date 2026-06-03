---
name: create-ash-agent
description: Use when adding a new Ash app, local Ash subagent, or reusable Ash agent package in this repository.
---

# Create Ash Agent

This is a design-first skill. Do not start implementation in the same session unless the user
explicitly overrides that after reviewing the plan.

Start with alignment. Ask the structured questions in `references/questions.md` before proposing
files unless the answers are already written in the task.

Then choose the smallest Ash surface that matches the requirement:

- Skill: optional guidance.
- Tool: deterministic typed execution.
- Hook: lifecycle context seeding/checking or stream-event observation.
- Subagent: separate specialist prompt, tools, and context.
- Package: behavior shared by multiple apps.

Write the plan/checklist through the paths configured in `.ai/config.json`. If an imported template
or instruction mentions another folder, map it through `.ai/config.json` first.

Use `templates/app-checklist.md` for a new app and `templates/subagent-checklist.md` for a local
subagent. Keep fixtures synthetic and app-local unless shared context is explicitly allowed. Default
subagents to app-local unless immediate reuse clearly justifies a shared package.

Write an ADR only when the design creates a durable architectural decision, such as a new app
boundary, shared package, subagent extraction, auth/session ownership model, or non-obvious
deterministic boundary.

End the session with explicit instructions for how to trigger implementation, for example:

```text
To implement this plan, start a new session and say:
"Implement .ai/plans/<plan-file>.md. Do not run pnpm eval unless I explicitly ask."
```

Mention the affected verification commands that implementation should run. Keep `pnpm eval` clearly
marked as opt-in/model-backed.
