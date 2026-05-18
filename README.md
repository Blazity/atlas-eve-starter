# atlas-ash-starter

Private-first Ash starter monorepo for serious but minimal production-style agent systems. It shows
how to keep multiple Ash apps in one workspace while making boundaries explicit: app-local fixtures,
shared Markdown context, reusable local packages, subagents, deterministic tools/hooks, and opt-in
evals.

This repository is synthetic. It contains no real candidates, leads, customers, credentials, Slack
data, database data, or private Blazity records.

## Stack

- pnpm workspace
- Turborepo
- Node 24.x
- TypeScript
- Biome
- Vitest
- Ash via `experimental-ash`

## Install

Use Node 24 (`.node-version` and `.nvmrc` are included).

```bash
pnpm install
```

## Checks

```bash
pnpm check
pnpm typecheck
pnpm test
pnpm build
pnpm ash:build
```

Default checks do not require model credentials. `pnpm eval` is opt-in and can require provider
credentials because it runs Ash eval sessions.

## Apps

### CV Review Agent

```bash
pnpm --filter @blazity/cv-review-agent dev
```

HTTP example:

```bash
curl -X POST http://localhost:3000/review \
  -H 'content-type: application/json' \
  -d '{"candidateId":"candidate-a","roleId":"frontend-engineer"}'
```

The app demonstrates candidate profile loading, role/rubric loading, deterministic rubric-backed
scoring, and three subagents: evidence extraction, role-fit scoring, and compliance review.

### Lead Enrichment Agent

```bash
pnpm --filter @blazity/lead-enrichment-agent dev
```

HTTP example:

```bash
curl -X POST http://localhost:3000/enrich \
  -H 'content-type: application/json' \
  -d '{"leadId":"lead-a"}'
```

The app demonstrates app-local lead fixtures plus explicit shared context loading from
`@blazity/company-context`.

## Evals

```bash
pnpm eval
```

Eval suites live under each app's `evals/` directory. They are intentionally small and synthetic.
They are not part of default CI because model-backed runs need credentials and can cost money.

## Not Included In V1

- Dashboard
- Real Slack integration
- Database or vector store
- Auth provider
- Production credentials
- Real candidate, lead, company, customer, or Blazity private data
- Vercel Workflow/WDK implementation

See [docs/architecture.md](./docs/architecture.md) and
[docs/deterministic-boundaries.md](./docs/deterministic-boundaries.md) for the boundary decisions.
