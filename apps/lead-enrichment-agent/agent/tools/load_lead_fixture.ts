import { setContext } from "experimental-ash/context";
import { defineTool } from "experimental-ash/tools";
import { z } from "zod";
import { LeadFixtureKey, markLeadPrerequisite } from "../lib/context.js";
import { loadLeadFixture } from "../lib/lead-enrichment.js";

export default defineTool({
  description: "Load an app-local synthetic lead fixture by id.",
  inputSchema: z.object({
    leadId: z.string().default("lead-a"),
  }),
  async execute({ leadId }) {
    const lead = await loadLeadFixture(leadId);
    setContext(LeadFixtureKey, lead);
    markLeadPrerequisite("lead-fixture-loaded");

    return lead;
  },
});
