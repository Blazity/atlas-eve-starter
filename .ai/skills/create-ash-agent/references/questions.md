# Questions

Ask only the questions that are not already answered:

- What business goal should the agent handle?
- What user or channel trigger starts the work?
- Which steps must be deterministic?
- Which tools or API calls are needed?
- Which specialist boundaries deserve subagents?
- Are proposed subagents app-local, or is there immediate reuse that justifies a shared package?
- Which shared context is allowed?
- Which app-local context is required?
- Does the agent need memory, and is it shared or app-local?
- Which eval scenarios prove the happy path and guardrails?
- What should fail fast, retry, or ask for human input?
- Who owns deployment and runtime operations?
