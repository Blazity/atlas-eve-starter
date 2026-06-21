# App Checklist

- Create `apps/<name>/package.json` and `tsconfig.json`.
- Add `agent/agent.ts` with model, metadata, and context-window override if needed.
- Add concise `agent/instructions.md`.
- Add root-only HTTP channel under `agent/channels/`.
- Add deterministic tools under `agent/tools/`.
- Add hooks under `agent/hooks/` only for lifecycle or event behavior.
- Add optional skills under `agent/skills/`.
- Add subagents under `agent/subagents/<id>/` when a specialist context is needed.
- Add synthetic fixtures under app-root `data/`, not under unsupported Eve slots.
- Add opt-in evals under `evals/`.
- Document why required steps live in tools, hooks, or shared code instead of prompt-only text.
- Write an ADR only for durable architectural decisions.
- Run affected `pnpm --filter <package> typecheck` and tests.
- Do not run `pnpm eval` unless the user explicitly opts into model-backed verification.
