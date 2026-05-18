import { defineTool } from "experimental-ash/tools";
import { z } from "zod";
import { complianceCheck } from "../../../lib/cv-review.js";

export default defineTool({
  description: "Check a draft candidate review for unsupported claims and bias risks.",
  inputSchema: z.object({
    review: z.string(),
    evidence: z.array(
      z.object({
        id: z.string(),
        source: z.string(),
        statement: z.string(),
      }),
    ),
  }),
  execute(input) {
    return complianceCheck(input);
  },
});
