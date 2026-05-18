import { setContext } from "experimental-ash/context";
import { defineTool } from "experimental-ash/tools";
import { z } from "zod";
import { CompanyContextKey, markLeadPrerequisite } from "../lib/context.js";
import { loadSharedCompanyContext } from "../lib/lead-enrichment.js";

export default defineTool({
  description: "Explicitly load shared company context from @blazity/company-context.",
  inputSchema: z.object({}),
  async execute() {
    const entries = await loadSharedCompanyContext();
    setContext(CompanyContextKey, entries);
    markLeadPrerequisite("shared-company-context-loaded");

    return entries;
  },
});
