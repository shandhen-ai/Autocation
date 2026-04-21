import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = "/Users/sachin/SachProjects/Autocation/integrated-app";

function read(relativePath) {
  return readFileSync(resolve(projectRoot, relativePath), "utf8");
}

test("analysis output page uses the centered header layout with breadcrumb metadata on the left", () => {
  const outputPage = read("app/analyze/output/page.tsx");

  assert.match(
    outputPage,
    /<PageHeader[\s\S]*contentClassName="gap-0"[\s\S]*className="py-4"[\s\S]*<div className="grid w-full gap-4 lg:grid-cols-\[1fr_auto_1fr\] lg:items-center">[\s\S]*<div className="text-xs text-muted-foreground font-sans lg:justify-self-start">[\s\S]*New Vehicle Analysis[\s\S]*Results[\s\S]*<h1 className="text-xl font-bold tracking-tight text-foreground font-display justify-self-center">[\s\S]*Your Analysis is Ready[\s\S]*<div className="hidden lg:block" \/>[\s\S]*<\/PageHeader>/,
    "expected analysis output page header to match the centered layout used by the other primary pages",
  );
});
