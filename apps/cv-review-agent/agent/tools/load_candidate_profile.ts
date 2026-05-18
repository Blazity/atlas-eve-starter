import { defineTool } from "experimental-ash/tools";
import { z } from "zod";
import { markReviewPrerequisite } from "../lib/context.js";
import { loadCandidateProfile } from "../lib/cv-review.js";

export default defineTool({
  description: "Load a synthetic candidate profile fixture by id.",
  inputSchema: z.object({
    candidateId: z.string().default("candidate-a"),
  }),
  async execute({ candidateId }) {
    const candidate = await loadCandidateProfile(candidateId);
    markReviewPrerequisite("candidate-profile-loaded");

    return candidate;
  },
});
