import { type AgentModelDefinition, defineAgent } from "experimental-ash";

const model = "openai/gpt-5.4-mini" as unknown as AgentModelDefinition;

export default defineAgent({
  description: "Review candidate assessments for unsupported claims, bias risk, and quality.",
  model,
  modelContextWindowTokens: 400_000,
});
