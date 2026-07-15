import { readFile } from "node:fs/promises";

const [zh, en] = await Promise.all(
  ["zh", "en"].map(async (locale) =>
    JSON.parse(await readFile(new URL(`../messages/${locale}.json`, import.meta.url), "utf8")),
  ),
);

function collectShape(value, path = "", result = new Map()) {
  if (Array.isArray(value)) {
    result.set(path, `array:${value.length}`);
    value.forEach((item, index) => collectShape(item, `${path}[${index}]`, result));
    return result;
  }

  if (value && typeof value === "object") {
    result.set(path, "object");
    for (const [key, child] of Object.entries(value)) {
      collectShape(child, path ? `${path}.${key}` : key, result);
    }
    return result;
  }

  result.set(path, typeof value);
  return result;
}

const zhShape = collectShape(zh);
const enShape = collectShape(en);
const allPaths = new Set([...zhShape.keys(), ...enShape.keys()]);
const mismatches = [];

for (const path of allPaths) {
  if (zhShape.get(path) !== enShape.get(path)) {
    mismatches.push(`${path || "<root>"}: zh=${zhShape.get(path)} en=${enShape.get(path)}`);
  }
}

if (mismatches.length > 0) {
  console.error("Translation files do not have matching structures:\n" + mismatches.join("\n"));
  process.exit(1);
}

console.log(`Translation structures match (${allPaths.size} entries checked).`);
