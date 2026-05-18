import { type AgentModelDefinition, defineAgent } from "experimental-ash";

const model = "openai/gpt-5.4-mini" as unknown as AgentModelDefinition;

export default defineAgent({
  description: "Score synthetic lead fit against supplied shared company context.",
  model,
  modelContextWindowTokens: 400_000,
});
