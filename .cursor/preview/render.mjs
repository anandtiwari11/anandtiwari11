// Shared rendering logic for the profile README preview.
// Used by both server.mjs (live preview) and render-check.mjs (verification).

import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Marked } from "marked";
import { gfmHeadingId } from "marked-gfm-heading-id";

const here = dirname(fileURLToPath(import.meta.url));
export const repoRoot = join(here, "..", "..");
export const readmePath = join(repoRoot, "README.md");
const cssPath = join(here, "node_modules", "github-markdown-css", "github-markdown.css");

const marked = new Marked({ gfm: true, breaks: false });
marked.use(gfmHeadingId());

export async function readmeMtime() {
  try {
    const info = await stat(readmePath);
    return Math.floor(info.mtimeMs);
  } catch {
    return 0;
  }
}

export async function renderPage() {
  let markdown = "";
  try {
    markdown = await readFile(readmePath, "utf8");
  } catch {
    markdown = "";
  }

  let css = "";
  try {
    css = await readFile(cssPath, "utf8");
  } catch {
    css = "body{font-family:sans-serif;max-width:760px;margin:2rem auto;}";
  }

  const body = markdown.trim()
    ? marked.parse(markdown)
    : "<p><em>README.md is empty. Add content and save to see it rendered here.</em></p>";

  const mtime = await readmeMtime();

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Profile README preview</title>
<style>${css}</style>
<style>
  body { box-sizing: border-box; min-width: 200px; max-width: 980px; margin: 0 auto; padding: 45px; background: #ffffff; }
  @media (prefers-color-scheme: dark) { body { background: #0d1117; } }
  .preview-banner { font: 13px/1.5 -apple-system, Segoe UI, sans-serif; color: #57606a; margin-bottom: 16px; }
</style>
</head>
<body>
<div class="preview-banner">Live preview of <code>README.md</code> &middot; auto-refreshes on save</div>
<article class="markdown-body">
${body}
</article>
<script>
  const initial = ${mtime};
  async function poll() {
    try {
      const res = await fetch("/mtime", { cache: "no-store" });
      const { mtime } = await res.json();
      if (mtime !== initial) location.reload();
    } catch {}
  }
  setInterval(poll, 1500);
</script>
</body>
</html>`;
}
