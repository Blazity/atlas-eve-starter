import type { MemoryEntry } from "@blazity/ash-plugin-memory";
import { ContextKey, getContext, setContext } from "experimental-ash/context";

export const RoleRubricKey = new ContextKey<MemoryEntry>("cv-review.roleRubric");
export const ReviewPhaseKey = new ContextKey<"collecting" | "scoring" | "complete">(
  "cv-review.phase",
);
export const ReviewPrerequisitesKey = new ContextKey<readonly string[]>("cv-review.prerequisites");

export function markReviewPrerequisite(id: string): readonly string[] {
  const current = getContext(ReviewPrerequisitesKey) ?? [];
  const next = Array.from(new Set([...current, id]));
  setContext(ReviewPrerequisitesKey, next);

  return next;
}
