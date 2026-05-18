import { defineTool } from "experimental-ash/tools";
import { z } from "zod";

export default defineTool({
  description: "Create the final structured review object from evidence, scorecard, and checks.",
  inputSchema: z.object({
    candidateId: z.string(),
    roleId: z.string(),
    recommendation: z.enum(["advance", "hold", "decline"]),
    evidence: z.array(z.string()),
    scorecardSummary: z.string(),
    risks: z.array(z.string()).default([]),
    limitations: z.array(z.string()).default([]),
  }),
  execute(input) {
    return {
      ...input,
      generatedFromSyntheticFixtures: true,
      requiredSections: ["evidence", "scorecard", "risks", "limitations"],
    };
  },
});
