import { describe, expect, it } from "vitest";
import { createMemoryLoader, loadMarkdownMemory } from "../src/index.js";

describe("memory plugin", () => {
  it("loads Markdown files with frontmatter", async () => {
    const entry = await loadMarkdownMemory("tests/fixtures/shared/company.md");

    expect(entry).toMatchObject({
      id: "synthetic-company",
      scope: "shared",
      kind: "company-profile",
    });
    expect(entry.content).toContain("Shared company context");
  });

  it("keeps shared and app-local context explicit", async () => {
    const loader = createMemoryLoader({
      roots: [
        { scope: "shared", directory: "tests/fixtures/shared" },
        { scope: "app-local", directory: "tests/fixtures/app-local" },
      ],
    });

    const shared = await loader.load({ scopes: ["shared"] });
    const appLocal = await loader.load({ scopes: ["app-local"] });
    const both = await loader.load({ scopes: ["shared", "app-local"] });

    expect(shared.map((entry) => entry.id)).toEqual(["synthetic-company"]);
    expect(appLocal.map((entry) => entry.id)).toEqual(["lead-alpha"]);
    expect(both.map((entry) => entry.scope).sort()).toEqual(["app-local", "shared"]);
  });
});
