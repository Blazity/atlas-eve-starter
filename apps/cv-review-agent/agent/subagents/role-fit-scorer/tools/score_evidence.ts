import { defineTool } from "experimental-ash/tools";
import { z } from "zod";
import { scoreEvidenceAgainstRubric } from "../../../lib/cv-review.js";

export default defineTool({
  description: "Score candidate evidence against an explicitly supplied role rubric.",
  inputSchema: z.object({
    roleId: z.string(),
    rubric: z.object({
      id: z.string(),
      scope: z.literal("app-local"),
      kind: z.string(),
      filePath: z.string(),
      content: z.string(),
      metadata: z.record(z.string(), z.unknown()),
    }),
    evidence: z.array(
      z.object({
        id: z.string(),
        source: z.string(),
        statement: z.string(),
      }),
    ),
  }),
  async execute({ roleId, rubric, evidence }) {
    return scoreEvidenceAgainstRubric({ roleId, rubric, evidence });
  },
});
