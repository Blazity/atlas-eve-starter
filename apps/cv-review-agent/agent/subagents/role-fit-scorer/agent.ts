import { type AgentModelDefinition, defineAgent } from "experimental-ash";

const model = "openai/gpt-5.4-mini" as unknown as AgentModelDefinition;

export default defineAgent({
  description: "Score extracted evidence against a provided role rubric.",
  model,
  modelContextWindowTokens: 400_000,
});
