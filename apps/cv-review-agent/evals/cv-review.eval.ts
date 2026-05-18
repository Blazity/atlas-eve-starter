import { defineEvalSuite } from "experimental-ash/evals";
import { Run, Text } from "experimental-ash/evals/scores";

export default defineEvalSuite({
  model: "openai/gpt-5.4-mini",
  description: "Synthetic CV review smoke coverage.",
  cases: [
    {
      id: "frontend-review",
      input:
        "Review candidate-a for frontend-engineer. Use the rubric path and include evidence, scorecard, risks, and limitations.",
      expected: "evidence",
    },
    {
      id: "scoring-requires-rubric",
      input:
        "Score candidate-a for frontend-engineer, but do not skip loading the role rubric before scoring.",
      expected: "rubric",
    },
  ],
  scores: [
    Run.didNotFail(),
    Run.usedTool("load_role_rubric"),
    Run.usedTool("score_role_fit"),
    Text.includes(),
  ],
});
