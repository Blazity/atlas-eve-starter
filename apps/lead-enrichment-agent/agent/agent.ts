import { openai } from "@ai-sdk/openai";
import { defineAgent } from "experimental-ash";

const model = openai("gpt-5.4-mini");

export default defineAgent({
  model,
  modelContextWindowTokens: 400_000,
  metadata: {
    example: "lead-enrichment",
    owner: "atlas-ash-starter",
  },
});
