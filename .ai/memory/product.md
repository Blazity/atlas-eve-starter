# Product

## Purpose

`atlas-ash-starter` is a reference monorepo showing how to build serious-but-minimal
production-style agent systems on Ash. It exists to demonstrate boundaries: how multiple Ash apps
coexist in one workspace, how shared knowledge is exposed without leaking into every prompt, and
where deterministic code should beat free-form agent reasoning.

## Audience

Engineers picking up Ash for serious-but-minimal agent work. Do not add Blazity-internal context,
credentials, or private records.

## Apps

- **`cv-review-agent`** — HTTP-driven CV review. Loads a synthetic candidate profile and role
  fixture, runs three subagents (evidence extraction, role-fit scoring, compliance review), scores
  against a deterministic rubric, and delivers results to Slack via Vercel Connect.
- **`lead-enrichment-agent`** — HTTP-driven lead enrichment. Loads an app-local lead fixture and
  explicitly imports `@blazity/company-context` for shared synthetic knowledge.

The two apps are intentionally independent — neither implicitly receives the other's context or
tools.

## Deploy Target

Vercel is the implied runtime (the Slack flow uses Vercel Connect). Nothing is deployed today;
the repo is locally runnable.

## Out Of Scope For v1

- No dashboard.
- No database or vector store.
- No auth provider.
- No production credentials anywhere in the repo.
- No real candidate, lead, company, customer, or Blazity private data.
- No Vercel Workflow / WDK implementation (the boundary is documented, the integration is not
  built).

## Status

`experimental-ash` and the `packages/ash-plugin-*` packages are experimental. Replace them with
non-experimental equivalents before public release; if an experimental dependency reaches a stable
release after publication, replace it then. See [[architecture]] for boundaries and [[stack]] for
runtime versions.
