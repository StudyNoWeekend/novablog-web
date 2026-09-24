/**
 * 本地验收用 Mock CMS 服务器（不进入主题制品）：
 * - 静态托管 melody-notes/dist（模拟 CMS 同域部署）
 * - 应答 /api/v1/public/* 公开接口（数据参照主题 UI 设计稿）
 * - 实现规范第六章的静态托管解析顺序（含 /articles/* → article.html 壳页面兜底）
 *
 * 用法：node mock-cms-server.mjs [port]   默认 3300
 */
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize } from "node:path";

const ROOT = new URL(".", import.meta.url).pathname;
const DIST = join(ROOT, "dist");
const PORT = Number(process.argv[2] || 3300);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
};

const pic = (seed, w = 800, h = 600) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const blogger = {
  nickname: "北岛有声",
  avatar: pic("beidao-avatar", 200, 200),
  bio: "音乐博主 | 热爱生活的耳机党",
  blog_title: "Melody Notes",
  blog_description:
    "这里是我的音乐角落，分享我喜欢的歌、歌单、音乐故事，也期待和你一起，发现更多好听的声音。",
  page_background: pic("melody-hero", 1600, 900),
  blog_icon: pic("melody-icon", 64, 64),
  email: "hi@melodynotes.fm",
  city: "上海",
  tags: ["我坚信，好的音乐能让平凡的日子也闪闪发光。", "City Pop", "后摇", "Lo-fi"],
  social_links: [
    { platform: "weibo", name: "微博", url: "https://weibo.com/", sort_order: 0 },
    { platform: "bilibili", name: "B站", url: "https://bilibili.com/", sort_order: 1 },
    { platform: "email", name: "Email", url: "hi@melodynotes.fm", sort_order: 2 },
  ],
};

const songs = [
  { title: "Let It Happen", artist: "Tame Impala", duration: 288, cat: null },
  { title: "夜空中最亮的星", artist: "逃跑计划", duration: 259, cat: null },
  { title: "Someone Like You", artist: "Adele", duration: 285, cat: null },
  { title: "花火", artist: "きゃりーぱみゅぱみゅ", duration: 294, cat: null },
  { title: "Ocean Eyes", artist: "Billie Eilish", duration: 200, cat: null },
  { title: "海阔天空", artist: "Beyond", duration: 326, cat: null },
  { title: "Lemon", artist: "米津玄師", duration: 254, cat: null },
  { title: "成都", artist: "赵雷", duration: 346, cat: null },
].map((s, i) => ({
  id: `song-${i + 1}`,
  title: s.title,
  artist: s.artist,
  cover_url: pic(`cover-${i + 1}`, 400, 400),
  // mock 统一指向一个可外链播放的真实 B 站视频，方便本地验收播放/进度/切歌
  bvid: "BV1GJ411x7h7",
  cid: 1000 + i,
  source_url: "https://www.bilibili.com/",
  source_type: "bilibili",
  category_id: s.cat,
  // 与真实视频时长保持一致，估算进度条才能和视频对得上
  duration: 213,
  sort_order: i,
  created_at: "2025-04-01T10:00:00Z",
  updated_at: "2025-04-01T10:00:00Z",
}));

const playlists = [
  { title: "治愈系｜让心慢下来的音乐", desc: "共 42 首 · 适合傍晚与雨天", seed: "pl-heal" },
  { title: "City Pop｜复古与浪漫的邂逅", desc: "共 37 首 · 80 年代都市夜色", seed: "pl-city" },
  { title: "独立音乐｜小众宝藏推荐", desc: "共 58 首 · 私藏不设防", seed: "pl-indie" },
  { title: "学习/工作｜专注与效率", desc: "共 34 首 · 深流白噪音", seed: "pl-focus" },
  { title: "华语民谣｜南方的站台", desc: "共 45 首 · 吉他与人声", seed: "pl-folk" },
  { title: "电子漫游｜午夜航班", desc: "共 29 首 ·合成器浪潮", seed: "pl-edm" },
].map((p, i) => ({
  id: `pl-${i + 1}`,
  title: p.title,
  cover_url: pic(p.seed, 600, 600),
  platform: ["网易云", "Spotify", "QQ 音乐", "Apple Music"][i % 4],
  platform_url: "https://music.163.com/",
  description: p.desc,
  sort_order: i,
  enabled: true,
  created_at: "2025-04-01T10:00:00Z",
  updated_at: "2025-04-01T10:00:00Z",
}));

