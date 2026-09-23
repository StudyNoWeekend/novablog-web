/**
 * 本地模拟 CMS 静态托管 + 壳页面兜底（仅开发验收用，不进入制品）。
 * 解析顺序与主题规范 3.4/第六章一致：
 *   精确文件 → {path}.html → {path}/index.html → fallback 壳页面（最长前缀）→ 404.html → 404
 * 并把 /api/v1 代理到 mock API（默认 localhost:8222），模拟同域部署。
 * 用法：node serve-dist.mjs  （服务 dist/，默认端口 3311）
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "dist");
const PORT = Number(process.env.SERVE_PORT || 3311);
const API_TARGET_HOST = "localhost";
const API_TARGET_PORT = Number(process.env.MOCK_PORT || 8222);

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
};

// theme.json routes.fallback（与制品内声明保持一致）
const FALLBACKS = [
  { prefix: "/articles/", file: "article.html" },
  { prefix: "/travels/", file: "travel.html" },
];

function send(res, code, body, type) {
  res.writeHead(code, { "Content-Type": type || MIME[path.extname(body)] || "application/octet-stream" });
  fs.createReadStream(body).pipe(res);
}

function resolveFile(urlPath) {
  let p = decodeURIComponent(urlPath.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  // dotfile 与 theme.json 直出拒绝（与 CMS 防护一致）
  if (p.includes("/.") || p === "/theme.json") return null;
  const safe = path.normalize(p).replace(/^(\.\.[/\\])+/, "");
  const exact = path.join(DIST, safe);
  if (!exact.startsWith(DIST)) return null;
  if (fs.existsSync(exact) && fs.statSync(exact).isFile()) return exact;
  if (fs.existsSync(exact + ".html")) return exact + ".html";
  if (fs.existsSync(path.join(exact, "index.html"))) return path.join(exact, "index.html");
  // fallback 壳页面（最长前缀）
  for (const fb of FALLBACKS) {
    if (p.startsWith(fb.prefix)) {
      const f = path.join(DIST, fb.file);
      if (fs.existsSync(f)) return f;
    }
  }
  const notFound = path.join(DIST, "404.html");
  if (fs.existsSync(notFound)) return notFound;
  return null;
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
  const exact = !is404;
  res.writeHead(exact ? 200 : 404, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, () => console.log(`[serve-dist] http://localhost:${PORT} (dist/ + fallback shells + api proxy -> :${API_TARGET_PORT})`));
