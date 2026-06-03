# Product

## Purpose

`atlas-ash-starter` is a clean Ash starter monorepo. It exists to demonstrate strict defaults and
reviewable boundaries for building agents, not to ship a domain-specific demo.

## Audience

Engineers starting an Ash agent project who want:

- a minimal example app
- deterministic tool tests
- explicit package boundaries
- opt-in Ash evals
- AI Harness planning and skill support
- strict formatting, typechecking, and test commands

## Included

- `apps/example-agent` — replaceable echo agent.
- `packages/example` — replaceable shared contract package.
- `docs/` — starter architecture and agent-creation guidance.
- `.ai/skills/create-ash-agent` — design-first planning skill.

## Out Of Scope

- Domain-specific apps or fixtures.
- Durable memory plugin.
- Observability plugin.
- Auth provider.
- Database or vector store.
- Production credentials.
- Webhook deployment setup.

## Status

The runtime dependency is `experimental-ash@0.16.2`. Treat it as experimental until a stable Ash
package is available.
