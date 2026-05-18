import { describe, expect, it } from "vitest";
import { getCompanyKnowledgeEntry, listCompanyKnowledge } from "../src/index.js";

describe("company context", () => {
  it("lists typed Markdown/frontmatter knowledge entries", async () => {
    const entries = await listCompanyKnowledge();

    expect(entries.map((entry) => entry.id).sort()).toEqual([
      "company-profile",
      "icp",
      "scoring-principles",
      "terminology",
    ]);
    expect(entries.every((entry) => entry.scope === "shared")).toBe(true);
  });

  it("loads one entry by id", async () => {
    const entry = await getCompanyKnowledgeEntry("icp");

    expect(entry.kind).toBe("ideal-customer-profile");
    expect(entry.content).toContain("synthetic B2B software company");
  });
});
