import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
  const parsed = parseMarkdownFrontmatter(source, filePath);
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

function parseMarkdownFrontmatter(
  source: string,
  filePath: string,
): {
  readonly data: Record<string, string>;
  readonly content: string;
} {
  const match = /^(?:\uFEFF)?---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/u.exec(source);

  if (match === null) {
    throw new Error(`Company context file ${filePath} must start with YAML-style frontmatter.`);
  }

  const [, frontmatterBlock, content] = match;

  if (frontmatterBlock === undefined || content === undefined) {
    throw new Error(`Company context file ${filePath} has invalid frontmatter structure.`);
  }

  return {
    data: parseSimpleFrontmatterBlock(frontmatterBlock, filePath),
    content,
  };
}

function parseSimpleFrontmatterBlock(block: string, filePath: string): Record<string, string> {
  const metadata: Record<string, string> = {};

  for (const [index, rawLine] of block.split(/\r?\n/u).entries()) {
    const line = rawLine.trim();

    if (line.length === 0 || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf(":");

    if (separatorIndex <= 0) {
      throw new Error(
        `Company context file ${filePath} has invalid frontmatter on line ${index + 1}: "${rawLine}".`,
      );
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    if (key.length === 0 || value.length === 0) {
      throw new Error(
        `Company context file ${filePath} has empty frontmatter key or value on line ${index + 1}.`,
      );
    }

    metadata[key] = stripWrappingQuotes(value);
  }

  return metadata;
}

function stripWrappingQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}
