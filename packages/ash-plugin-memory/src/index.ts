import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { ContextKey } from "experimental-ash/context";
import { defineHook } from "experimental-ash/hooks";
import matter from "gray-matter";

export type MemoryScope = "shared" | "app-local";

export interface MemoryRoot {
  readonly scope: MemoryScope;
  readonly directory: string;
}

export interface MemoryEntry {
  readonly id: string;
  readonly scope: MemoryScope;
  readonly kind: string;
  readonly title?: string;
  readonly filePath: string;
  readonly content: string;
  readonly metadata: Readonly<Record<string, unknown>>;
}

export interface MemoryLoaderOptions {
  readonly roots: readonly MemoryRoot[];
}

export interface MemoryLoadOptions {
  readonly scopes: readonly MemoryScope[];
}

export const MemoryEntriesKey = new ContextKey<readonly MemoryEntry[]>(
  "@blazity/ash-plugin-memory.entries",
);

export async function loadMarkdownMemory(filePath: string): Promise<MemoryEntry> {
  const absolutePath = path.resolve(filePath);
  const source = await readFile(absolutePath, "utf8");
  const parsed = matter(source);
  const id = readRequiredString(parsed.data, "id", absolutePath);
  const scope = readRequiredScope(parsed.data, absolutePath);
  const kind = readRequiredString(parsed.data, "kind", absolutePath);
  const title = readOptionalString(parsed.data, "title");

  return {
    id,
    scope,
    kind,
    ...(title === undefined ? {} : { title }),
    filePath: absolutePath,
    content: parsed.content.trim(),
    metadata: { ...parsed.data },
  };
}

export function createMemoryLoader(options: MemoryLoaderOptions) {
  return {
    async load(loadOptions: MemoryLoadOptions): Promise<readonly MemoryEntry[]> {
      const selectedScopes = new Set(loadOptions.scopes);
      const entries: MemoryEntry[] = [];

      for (const root of options.roots) {
        if (!selectedScopes.has(root.scope)) continue;

        const markdownFiles = await listMarkdownFiles(root.directory);

        for (const file of markdownFiles) {
          const entry = await loadMarkdownMemory(file);

          if (entry.scope !== root.scope) {
            throw new Error(
              `Memory entry "${entry.id}" declares scope "${entry.scope}" but was loaded from "${root.scope}" root ${root.directory}.`,
            );
          }

          entries.push(entry);
        }
      }

      return entries.sort((left, right) => left.id.localeCompare(right.id));
    },
  };
}

export function formatMemoryEntriesForModelContext(entries: readonly MemoryEntry[]): string {
  return entries
    .map((entry) => {
      const title = entry.title ?? entry.id;

      return `## ${title}\nScope: ${entry.scope}\nKind: ${entry.kind}\n\n${entry.content}`;
    })
    .join("\n\n");
}

export function createMemoryHook(options: MemoryLoaderOptions & MemoryLoadOptions) {
  const loader = createMemoryLoader({ roots: options.roots });

  return defineHook({
    lifecycle: {
      async session(_input, ctx) {
        const entries = await loader.load({ scopes: options.scopes });
        ctx.ash.set(MemoryEntriesKey, entries);
      },
      async turn(_input, ctx) {
        const entries = ctx.ash.get(MemoryEntriesKey);

        if (entries === undefined || entries.length === 0) return;

        return {
          modelContext: [
            {
              role: "system",
              content: `Loaded explicit Markdown context:\n\n${formatMemoryEntriesForModelContext(entries)}`,
            },
          ],
        };
      },
    },
  });
}

export function memory(options: MemoryLoaderOptions & MemoryLoadOptions) {
  return {
    id: "@blazity/ash-plugin-memory",
    hooks: [createMemoryHook(options)],
    contextKeys: [MemoryEntriesKey],
  } as const;
}

async function listMarkdownFiles(directory: string): Promise<readonly string[]> {
  const absoluteDirectory = path.resolve(directory);
  const entries = await readdir(absoluteDirectory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(absoluteDirectory, entry.name);

      if (entry.isDirectory()) {
        return listMarkdownFiles(entryPath);
      }

      if (entry.isFile() && entry.name.endsWith(".md")) {
        return [entryPath];
      }

      return [];
    }),
  );

  return files.flat().sort((left, right) => left.localeCompare(right));
}

function readRequiredString(
  metadata: Record<string, unknown>,
  key: string,
  filePath: string,
): string {
  const value = metadata[key];

  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Memory file ${filePath} is missing required "${key}" frontmatter.`);
  }

  return value;
}

function readOptionalString(metadata: Record<string, unknown>, key: string): string | undefined {
  const value = metadata[key];

  if (value === undefined) return undefined;

  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Optional "${key}" frontmatter must be a non-empty string when provided.`);
  }

  return value;
}

function readRequiredScope(metadata: Record<string, unknown>, filePath: string): MemoryScope {
  const value = readRequiredString(metadata, "scope", filePath);

  if (value !== "shared" && value !== "app-local") {
    throw new Error(`Memory file ${filePath} has unsupported scope "${value}".`);
  }

  return value;
}
