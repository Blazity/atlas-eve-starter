import { getContext } from "experimental-ash/context";
import { defineTool } from "experimental-ash/tools";
import { z } from "zod";
import { CompanyContextKey, LeadFixtureKey, markLeadPrerequisite } from "../lib/context.js";
import { loadLeadFixture, scoreLeadFit } from "../lib/lead-enrichment.js";

export default defineTool({
  description:
    "Score a synthetic lead against explicitly loaded shared company context. Loads shared context if missing.",
  inputSchema: z.object({
    leadId: z.string().default("lead-a"),
  }),
  async execute({ leadId }) {
    const lead = getContext(LeadFixtureKey) ?? (await loadLeadFixture(leadId));
    const companyContext = getContext(CompanyContextKey);
    const score = await scoreLeadFit({
      lead,
      ...(companyContext === undefined ? {} : { companyContext }),
    });
    markLeadPrerequisite("lead-fit-scored");

    return score;
  },
});
