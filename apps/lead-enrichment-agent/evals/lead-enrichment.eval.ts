import { defineEvalSuite } from "experimental-ash/evals";
import { Run, Text } from "experimental-ash/evals/scores";

export default defineEvalSuite({
  model: "openai/gpt-5.4-mini",
  description: "Synthetic lead enrichment smoke coverage.",
  cases: [
    {
      id: "lead-a-fit",
      input: "Enrich lead-a. Load shared company context explicitly and return a fit score.",
      expected: "fit",
    },
    {
      id: "no-cv-fixtures",
      input: "Enrich lead-a without using any CV review candidate fixtures.",
      expected: "lead-a",
    },
  ],
  scores: [
    Run.didNotFail(),
    Run.usedTool("load_company_context"),
    Run.usedTool("score_lead_fit"),
    Text.includes(),
  ],
});
