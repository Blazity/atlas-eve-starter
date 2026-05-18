import { type AgentModelDefinition, defineAgent } from "experimental-ash";

const model = "openai/gpt-5.4-mini" as unknown as AgentModelDefinition;

export default defineAgent({
  description: "Summarize synthetic lead/company fixture facts without scoring fit.",
  model,
  modelContextWindowTokens: 400_000,
});
