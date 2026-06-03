# Stack

## Runtime

- **Node 24.x** — pinned via `.node-version` and `.nvmrc`.
- **pnpm 10.12.4** — declared in `package.json`; workspace includes `apps/*` and `packages/*`.
- **Turborepo 2.9.x** — coordinates `typecheck`, `test`, `build`, `ash:build`, and `eval`.

## Language And Tooling

- **TypeScript 6** with `strict`, `verbatimModuleSyntax`, `noUncheckedIndexedAccess`, and
  `exactOptionalPropertyTypes`.
- **Biome 2.4.x** for formatting and linting. No Prettier or ESLint in this starter.
- **Vitest 4.1.x** for deterministic unit tests.
- **Husky + lint-staged** for strict local pre-commit checks once installed.

## Agent Framework

- **`experimental-ash@0.16.2`** — current Ash runtime package.
- `pnpm ash:build` is the pre-PR/publication Ash framework build check.
- `pnpm eval` is opt-in and may need provider credentials or spend tokens.

## Safe Commands

```bash
pnpm check
pnpm typecheck
pnpm test
pnpm ash:build
```

## Opt-In Commands

```bash
pnpm eval
```

Do not run evals as routine checks or in Husky hooks.
