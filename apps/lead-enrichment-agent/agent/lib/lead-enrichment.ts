import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadMarkdownMemory, type MemoryEntry } from "@blazity/ash-plugin-memory";
import { type CompanyKnowledgeEntry, listCompanyKnowledge } from "@blazity/company-context";

export interface LeadFitScore {
  readonly leadId: string;
  readonly score: number;
  readonly maxScore: number;
  readonly matchedSignals: readonly string[];
  readonly limitations: readonly string[];
}

const dataDirectory = fileURLToPath(new URL("../../data/", import.meta.url));

export async function loadLeadFixture(leadId: string): Promise<MemoryEntry> {
  if (!/^[a-z0-9-]+$/i.test(leadId)) {
    throw new Error(`Unsupported lead fixture id "${leadId}".`);
  }

  return loadMarkdownMemory(path.join(dataDirectory, "leads", `${leadId}.md`));
}

export async function loadSharedCompanyContext(): Promise<readonly CompanyKnowledgeEntry[]> {
  return listCompanyKnowledge();
}

export async function scoreLeadFit(input: {
  readonly lead: MemoryEntry;
  readonly companyContext?: readonly CompanyKnowledgeEntry[];
}): Promise<LeadFitScore> {
  const companyContext = input.companyContext ?? (await loadSharedCompanyContext());
  const leadText = input.lead.content.toLowerCase();
  const contextText = companyContext.map((entry) => entry.content.toLowerCase()).join("\n");
  const signals = [
    {
      label: "B2B software",
      matched: leadText.includes("b2b") && contextText.includes("b2b software"),
    },
    {
      label: "Governed agent workflow need",
      matched: leadText.includes("governed") || leadText.includes("agent workflow"),
    },
    {
      label: "Engineering stakeholder",
      matched: leadText.includes("engineering") || leadText.includes("cto"),
    },
    {
      label: "Measurable review process",
      matched: leadText.includes("review") || leadText.includes("score"),
    },
  ];
  const matchedSignals = signals.filter((signal) => signal.matched).map((signal) => signal.label);

  return {
    leadId: input.lead.id,
    score: matchedSignals.length,
    maxScore: signals.length,
    matchedSignals,
    limitations:
      matchedSignals.length === signals.length
        ? []
        : ["Synthetic lead fixture does not cover every shared ICP signal."],
  };
}
