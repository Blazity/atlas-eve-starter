# Project Vocabulary

Canonical terms for `atlas-eve-starter`. Use the term in the **Term** column; avoid the synonyms in
the **Avoid** column so agents do not drift between concepts.

## Eve Surfaces

| Term | Meaning | Avoid |
| --- | --- | --- |
| App | One Eve app under `apps/*`. | "service" when referring to the Eve app itself |
| Tool | Typed deterministic function the agent can call. Lives under `agent/tools/`. | "function call", "action", "command" |
| Hook | Lifecycle or stream-event callback that seeds/checks context or observes events. Lives under `agent/hooks/`. | "middleware", "interceptor" |
| Skill | On-demand Markdown guidance. Guidance only; never load-bearing. | "playbook" when meaning a skill file |
| Subagent | Separate specialist agent under `agent/subagents/<id>/`. Has its own prompt, tools, skills, and context. | "child agent", "worker" |
| Channel | Root app ingress surface, such as HTTP. Subagents cannot own channels. | "endpoint", "transport" |
| Eval | Behavior check under `apps/<app>/evals/*.eval.ts`. Opt-in and may need credentials. | "test" when meaning Vitest checks |
| Local package | A `packages/*` workspace package, named with a generic starter scope such as `@repo/example`. | internal company package names |

## Starter Terms

| Term | Meaning | Avoid |
| --- | --- | --- |
| Example agent | The replaceable echo app in `apps/example-agent`. | domain-specific example names |
| Example package | The replaceable shared contract package in `packages/example`. | "plugin" |
| Deterministic boundary | The line between required code behavior and model-guided behavior. | vague "agent logic" |
| Opt-in eval | Manual model-backed Eve eval run through `pnpm eval`. | automatic check |

## Stability

| Term | Meaning | Avoid |
| --- | --- | --- |
| Runtime | `eve` is resolved through pnpm's default minimum-release-age gate. | overriding the gate without review |
| Generic | The starter should avoid internal company branding and domain-specific fixtures. | internal-only naming |
