# App Checklist

- Create `apps/<name>/package.json` and `tsconfig.json`.
- Add `agent/agent.ts` with model, metadata, and context-window override if needed.
- Add concise `agent/instructions.md`.
- Add root-only HTTP channel under `agent/channels/`.
- Add deterministic tools under `agent/tools/`.
- Add hooks under `agent/hooks/` only for lifecycle or event behavior.
- Add optional skills under `agent/skills/`.
- Add subagents under `agent/subagents/<id>/` when a specialist context is needed.
- Add synthetic fixtures under app-root `data/`, not under unsupported Ash slots.
- Add opt-in evals under `evals/`.
- Run affected `pnpm --filter <package> typecheck` and tests.
