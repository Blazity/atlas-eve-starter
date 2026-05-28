# Project Vocabulary

Canonical terms for `atlas-ash-starter`. Use the term in the **Term** column; avoid the synonyms
in the **Avoid** column so agents don't drift between the same concept under different names.

## Ash Surfaces

| Term | Meaning | Avoid |
| --- | --- | --- |
| Tool | Typed deterministic function the agent can call. Lives under `agent/tools/`. | "function call", "action", "command" |
| Hook | Lifecycle or stream-event callback that seeds/checks context or observes events. Lives under `agent/hooks/`. | "middleware", "interceptor" |
| Skill | On-demand Markdown guidance the agent can load. **Guidance only — never load-bearing.** | "playbook", "runbook" (when meaning a skill file) |
| Subagent | Separate specialist agent under `agent/subagents/<id>/`. Has its own prompt, tools, skills, context. Does not inherit parent history. | "child agent", "worker" |
| Channel | Ingress surface for an app (e.g. HTTP). Root-only — subagents cannot own channels. | "endpoint", "transport" |
| Eval | Behavior check under `apps/<app>/evals/*.eval.ts`. Opt-in, may need credentials. | "test" (reserved for Vitest unit/integration tests) |
| Sandbox | Per-agent filesystem/workspace state. Not shared across subagents. | "scratch dir", "workspace" |
| Fixture | Synthetic input data under `apps/<app>/data/`. App-local. | "seed data", "mock" |

## Local Packages

| Term | Meaning | Avoid |
| --- | --- | --- |
| Local package | A `packages/*` workspace package (e.g. `@blazity/ash-plugin-memory`). | "module", "library" |
| Plugin (Ash) | Reserved for future `definePlugin` from `experimental-ash/plugins`, which is **not yet exported** by `experimental-ash@0.16.2`. The `ash-plugin-*` package names are forward-looking; today they expose hook/tool/context helpers. | calling current helpers "plugins" without this caveat |
| Shared context | Markdown knowledge in `@blazity/company-context`, **explicitly imported** by an app. | "global context", "auto-loaded knowledge" |

## Product Terms

| Term | Meaning | Avoid |
| --- | --- | --- |
| CV review | The end-to-end flow in `cv-review-agent`: profile + role load → evidence extraction → role-fit scoring → compliance review → Slack delivery. | "resume screening", "candidate vetting" |
| Candidate profile | Synthetic CV data loaded by the CV agent from app-local fixtures. | "applicant record" |
| Role | Job role definition with a rubric, loaded from CV-agent fixtures. | "position", "job" |
| Rubric | Deterministic scoring criteria attached to a role. Scoring loads it from authored code, not from the prompt. | "criteria", "scorecard" |
| Lead enrichment | The flow in `lead-enrichment-agent` that takes a `leadId` and enriches it using shared company context. | "prospect enrichment", "account research" |

## Stability / Data

| Term | Meaning | Avoid |
| --- | --- | --- |
| Experimental | The `experimental-ash` runtime and the `packages/ash-plugin-*` packages are experimental and slated for replacement with non-experimental equivalents (before public release, or when a stable release lands). | calling them "stable" |
| Synthetic | All in-repo data is fabricated for the starter. | "sample" or "example" when referring to data files (they are intentionally fake, not just illustrative) |
