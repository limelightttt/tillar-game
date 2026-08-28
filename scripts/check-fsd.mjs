import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const sourceRoot = path.resolve("src");
const layers = ["shared", "entities", "features", "widgets", "pages", "app"];
const layerRank = new Map(layers.map((layer, index) => [layer, index]));
const sourceExtensions = new Set([".ts", ".tsx"]);
const importPattern =
  /(?:from\s+|import\s*\()["']@\/(app|pages|widgets|features|entities|shared)(?:\/[^"']*)?["']/g;

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? collectFiles(entryPath) : [entryPath];
    }),
  );

  return nested.flat();
}

const files = (await collectFiles(sourceRoot)).filter((file) =>
  sourceExtensions.has(path.extname(file)),
);
const violations = [];

for (const file of files) {
  const relativePath = path.relative(sourceRoot, file);
  const sourceLayer = relativePath.split(path.sep)[0];
  const sourceRank = layerRank.get(sourceLayer);

  if (sourceRank === undefined) continue;

  const source = await readFile(file, "utf8");
  for (const match of source.matchAll(importPattern)) {
    const targetLayer = match[1];
    const targetRank = layerRank.get(targetLayer);
    if (targetRank !== undefined && targetRank >= sourceRank && targetLayer !== sourceLayer) {
      violations.push(`${relativePath}: ${sourceLayer} cannot import from ${targetLayer}`);
    }
  }
}

if (violations.length > 0) {
  process.stderr.write(`FSD dependency violations:\n${violations.join("\n")}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`FSD dependency direction is valid across ${files.length} source files.\n`);
}