const articles = [
  {
    title: "那些一听就会爱上的治愈系英文歌",
    summary: "有首歌，像一束光，照进了你疲惫的日常。",
    cat: "音乐推荐",
    views: 3200,
    slug: "healing-english-songs",
  },
  {
    title: "10首适合深夜独处的音乐",
    summary: "当世界安静下来，音乐就是最好的陪伴。",
    cat: "歌单分享",
    views: 4600,
    slug: "late-night-music",
  },
  {
    title: "从《海阔天空》聊聊Beyond的影响",
    summary: "一首歌，能成为一代人的青春。",
    cat: "音乐故事",
    views: 6100,
    slug: "beyond-story",
  },
  {
    title: "City Pop 入门指南：从竹内玛莉亚开始",
    summary: "复古的贝斯线一响，整个城市都亮起了霓虹。",
    cat: "音乐推荐",
    views: 2800,
    slug: "citypop-guide",
  },
  {
    title: "我的年度十首循环（2025 版）",
    summary: "一年又一年，歌单就是生活的年轮。",
    cat: "歌单分享",
    views: 5400,
    slug: "yearly-top10",
  },
  {
    title: "耳机发烧入门：前端、单元与调音",
    summary: "好音乐值得好声音，但别掉进玄学的坑。",
    cat: "器材漫谈",
    views: 1900,
    slug: "hifi-starter",
  },
].map((a, i) => ({
  id: `art-${i + 1}`,
  title: a.title,
  slug: a.slug,
  summary: a.summary,
  cover_image: pic(`article-${i + 1}`, 900, 600),
  category_id: `cat-${(i % 3) + 1}`,
  category_name: a.cat,
  tag_ids: [],
  tag_names: ["治愈", "耳机党", "私藏歌单"].slice(0, (i % 3) + 1),
  status: 2,
  type: 1,
  view_count: a.views,
  comment_count: i === 0 ? 2 : 0,
  is_top: i === 0,
  is_comment: true,
  published_at: `2025-04-${String(28 - i * 4).padStart(2, "0")}T12:00:00Z`,
  created_at: `2025-04-${String(28 - i * 4).padStart(2, "0")}T12:00:00Z`,
  updated_at: `2025-04-${String(28 - i * 4).padStart(2, "0")}T12:00:00Z`,
  content: `## 写在前面\n\n音乐是时间的容器。今天想和你分享这份歌单，希望某一段旋律刚好接住你此刻的心情。\n\n## 01 · 主打推荐\n\n**《Let It Happen》** 是那种一开始听觉得长，听完只想再来一遍的歌。\n\n> 迷幻的合成器层层推进，像海浪一样把人卷进去。\n\n- 适合傍晚散步时听\n- 适合深夜赶工时听\n- 适合发呆时听\n\n## 02 · 收藏清单\n\n1. 夜空中最亮的星 — 逃跑计划\n2. Someone Like You — Adele\n3. Ocean Eyes — Billie Eilish\n\n\`\`\`\n_fn: play(“melody-notes”)\n\`\`\`\n\n我们下期再见，Good Music, Better Life ♪`,
}));

const comments = [
  {
    id: "c-1",
    target_type: "article",
    target_id: "art-1",
    parent_id: null,
    nickname: "深夜电台",
    website: "",
    content: "第一首一秒入睡，感谢博主的私藏！",
    is_blogger: false,
    created_at: "2025-04-17T08:00:00Z",
  },
  {
    id: "c-2",
    target_type: "article",
    target_id: "art-1",
    parent_id: "c-1",
    nickname: "北岛有声",
    website: "",
    content: "欢迎常来，每周五更新～",
    is_blogger: true,
    created_at: "2025-04-17T09:00:00Z",
  },
];

const categories = [
  { id: "cat-1", name: "音乐推荐", slug: "rec", description: "", type: "article", sort_order: 0, created_at: "2025-04-01T10:00:00Z" },
  { id: "cat-2", name: "歌单分享", slug: "playlist", description: "", type: "article", sort_order: 1, created_at: "2025-04-01T10:00:00Z" },
  { id: "cat-3", name: "音乐故事", slug: "story", description: "", type: "article", sort_order: 2, created_at: "2025-04-01T10:00:00Z" },
];

const tags = [
  { id: "t-1", name: "治愈", created_at: "2025-04-01T10:00:00Z" },
  { id: "t-2", name: "耳机党", created_at: "2025-04-01T10:00:00Z" },
  { id: "t-3", name: "私藏歌单", created_at: "2025-04-01T10:00:00Z" },
];

