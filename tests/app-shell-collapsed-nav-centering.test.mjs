import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = "/Users/sachin/SachProjects/Autocation/integrated-app";

function read(relativePath) {
  return readFileSync(resolve(projectRoot, relativePath), "utf8");
}

test("collapsed desktop sidebar centers nav icons horizontally", () => {
  const source = read("components/app-shell.tsx");

  assert.match(
    source,
    /sidebarCollapsed \? "justify-center px-0" : "gap-3 px-3"/,
    "expected collapsed sidebar nav buttons to remove side padding and center their contents",
  );
  assert.match(
    source,
    /className=\{`relative z-10 flex items-center \$\{sidebarCollapsed \? "justify-center" : ""\}`\}/,
    "expected the nav content row to center horizontally when collapsed without forcing extra gap during the width animation",
  );
});
