import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

export interface CompanyKnowledgeEntry {
  readonly id: string;
  readonly scope: "shared";
  readonly kind: string;
  readonly title: string;
  readonly filePath: string;
  readonly content: string;
  readonly metadata: Readonly<Record<string, unknown>>;
}

const knowledgeDirectory = fileURLToPath(new URL("../knowledge/", import.meta.url));

export async function listCompanyKnowledge(): Promise<readonly CompanyKnowledgeEntry[]> {
  const files = await readdir(knowledgeDirectory, { withFileTypes: true });
  const entries = await Promise.all(
    files
      .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
      .map((entry) => loadCompanyKnowledgeFile(path.join(knowledgeDirectory, entry.name))),
  );

  return entries.sort((left, right) => left.id.localeCompare(right.id));
}

export async function getCompanyKnowledgeEntry(id: string): Promise<CompanyKnowledgeEntry> {
  const entries = await listCompanyKnowledge();
  const entry = entries.find((entry) => entry.id === id);

  if (entry === undefined) {
    throw new Error(`Unknown company knowledge entry "${id}".`);
  }

  return entry;
}

export async function loadCompanyKnowledgeFile(filePath: string): Promise<CompanyKnowledgeEntry> {
  const source = await readFile(filePath, "utf8");
  const parsed = matter(source);
  const id = readRequiredString(parsed.data, "id", filePath);
  const scope = readRequiredString(parsed.data, "scope", filePath);
  const kind = readRequiredString(parsed.data, "kind", filePath);
  const title = readRequiredString(parsed.data, "title", filePath);

  if (scope !== "shared") {
    throw new Error(`Company context file ${filePath} must declare scope "shared".`);
  }

  return {
    id,
    scope,
    kind,
    title,
    filePath,
    content: parsed.content.trim(),
    metadata: { ...parsed.data },
  };
}

function readRequiredString(
  metadata: Record<string, unknown>,
  key: string,
  filePath: string,
): string {
  const value = metadata[key];

  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Company context file ${filePath} is missing "${key}" frontmatter.`);
  }

  return value;
}
