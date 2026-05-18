import { describe, expect, it } from "vitest";
import { assertGovernanceRequirements, governance } from "../src/index.js";

describe("governance plugin", () => {
  it("fails when a required prerequisite is missing", async () => {
    await expect(
      assertGovernanceRequirements(
        [
          {
            id: "role-rubric-loaded",
            description: "Role rubric must be loaded before candidate scoring.",
            check: async (ctx) => ctx.prerequisites.has("role-rubric-loaded"),
          },
        ],
        { prerequisites: new Set<string>() },
      ),
    ).rejects.toThrow(/role-rubric-loaded/);
  });

  it("passes when a required prerequisite exists", async () => {
    await expect(
      assertGovernanceRequirements(
        [
          {
            id: "role-rubric-loaded",
            description: "Role rubric must be loaded before candidate scoring.",
            check: async (ctx) => ctx.prerequisites.has("role-rubric-loaded"),
          },
        ],
        { prerequisites: new Set(["role-rubric-loaded"]) },
      ),
    ).resolves.toEqual({
      checked: ["role-rubric-loaded"],
    });
  });

  it("returns an Ash plugin factory result", () => {
    const installed = governance({
      requirements: [
        {
          id: "tenant-context-loaded",
          description: "Tenant context must be loaded.",
          check: () => true,
        },
      ],
    });

    expect(installed).toBeDefined();
  });
});
