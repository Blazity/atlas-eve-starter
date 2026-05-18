import { type AgentModelDefinition, defineAgent } from "experimental-ash";

const model = "openai/gpt-5.4-mini" as unknown as AgentModelDefinition;

export default defineAgent({
  description: "Extract candidate evidence from synthetic CV/profile text without scoring.",
  model,
  modelContextWindowTokens: 400_000,
});
