# ADR: Use A Clean Eve Starter

## Status

Accepted

## Context

Teams need a starter that is easy to replace with their own agent while still demonstrating the
minimum production-style defaults expected in this repository.

## Decision

Use a clean Eve starter with:

- one replaceable example app;
- one replaceable shared contract package;
- strict TypeScript and Biome defaults;
- deterministic unit tests;
- opt-in Eve evals;
- AI Harness memory, plans, decisions, and skills.

## Consequences

The starter stays generic and avoids domain-specific business workflows. Teams can copy the project
shape, replace the example app/package, and keep the same verification and review habits.
