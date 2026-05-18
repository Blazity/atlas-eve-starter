---
name: create-ash-agent
description: Use when adding a new Ash app, local Ash subagent, or reusable Ash agent package in this repository.
---

# Create Ash Agent

Start with alignment. Ask the structured questions in
`references/questions.md` before editing files unless the answers are already written in the task.

Then choose the smallest Ash surface that matches the requirement:

- Skill: optional guidance.
- Tool: deterministic typed execution.
- Hook: lifecycle context seeding/checking or stream-event observation.
- Subagent: separate specialist prompt, tools, and context.
- Package: behavior shared by multiple apps.

Use `templates/app-checklist.md` for a new app and `templates/subagent-checklist.md` for a local
subagent. Keep fixtures synthetic and app-local unless shared context is explicitly allowed.

Before reporting done, run the affected typecheck/test commands and note any Ash/API drift.
