import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = "/Users/sachin/SachProjects/Autocation/integrated-app";

function read(relativePath) {
  return readFileSync(resolve(projectRoot, relativePath), "utf8");
}

test("dashboard sidebar keeps its own desktop collapse toggle", () => {
  const source = read("components/dashboard.tsx");

  assert.match(
    source,
    /const \[sidebarCollapsed, setSidebarCollapsed\] = useState\(false\)/,
    "expected dashboard route to track desktop sidebar collapse state instead of relying on app-shell",
  );
  assert.match(
    source,
    /<Sidebar\s+activePage=\{activePage\}\s+onNav=\{handleNav\}\s+collapsed=\{sidebarCollapsed\}\s+showCollapseToggle/,
    "expected desktop dashboard sidebar to receive collapsed state and show its own toggle",
  );
  assert.match(
    source,
    /aria-label=\{collapsed \? "Expand sidebar" : "Collapse sidebar"\}/,
    "expected dashboard sidebar toggle to expose expand and collapse labels",
  );
  assert.match(
    source,
    /className="relative min-h-screen shrink-0 overflow-visible pr-\[18px\]"/,
    "expected dashboard sidebar to reserve gutter space for the full toggle hit area",
  );
  assert.match(
    source,
    /className="absolute right-0 top-1\/2 z-30 flex size-9 -translate-y-1\/2 items-center justify-center rounded-full border border-primary\/25 bg-primary text-primary-foreground/,
    "expected dashboard sidebar toggle to stay inside the reserved gutter instead of hanging outside the hit area",
  );
  assert.match(
    source,
    /className="flex min-h-screen flex-col overflow-hidden surface-card border-r border-border\/60"/,
    "expected the visible dashboard sidebar surface to keep full viewport height while preserving the gutter for the toggle",
  );
});
