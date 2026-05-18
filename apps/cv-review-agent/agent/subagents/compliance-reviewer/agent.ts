import { openai } from "@ai-sdk/openai";
import { defineAgent } from "experimental-ash";

const model = openai("gpt-5.4-mini");

export default defineAgent({
  description: "Review candidate assessments for unsupported claims, bias risk, and quality.",
  model,
  modelContextWindowTokens: 400_000,
});
