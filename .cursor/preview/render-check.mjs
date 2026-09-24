// End-to-end smoke test for the preview renderer.
// Renders the real README.md and asserts the output is a valid HTML page
// containing the GitHub markdown styling and rendered content.

import { renderPage } from "./render.mjs";

const html = await renderPage();

const checks = [
  ["is a full HTML document", html.startsWith("<!DOCTYPE html>")],
  ["includes markdown-body article", html.includes('class="markdown-body"')],
  ["includes github-markdown-css", html.includes(".markdown-body")],
  ["includes live-reload poller", html.includes("/mtime")],
];

let failed = false;
for (const [label, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"}: ${label}`);
  if (!ok) failed = true;
}

if (failed) {
  console.error("Render check failed.");
  process.exit(1);
}
console.log("All render checks passed.");
