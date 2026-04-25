import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = "/Users/sachin/SachProjects/Autocation/integrated-app";

function read(relativePath) {
  return readFileSync(resolve(projectRoot, relativePath), "utf8");
}

test("desktop sidebar animates nav labels in place instead of unmounting them", () => {
  const source = read("components/app-shell.tsx");
  const navButtonSection = source.match(/const renderNavButton =[\s\S]*?\n  }\n\n  return \(/)?.[0] ?? "";

  assert.match(
    navButtonSection,
    /animate=\{\{\s*maxWidth: sidebarCollapsed \? 0 : 148,\s*opacity: sidebarCollapsed \? 0 : 1,\s*marginLeft: sidebarCollapsed \? 0 : 12,/s,
    "expected nav labels to animate width and opacity in place for a cleaner horizontal collapse",
  );
  assert.doesNotMatch(
    navButtonSection,
    /<AnimatePresence mode="wait" initial=\{false\}>/s,
    "expected nav labels to avoid wait-mode unmounting during sidebar collapse",
  );
});
