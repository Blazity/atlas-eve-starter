import { openai } from "@ai-sdk/openai";
import { defineAgent } from "experimental-ash";

const model = openai("gpt-5.4-mini");

export default defineAgent({
  model,
  metadata: {
    example: "echo",
    owner: "ash-starter",
  },
});
