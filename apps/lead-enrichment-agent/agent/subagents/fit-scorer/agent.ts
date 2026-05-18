import { openai } from "@ai-sdk/openai";
import { defineAgent } from "experimental-ash";

const model = openai("gpt-5.4-mini");

export default defineAgent({
  description: "Score synthetic lead fit against supplied shared company context.",
  model,
  modelContextWindowTokens: 400_000,
});
