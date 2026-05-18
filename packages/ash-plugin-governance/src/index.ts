import { defineHook, type HookContext } from "experimental-ash/hooks";

export interface GovernanceRequirement<TContext = unknown> {
  readonly id: string;
  readonly description: string;
  readonly check: (ctx: TContext) => boolean | Promise<boolean>;
}

export interface GovernanceOptions<TContext = unknown> {
  readonly requirements: readonly GovernanceRequirement<TContext>[];
  readonly onFailure?: "throw";
}

export interface GovernanceResult {
  readonly checked: readonly string[];
}

export class GovernanceRequirementError extends Error {
  readonly requirementId: string;
  readonly requirementDescription: string;

  constructor(requirement: Pick<GovernanceRequirement, "id" | "description">) {
    super(`Governance requirement "${requirement.id}" failed: ${requirement.description}`);
    this.name = "GovernanceRequirementError";
    this.requirementId = requirement.id;
    this.requirementDescription = requirement.description;
  }
}

export async function assertGovernanceRequirements<TContext>(
  requirements: readonly GovernanceRequirement<TContext>[],
  ctx: TContext,
): Promise<GovernanceResult> {
  const checked: string[] = [];

  for (const requirement of requirements) {
    const passed = await requirement.check(ctx);

    if (!passed) {
      throw new GovernanceRequirementError(requirement);
    }

    checked.push(requirement.id);
  }

  return { checked };
}

export function createGovernanceHook(options: GovernanceOptions<HookContext>) {
  return defineHook({
    lifecycle: {
      async turn(_input, ctx) {
        await assertGovernanceRequirements(options.requirements, ctx);
      },
    },
  });
}

export function governance(options: GovernanceOptions<HookContext>) {
  return {
    id: "@blazity/ash-plugin-governance",
    hooks: [createGovernanceHook(options)],
  } as const;
}
