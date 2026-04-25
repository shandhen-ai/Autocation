import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = "/Users/sachin/SachProjects/Autocation/integrated-app";

function read(relativePath) {
  return readFileSync(resolve(projectRoot, relativePath), "utf8");
}

test("processing flow advances stages sequentially without overlapping interval timers", () => {
  const source = read("app/analyze/processing/page.tsx");

  assert.doesNotMatch(
    source,
    /const interval = setInterval\(/,
    "expected processing flow to avoid overlapping stage interval timers that can desync completed steps",
  );
  assert.match(
    source,
    /const runStage = \(stageIndex: number\) => \{/,
    "expected processing flow to use a sequential stage runner so each step completes exactly once",
  );
});
