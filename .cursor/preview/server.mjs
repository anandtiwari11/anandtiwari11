// Local GitHub-flavored markdown preview server for the profile README.
//
// Renders ../../README.md as GitHub-flavored markdown and serves it with the
// same stylesheet GitHub uses (github-markdown-css). The page live-reloads:
// the browser polls /mtime and refreshes whenever README.md changes on disk,
// so editing the README and saving shows the rendered result immediately.

import http from "node:http";
import { renderPage, readmeMtime, readmePath } from "./render.mjs";

const PORT = Number(process.env.PORT ?? process.env.PREVIEW_PORT ?? 3000);
const HOST = process.env.HOST ?? "0.0.0.0";

const server = http.createServer(async (req, res) => {
  try {
    if (req.url === "/mtime") {
      const mtime = await readmeMtime();
      res.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store" });
      res.end(JSON.stringify({ mtime }));
      return;
    }
    if (req.url === "/healthz") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("ok");
      return;
    }
    const html = await renderPage();
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
    res.end(html);
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Preview error: " + (err?.message ?? String(err)));
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Profile README preview server running at http://${HOST}:${PORT}`);
  console.log(`Rendering: ${readmePath}`);
});
