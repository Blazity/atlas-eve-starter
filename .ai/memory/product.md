# Product

## Purpose

`atlas-eve-starter` is a clean Eve starter monorepo. It exists to demonstrate strict defaults and
reviewable boundaries for building agents, not to ship a domain-specific demo.

## Audience

Engineers starting an Eve agent project who want:

- a minimal example app
- deterministic tool tests
- explicit package boundaries
- opt-in Eve evals
- AI Harness planning and skill support
- strict formatting, typechecking, and test commands

## Included

- `apps/example-agent` — replaceable echo agent.
- `packages/example` — replaceable shared contract package.
- `docs/` — starter architecture and agent-creation guidance.
- `.ai/skills/create-eve-agent` — design-first planning skill.

## Out Of Scope

- Domain-specific apps or fixtures.
- Durable memory plugin.
- Observability plugin.
- Auth provider.
- Database or vector store.
- Production credentials.
- Webhook deployment setup.

## Status

The runtime dependency is `eve`. Let pnpm's default minimum-release-age gate choose the installable
version; do not add release-age excludes without an explicit security review.
