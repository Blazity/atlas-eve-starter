import { defineTool } from "experimental-ash/tools";
import { z } from "zod";
import { scoreLeadFit } from "../../../lib/lead-enrichment.js";

export default defineTool({
  description: "Score lead fit with an explicitly supplied lead fixture and company context.",
  inputSchema: z.object({
    lead: z.object({
      id: z.string(),
      scope: z.literal("app-local"),
      kind: z.string(),
      filePath: z.string(),
      content: z.string(),
      metadata: z.record(z.string(), z.unknown()),
    }),
    companyContext: z.array(
      z.object({
        id: z.string(),
        scope: z.literal("shared"),
        kind: z.string(),
        title: z.string(),
        filePath: z.string(),
        content: z.string(),
        metadata: z.record(z.string(), z.unknown()),
      }),
    ),
  }),
  async execute({ lead, companyContext }) {
    return scoreLeadFit({ lead, companyContext });
  },
});
