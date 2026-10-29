import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json",
};
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    let target = resolve(root, "." + pathname);
    if (target !== root && !target.startsWith(root + sep)) {
      res.writeHead(403);
      res.end("Acesso negado");
      return;
    }
    if ((await stat(target)).isDirectory())
      target = resolve(target, "index.html");
    const data = await readFile(target);
    res.writeHead(200, {
      "Content-Type": types[extname(target)] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(req.method === "HEAD" ? undefined : data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Página não encontrada");
  }
}).listen(port, "127.0.0.1", () =>
  console.log(`LP disponível em http://localhost:${port}`),
);
