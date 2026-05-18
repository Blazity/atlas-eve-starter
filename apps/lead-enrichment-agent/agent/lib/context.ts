import type { MemoryEntry } from "@blazity/ash-plugin-memory";
import type { CompanyKnowledgeEntry } from "@blazity/company-context";
import { ContextKey, getContext, setContext } from "experimental-ash/context";

export const CompanyContextKey = new ContextKey<readonly CompanyKnowledgeEntry[]>(
  "lead-enrichment.companyContext",
);
export const LeadFixtureKey = new ContextKey<MemoryEntry>("lead-enrichment.leadFixture");
export const LeadPrerequisitesKey = new ContextKey<readonly string[]>(
  "lead-enrichment.prerequisites",
);

export function markLeadPrerequisite(id: string): readonly string[] {
  const current = getContext(LeadPrerequisitesKey) ?? [];
  const next = Array.from(new Set([...current, id]));
  setContext(LeadPrerequisitesKey, next);

  return next;
}
