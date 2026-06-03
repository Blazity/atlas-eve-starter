import { defineEvalSuite } from "experimental-ash/evals";
import { Run, Text } from "experimental-ash/evals/scores";

export default defineEvalSuite({
  model: "openai/gpt-5.4-mini",
  description: "Domain-neutral smoke coverage for the example echo agent.",
  cases: [
    {
      id: "echo-short-message",
      input: "Echo the message: hello",
      expected: "hello",
    },
  ],
  scores: [Run.didNotFail(), Run.usedTool("echo"), Text.includes()],
});
