import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadMarkdownMemory, type MemoryEntry } from "@blazity/ash-plugin-memory";

export interface CandidateEvidence {
  readonly id: string;
  readonly source: string;
  readonly statement: string;
}

export interface RubricScore {
  readonly criterion: string;
  readonly score: number;
  readonly maxScore: number;
  readonly evidenceIds: readonly string[];
  readonly limitation?: string;
}

export interface RoleFitScorecard {
  readonly roleId: string;
  readonly rubricId: string;
  readonly totalScore: number;
  readonly maxScore: number;
  readonly scores: readonly RubricScore[];
  readonly summary: string;
}

const dataDirectory = fileURLToPath(new URL("../../data/", import.meta.url));

export async function loadCandidateProfile(candidateId: string): Promise<MemoryEntry> {
  return loadFixture(["candidates", `${safeFixtureId(candidateId)}.md`]);
}

export async function loadRole(roleId: string): Promise<MemoryEntry> {
  return loadFixture(["roles", `${safeFixtureId(roleId)}.md`]);
}

export async function loadRoleRubric(roleId: string): Promise<MemoryEntry> {
  return loadFixture(["rubrics", `${safeFixtureId(roleId)}.md`]);
}

export function extractCandidateEvidence(candidateProfile: string): readonly CandidateEvidence[] {
  const evidenceLines = candidateProfile
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .filter((line) => /(react|typescript|accessibility|testing|lead|collaborat)/i.test(line));

  return evidenceLines.map((line, index) => ({
    id: `evidence-${index + 1}`,
    source: "candidate-profile",
    statement: line.replace(/^- /, ""),
  }));
}

export async function scoreEvidenceAgainstRubric(input: {
  readonly roleId: string;
  readonly evidence: readonly CandidateEvidence[];
  readonly rubric?: MemoryEntry;
}): Promise<RoleFitScorecard> {
  const rubric = input.rubric ?? (await loadRoleRubric(input.roleId));
  const evidenceText = input.evidence.map((entry) => entry.statement.toLowerCase()).join("\n");
  const criteria = [
    {
      criterion: "Frontend architecture",
      keywords: ["react", "component", "frontend"],
    },
    {
      criterion: "TypeScript delivery",
      keywords: ["typescript", "type", "strict"],
    },
    {
      criterion: "Quality and testing",
      keywords: ["test", "vitest", "accessibility", "quality"],
    },
    {
      criterion: "Collaboration",
      keywords: ["collaborat", "handoff", "lead"],
    },
  ];

  const scores = criteria.map((criterion) => {
    const matchedKeywords = criterion.keywords.filter((keyword) => evidenceText.includes(keyword));
    const score = Math.min(3, matchedKeywords.length);
    const evidenceIds = input.evidence
      .filter((entry) =>
        criterion.keywords.some((keyword) => entry.statement.toLowerCase().includes(keyword)),
      )
      .map((entry) => entry.id);

    return {
      criterion: criterion.criterion,
      score,
      maxScore: 3,
      evidenceIds,
      ...(evidenceIds.length === 0
        ? { limitation: "No direct evidence found in the candidate fixture." }
        : {}),
    };
  });
  const totalScore = scores.reduce((total, score) => total + score.score, 0);
  const maxScore = scores.reduce((total, score) => total + score.maxScore, 0);

  return {
    roleId: input.roleId,
    rubricId: rubric.id,
    totalScore,
    maxScore,
    scores,
    summary:
      totalScore >= 9
        ? "Strong synthetic fit with evidence across most rubric areas."
        : "Partial synthetic fit; review limitations before making a recommendation.",
  };
}

export function complianceCheck(input: {
  readonly review: string;
  readonly evidence: readonly CandidateEvidence[];
}): {
  readonly unsupportedClaims: readonly string[];
  readonly biasRisks: readonly string[];
  readonly qualityNotes: readonly string[];
} {
  const evidenceText = input.evidence.map((entry) => entry.statement.toLowerCase()).join("\n");
  const unsupportedClaims = ["senior", "expert", "perfect"]
    .filter((term) => input.review.toLowerCase().includes(term) && !evidenceText.includes(term))
    .map((term) => `Review uses "${term}" without direct fixture evidence.`);

  return {
    unsupportedClaims,
    biasRisks: input.review.match(/\b(age|gender|nationality|family)\b/i)
      ? ["Review mentions protected or irrelevant personal attributes."]
      : [],
    qualityNotes:
      input.evidence.length === 0
        ? ["No evidence was supplied to support the review."]
        : ["Review has at least one evidence source available."],
  };
}

async function loadFixture(parts: readonly string[]): Promise<MemoryEntry> {
  return loadMarkdownMemory(path.join(dataDirectory, ...parts));
}

function safeFixtureId(value: string): string {
  if (!/^[a-z0-9-]+$/i.test(value)) {
    throw new Error(`Unsupported fixture id "${value}".`);
  }

  return value;
}
