import { createGovernanceHook } from "@blazity/ash-plugin-governance";
import { ReviewPhaseKey, RoleRubricKey } from "../lib/context.js";

export default createGovernanceHook({
  requirements: [
    {
      id: "role-rubric-loaded",
      description: "Role rubric must be loaded before candidate scoring.",
      check: (ctx) =>
        ctx.ash.get(ReviewPhaseKey) !== "scoring" || ctx.ash.get(RoleRubricKey) !== undefined,
    },
  ],
});
