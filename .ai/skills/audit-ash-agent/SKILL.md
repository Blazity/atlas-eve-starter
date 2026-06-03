---
name: audit-ash-agent
description: Use when reviewing Ash agent changes, auditing permissions/security, or after meaningful changes to agent instructions, tools, channels, subagents, hooks, or shared agent packages.
---

# Audit Ash Agent

Review Ash agent work for core starter risks. Keep the review practical and evidence-backed.

## Workflow

1. Read the changed app, package, and `.ai` skill files.
2. Run affected `pnpm check`, `pnpm typecheck`, and `pnpm test` commands when implementation has
   changed.
3. Inspect whether required behavior lives in tools, hooks, or code rather than prompt-only text.
4. Inspect tool and channel permissions for minimum necessary access.
5. Inspect subagent boundaries and whether shared extraction is intentional.
6. Inspect auth, session, and state ownership choices.
7. Confirm deterministic tests exist and Ash evals remain opt-in.
8. Confirm secrets and generated local state stay out of git.

## Output

Lead with findings. Classify each as confirmed, plausible risk, or acceptable demo-only choice.
Include file references and exact follow-up actions.
