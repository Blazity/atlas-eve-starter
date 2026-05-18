import { openai } from "@ai-sdk/openai";
import { defineAgent } from "experimental-ash";

const model = openai("gpt-5.4-mini");

export default defineAgent({
  description: "Score extracted evidence against a provided role rubric.",
  model,
  modelContextWindowTokens: 400_000,
});
