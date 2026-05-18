import { setContext } from "experimental-ash/context";
import { defineTool } from "experimental-ash/tools";
import { z } from "zod";
import { markReviewPrerequisite, RoleRubricKey } from "../lib/context.js";
import { loadRoleRubric } from "../lib/cv-review.js";

export default defineTool({
  description: "Load the required role rubric before any candidate scoring.",
  inputSchema: z.object({
    roleId: z.string().default("frontend-engineer"),
  }),
  async execute({ roleId }) {
    const rubric = await loadRoleRubric(roleId);
    setContext(RoleRubricKey, rubric);
    markReviewPrerequisite("role-rubric-loaded");

    return rubric;
  },
});
