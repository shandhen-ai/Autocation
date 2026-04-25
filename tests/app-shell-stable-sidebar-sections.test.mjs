import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = "/Users/sachin/SachProjects/Autocation/integrated-app";

function read(relativePath) {
  return readFileSync(resolve(projectRoot, relativePath), "utf8");
}

test("desktop sidebar keeps fixed-height logo and user sections during collapse", () => {
  const source = read("components/app-shell.tsx");

  assert.match(
    source,
    /className="flex h-24 items-center justify-center border-b border-border\/40 px-5"/,
    "expected the logo section to keep a stable height so nav items do not shift upward during collapse",
  );
  assert.match(
    source,
    /className="h-24 border-t border-border\/40 px-4"/,
    "expected the user section to keep a stable height so collapse stays horizontal instead of reflowing vertically",
  );
});
