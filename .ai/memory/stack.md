# Stack

## Runtime

- **Node 24.x** — pinned via `.node-version` and `.nvmrc`. `@types/node` is locked to `24.12.4`
  through a pnpm override.
- **pnpm 10.12.4** — declared in `package.json` `packageManager`. Workspace defined in
  `pnpm-workspace.yaml` (`apps/*`, `packages/*`).
- **Turborepo 2.9.x** — coordinates `typecheck`, `test`, `build`, `ash:build`, and `eval` tasks.
  Each task depends on `^build`. `eval` has `cache: false`.

## Language & Tooling

- **TypeScript 6** with strict settings inherited from `tsconfig.base.json`:
  `strict`, `verbatimModuleSyntax`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`,
  `module: NodeNext`, `target: ES2024`.
- **Biome 2.4.x** for both formatting and linting. Style: 2-space indent, 100 col line width,
  double quotes, trailing commas, `useIgnoreFile: true`.
- **Vitest 4.1.x** for unit/integration tests under each package.

## Agent Framework

- **`experimental-ash@0.16.2`** — the Ash runtime. The plugin subpath
  (`experimental-ash/plugins`) is **not yet exported** at this version, which is why the
  `packages/ash-plugin-*` packages expose hook/tool/context helpers rather than `definePlugin`
  outputs.

## Safe Commands (No Credentials Required)

```
pnpm check         # Biome format + lint
pnpm typecheck     # turbo typecheck
pnpm test          # turbo test (Vitest)
pnpm build         # turbo build
pnpm ash:build     # turbo ash:build
pnpm format        # Biome format --write
pnpm lint          # Biome lint
```

Per-app dev servers:

```
pnpm --filter @blazity/cv-review-agent dev
pnpm --filter @blazity/lead-enrichment-agent dev
```

## Opt-In Commands (Credentials, Cost)

```
pnpm eval          # turbo eval — runs Ash eval sessions, needs provider credentials, may cost money
```

`pnpm eval` is intentionally excluded from default CI. Do not run it as a routine check.

## Ignored / Generated Paths

- `node_modules/`, `.turbo/`, `.ash/`, `.output/`, `apps/*/.output/`, `dist/`, `coverage/`.
- `.ash/evals/**` is the eval output cache for the `eval` Turbo task.
- `.env`, `.env.*` everywhere except `.env.example` files — never commit secrets.
- `.vercel/`, `.workflow-data/`, `.vscode/`.

See [[architecture]] for boundaries the stack has to respect and [[product]] for what runs on top.
