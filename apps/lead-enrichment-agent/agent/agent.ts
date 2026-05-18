import { type AgentModelDefinition, defineAgent } from "experimental-ash";

const model = "openai/gpt-5.4-mini" as unknown as AgentModelDefinition;

export default defineAgent({
  model,
  modelContextWindowTokens: 400_000,
  metadata: {
    example: "lead-enrichment",
    owner: "atlas-ash-starter",
  },
});
