/**
 * 通用本地模拟 CMS 静态托管（仅开发验收用，不进入制品）。
 * 解析顺序与主题规范一致：精确文件 → {path}.html → {path}/index.html →
 * theme.json routes.fallback 壳页面（最长前缀）→ 404.html → 404。
 * /api/v1 代理到 mock API，模拟同域部署。
 * 用法：THEME_DIR=./food-diary SERVE_PORT=3308 node scripts/serve-dist.mjs
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const THEME_DIR = path.resolve(process.env.THEME_DIR || "");
const DIST = path.join(THEME_DIR, "dist");
const PORT = Number(process.env.SERVE_PORT || 3300);
const API_TARGET_HOST = "127.0.0.1";
const API_TARGET_PORT = Number(process.env.MOCK_PORT || 8222);

if (!fs.existsSync(DIST)) {
  console.error(`[serve-dist] dist not found: ${DIST}`);
  process.exit(1);
}

// theme.json routes.fallback："/articles/*": "/article.html" → 前缀匹配壳页面
const FALLBACKS = (() => {
  try {
    const theme = JSON.parse(fs.readFileSync(path.join(THEME_DIR, "theme.json"), "utf8"));
    return Object.entries(theme.routes?.fallback || {}).map(([route, file]) => ({
      prefix: route.replace(/\/\*$/, "/"),
      file: file.replace(/^\//, ""),
    }));
  } catch {
    return [];
  }
})();

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".map": "application/json",
};

function resolveFile(urlPath) {
  let p = decodeURIComponent(urlPath.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  if (p.includes("/.") || p === "/theme.json") return null;
  const safe = path.normalize(p).replace(/^(\.\.[/\\])+/, "");
  const exact = path.join(DIST, safe);
  if (!exact.startsWith(DIST)) return null;
  if (fs.existsSync(exact) && fs.statSync(exact).isFile()) return exact;
  if (fs.existsSync(exact + ".html")) return exact + ".html";
  if (fs.existsSync(path.join(exact, "index.html"))) return path.join(exact, "index.html");
  for (const fb of FALLBACKS) {
    if (p.startsWith(fb.prefix)) {
      const f = path.join(DIST, fb.file);
      if (fs.existsSync(f)) return f;
    }
  }
  const notFound = path.join(DIST, "404.html");
  return fs.existsSync(notFound) ? notFound : null;
}

function proxyApi(req, res) {
  const proxyReq = http.request(
    { host: API_TARGET_HOST, port: API_TARGET_PORT, path: req.url, method: req.method, headers: { ...req.headers, host: `${API_TARGET_HOST}:${API_TARGET_PORT}` } },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
      proxyRes.pipe(res);
    }
  );
  proxyReq.on("error", () => {
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ code: 500, msg: "mock api unreachable" }));
  });
  req.pipe(proxyReq);
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/api/")) return proxyApi(req, res);
  const file = resolveFile(req.url || "/");
  if (!file) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("404");
  }
  const is404 = file.endsWith("404.html");
  res.writeHead(is404 ? 404 : 200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, "127.0.0.1", () =>
  console.log(`[serve-dist] ${path.basename(THEME_DIR)} on http://127.0.0.1:${PORT} (fallbacks: ${FALLBACKS.length}, api proxy -> :${API_TARGET_PORT})`)
);
