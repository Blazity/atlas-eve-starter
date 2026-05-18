import type { MemoryEntry } from "@blazity/ash-plugin-memory";
import type { CompanyKnowledgeEntry } from "@blazity/company-context";
import { ContextKey, setContext } from "experimental-ash/context";

export const CompanyContextKey = new ContextKey<readonly CompanyKnowledgeEntry[]>(
  "lead-enrichment.companyContext",
);
export const LeadFixtureKey = new ContextKey<MemoryEntry>("lead-enrichment.leadFixture");
export const LeadPrerequisitesKey = new ContextKey<readonly string[]>(
  "lead-enrichment.prerequisites",
);

export function markLeadPrerequisite(id: string): readonly string[] {
  setContext(LeadPrerequisitesKey, [id]);

  return [id];
}
