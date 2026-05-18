import { openai } from "@ai-sdk/openai";
import { defineAgent } from "experimental-ash";

const model = openai("gpt-5.4-mini");

export default defineAgent({
  description: "Summarize synthetic lead/company fixture facts without scoring fit.",
  model,
  modelContextWindowTokens: 400_000,
});
