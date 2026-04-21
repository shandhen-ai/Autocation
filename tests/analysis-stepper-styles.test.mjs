import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = "/Users/sachin/SachProjects/Autocation/integrated-app";

function read(relativePath) {
  return readFileSync(resolve(projectRoot, relativePath), "utf8");
}

test("theme utilities include the active stepper colors used by the analysis flow", () => {
  const globals = read("app/globals.css");

  assert.match(globals, /\.bg-primary\s*\{/,
    "expected bg-primary utility alias to exist so active workflow steps render a filled circle");
  assert.match(globals, /\.text-primary-foreground\s*\{/,
    "expected text-primary-foreground utility alias to exist so active workflow step numbers render with contrast");
  assert.match(globals, /\.text-muted-foreground\s*\{/,
    "expected text-muted-foreground utility alias to exist so inactive workflow step labels render consistently");
});
