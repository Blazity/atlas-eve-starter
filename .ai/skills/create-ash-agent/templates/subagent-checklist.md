# Subagent Checklist

- Create `agent/subagents/<id>/agent.ts`.
- Include a clear `description` in `defineAgent`.
- Add `instructions.md` focused on one specialist responsibility.
- Add only the tools this subagent should use.
- Add optional skills when guidance would bloat instructions.
- Do not add `channels/` or `schedules/` inside local subagents.
- Pass required parent context in the delegation message; do not assume inherited history.
- Keep the subagent app-local unless immediate reuse justifies a shared package.
- Document deterministic tool/code boundaries for any required subagent step.
