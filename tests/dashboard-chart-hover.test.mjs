import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = "/Users/sachin/SachProjects/Autocation/integrated-app";

function read(relativePath) {
  return readFileSync(resolve(projectRoot, relativePath), "utf8");
}

test("savings chart uses a rounded custom tooltip cursor overlay", () => {
  const dashboard = read("components/dashboard.tsx");

  assert.match(
    dashboard,
    /function RoundedChartCursor[\s\S]*radius=\{\[18, 18, 0, 0\]\}[\s\S]*<Tooltip[\s\S]*cursor={<RoundedChartCursor \/>}/,
    "expected SavingsBarChart to use a top-rounded custom hover cursor overlay",
  );
});