const ok = (data) => ({ code: 0, msg: "success", data, trace_id: "mock" });
const paginate = (list, q) => {
  const page = Math.max(1, Number(q.get("page") || 1));
  const pageSize = Math.max(1, Number(q.get("page_size") || 20));
  return {
    list: list.slice((page - 1) * pageSize, page * pageSize),
    total: list.length,
    page,
    page_size: pageSize,
    total_pages: Math.ceil(list.length / pageSize),
  };
};

function handleApi(req, url) {
  const q = url.searchParams;
  const path = url.pathname.replace(/^\/api\/v1/, "");
  let data = null;
  if (path === "/public/blogger") data = blogger;
  else if (path === "/public/module-config")
    data = {
      article_enabled: true, media_enabled: true, music_enabled: true,
      video_enabled: false, travel_enabled: false, portfolio_enabled: false,
      equipment_enabled: false, updated_at: "2025-04-01T10:00:00Z",
    };
  else if (path === "/public/music/songs") {
    const kwCat = q.get("category_id");
    data = paginate(kwCat ? songs.filter((s) => s.category_id === kwCat) : songs, q);
  } else if (path.match(/^\/public\/music\/audio-url\/[\w-]+$/)) {
    const songId = path.split("/").pop();
    const song = songs.find((s) => s.id === songId) ?? songs[0];
    // B 站官方外链播放器地址（防盗链拿不到音频直链，mock 同样返回真实格式）
    data = {
      url: `https://player.bilibili.com/player.html?bvid=${song.bvid}&autoplay=1&danmaku=0&high_quality=1`,
    };
  }
  else if (path === "/public/music/playlists" || path === "/public/playlists")
    data = playlists;
  else if (path === "/public/articles") {
    const kw = (q.get("keyword") || "").toLowerCase();
    const cat = q.get("category_id");
    let filtered = articles;
    if (kw) filtered = filtered.filter((a) => a.title.toLowerCase().includes(kw));
    if (cat) filtered = filtered.filter((a) => a.category_id === cat);
    data = paginate(filtered, q);
  } else if (path === "/public/articles/hot" || path === "/public/articles/random")
    data = [...articles].sort((a, b) => b.view_count - a.view_count).slice(0, Number(q.get("count") || 5));
  else if (path.match(/^\/public\/articles\/[^/]+$/)) {
    const slug = decodeURIComponent(path.split("/").pop());
    data = articles.find((a) => a.slug === slug) ?? null;
    if (!data) return { status: 404, body: { code: 404001, msg: "资源不存在", trace_id: "mock" } };
  } else if (path.match(/^\/public\/articles\/[^/]+\/view$/)) {
    data = null;
  } else if (path === "/public/comments") {
    const tid = q.get("target_id");
    data = paginate(comments.filter((c) => !tid || c.target_id === tid), q);
  } else if (path === "/public/categories") data = categories;
  else if (path === "/public/tags") data = tags;
  else return { status: 404, body: { code: 404001, msg: "资源不存在", trace_id: "mock" } };
  return { status: 200, body: ok(data) };
}

async function serveStatic(url) {
  let pathname = decodeURI(url.pathname);
  try { pathname = decodeURIComponent(pathname); } catch { /* keep raw */ }

  const candidates = [];
  if (pathname.endsWith("/")) candidates.push(join(DIST, pathname, "index.html"));
  else {
    candidates.push(join(DIST, pathname));
    candidates.push(join(DIST, `${pathname}.html`));
    candidates.push(join(DIST, pathname, "index.html"));
  }

  for (const file of candidates) {
    const normalized = normalize(file);
    if (!normalized.startsWith(DIST)) continue;
    try {
      const st = await stat(normalized);
      if (st.isFile()) return { file: normalized };
    } catch { /* try next */ }
  }

  // fallback 壳页面（最长前缀）：/articles/* → /article.html
  if (pathname.startsWith("/articles/")) {
    return { file: join(DIST, "article.html") };
  }
  // 最终兜底 404.html
  return { file: join(DIST, "404.html"), notFound: true };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  try {
    if (url.pathname.startsWith("/api/v1/")) {
      const { status, body } = handleApi(req, url);
      res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify(body));
      return;
    }
    const hit = await serveStatic(url);
    const buf = await readFile(hit.file);
    res.writeHead(hit.notFound ? 404 : 200, {
      "Content-Type": MIME[extname(hit.file)] || "application/octet-stream",
      "Cache-Control": hit.file.includes("/_next/") ? "public, max-age=31536000, immutable" : "no-cache",
    });
    res.end(buf);
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ code: 500001, msg: String(err) }));
  }
});

server.listen(PORT, () => {
  console.log(`[mock-cms] melody-notes served at http://localhost:${PORT}`);
});
