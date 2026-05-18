import { getContext, setContext } from "experimental-ash/context";
import { defineTool } from "experimental-ash/tools";
import { z } from "zod";
import { CompanyContextKey, LeadFixtureKey, markLeadPrerequisite } from "../lib/context.js";
import { loadLeadFixture, loadSharedCompanyContext, scoreLeadFit } from "../lib/lead-enrichment.js";

export default defineTool({
  description:
    "Score a synthetic lead against explicitly loaded shared company context. Loads shared context if missing.",
  inputSchema: z.object({
    leadId: z.string().default("lead-a"),
  }),
  async execute({ leadId }) {
    const lead = getContext(LeadFixtureKey) ?? (await loadLeadFixture(leadId));
    const companyContext = getContext(CompanyContextKey) ?? (await loadSharedCompanyContext());
    setContext(LeadFixtureKey, lead);
    setContext(CompanyContextKey, companyContext);
    markLeadPrerequisite("lead-fixture-loaded");
    markLeadPrerequisite("shared-company-context-loaded");

    const score = await scoreLeadFit({
      lead,
      companyContext,
    });
    markLeadPrerequisite("lead-fit-scored");

    return score;
  },
});
