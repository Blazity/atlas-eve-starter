import { defineTool } from "experimental-ash/tools";
import { z } from "zod";
import { markReviewPrerequisite } from "../lib/context.js";
import { loadRole } from "../lib/cv-review.js";

export default defineTool({
  description: "Load a synthetic target role fixture by id.",
  inputSchema: z.object({
    roleId: z.string().default("frontend-engineer"),
  }),
  async execute({ roleId }) {
    const role = await loadRole(roleId);
    markReviewPrerequisite("target-role-loaded");

    return role;
  },
});
