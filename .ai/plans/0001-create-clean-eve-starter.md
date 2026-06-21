# Plan: Create A Clean Eve Starter

## Goal

Create a small, replaceable Eve starter that demonstrates the project shape and quality gates teams
should keep when building a real agent.

## Scope

- Keep one example Eve app under `apps/example-agent`.
- Keep one shared contract package under `packages/example`.
- Keep package names generic, such as `@repo/example`.
- Put deterministic behavior in tools or code, not prompt-only instructions.
- Keep Eve evals as explicit, opt-in, model-backed checks.
- Keep formatting, linting, typechecking, and unit tests as routine local checks.

## Verification

Run:

```bash
pnpm check
pnpm typecheck
pnpm test
pnpm eve:build
```

Do not run `pnpm eval` unless model-backed verification is explicitly requested.
