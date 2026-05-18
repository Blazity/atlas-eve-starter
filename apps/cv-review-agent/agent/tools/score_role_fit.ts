import { getContext, setContext } from "experimental-ash/context";
import { defineTool } from "experimental-ash/tools";
import { z } from "zod";
import { markReviewPrerequisite, ReviewPhaseKey, RoleRubricKey } from "../lib/context.js";
import { loadRoleRubric, scoreEvidenceAgainstRubric } from "../lib/cv-review.js";

const evidenceSchema = z.object({
  id: z.string(),
  source: z.string(),
  statement: z.string(),
});

export default defineTool({
  description:
    "Score extracted candidate evidence against the role rubric. This tool loads the rubric if it is not already present.",
  inputSchema: z.object({
    roleId: z.string().default("frontend-engineer"),
    evidence: z.array(evidenceSchema),
  }),
  async execute({ roleId, evidence }) {
    const rubric = getContext(RoleRubricKey) ?? (await loadRoleRubric(roleId));
    setContext(RoleRubricKey, rubric);
    markReviewPrerequisite("role-rubric-loaded");
    setContext(ReviewPhaseKey, "scoring");

    const scorecard = await scoreEvidenceAgainstRubric({
      roleId,
      evidence,
      rubric,
    });
    markReviewPrerequisite("role-fit-scored");
    setContext(ReviewPhaseKey, "complete");

    return scorecard;
  },
});
