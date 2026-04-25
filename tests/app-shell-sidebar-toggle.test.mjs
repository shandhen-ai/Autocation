import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = "/Users/sachin/SachProjects/Autocation/integrated-app";

function read(relativePath) {
  return readFileSync(resolve(projectRoot, relativePath), "utf8");
}

test("desktop sidebar reserves a right-edge gutter so the full toggle stays clickable", () => {
  const source = read("components/app-shell.tsx");

  assert.match(
    source,
    /<aside className="hidden md:flex min-h-screen shrink-0 relative z-20 overflow-visible">/,
    "expected desktop sidebar shell to allow overflow for the border-centered toggle",
  );
  assert.match(
    source,
    /className="relative h-screen max-h-screen overflow-visible pr-\[18px\]"/,
    "expected the animated sidebar wrapper to reserve gutter space for the full toggle hit area",
  );
  assert.match(
    source,
    /className="absolute right-0 top-1\/2 z-(20|30) flex size-9 -translate-y-1\/2 items-center justify-center rounded-full border border-primary\/25 bg-primary text-primary-foreground/,
    "expected sidebar toggle to stay inside the reserved gutter instead of hanging outside the hit area",
  );
  assert.match(
    source,
    /className="flex h-full flex-col overflow-hidden surface-card border-r border-border\/60"/,
    "expected the visible sidebar surface to stop before the gutter so the button stays centered on the border",
  );
});
