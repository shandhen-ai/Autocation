import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = "/Users/sachin/SachProjects/Autocation/integrated-app";

function read(relativePath) {
  return readFileSync(resolve(projectRoot, relativePath), "utf8");
}

test("sitewide sans font is wired to Google Sans", () => {
  const layout = read("app/layout.tsx");
  const globals = read("app/globals.css");
  const tailwindConfig = read("tailwind.config.ts");

  assert.match(layout, /import\s+\{\s*Google_Sans,\s*Geist_Mono\s*\}\s+from\s+'next\/font\/google'/);
  assert.match(layout, /variable:\s*"--font-google-sans"/);
  assert.match(layout, /className=\{`\$\{googleSans\.variable\}\s+\$\{geistMono\.variable\}.*font-sans.*antialiased`\}/);

  assert.match(globals, /--font-sans:\s*var\(--font-google-sans\);/);
  assert.doesNotMatch(globals, /--font-sans:\s*var\(--font-geist-sans\);/);

  assert.match(tailwindConfig, /sans:\s*\["var\(--font-google-sans\)",\s*"sans-serif"\]/);
  assert.doesNotMatch(tailwindConfig, /var\(--font-geist-sans\)/);
});
