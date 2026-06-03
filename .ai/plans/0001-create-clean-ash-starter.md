# Plan: Create A Clean Ash Starter

## Goal

Create a small, replaceable Ash starter that demonstrates the project shape and quality gates teams
should keep when building a real agent.

## Scope

- Keep one example Ash app under `apps/example-agent`.
- Keep one shared contract package under `packages/example`.
- Keep package names generic, such as `@repo/example`.
- Put deterministic behavior in tools or code, not prompt-only instructions.
- Keep Ash evals as explicit, opt-in, model-backed checks.
- Keep formatting, linting, typechecking, and unit tests as routine local checks.

## Verification

Run:

```bash
pnpm check
pnpm typecheck
pnpm test
pnpm ash:build
```

Do not run `pnpm eval` unless model-backed verification is explicitly requested.
