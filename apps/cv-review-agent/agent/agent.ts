import { type AgentModelDefinition, defineAgent } from "experimental-ash";

const model = "openai/gpt-5.4-mini" as unknown as AgentModelDefinition;

export default defineAgent({
  model,
  modelContextWindowTokens: 400_000,
  metadata: {
    example: "cv-review",
    owner: "atlas-ash-starter",
  },
  compaction: {
    thresholdPercent: 0.75,
  },
});
