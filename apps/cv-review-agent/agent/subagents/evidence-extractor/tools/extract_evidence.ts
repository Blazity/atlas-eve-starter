import { defineTool } from "experimental-ash/tools";
import { z } from "zod";
import { extractCandidateEvidence } from "../../../lib/cv-review.js";

export default defineTool({
  description: "Extract evidence statements from candidate profile text.",
  inputSchema: z.object({
    candidateProfile: z.string(),
  }),
  execute({ candidateProfile }) {
    return {
      evidence: extractCandidateEvidence(candidateProfile),
      scoringAllowed: false,
    };
  },
});
