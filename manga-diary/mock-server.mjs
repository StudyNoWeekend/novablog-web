/**
 * 本地视觉验收用 mock API（仅开发调试，不进入制品）。
 * 覆盖 manga-diary 主题消费的全部公开接口，数据样式对照 UI 设计图。
 * 用法：node mock-server.mjs  （默认端口 8333）
 */
import http from "node:http";

const PORT = process.env.MOCK_PORT || 8333;

const img = (seed, w = 800, h = 600) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const blogger = {
  nickname: "墨染小町",
  avatar: img("manga-avatar", 400, 400),
  bio: "我是墨染小町，一名热爱漫画的自由创作者。\n喜欢画温暖、治愈、带点奇幻色彩的故事，\n也喜欢把生活中的小确幸画进漫画里。\n希望我的作品，能让你在忙碌的生活中，找到一点快乐和共鸣。",
  email: "moran@example.com",
  city: "杭州",
  blog_title: "墨染小町",
  blog_description: "用漫画记录生活",
  page_background: img("manga-hero", 1600, 900),
  blog_icon: img("manga-icon", 200, 200),
  social_links: [
    { platform: "bilibili", name: "B站", url: "https://space.bilibili.com/moran", sort_order: 0 },
    { platform: "weibo", name: "微博", url: "https://weibo.com/moran", sort_order: 1 },
    { platform: "douyin", name: "抖音", url: "https://douyin.com/moran", sort_order: 2 },
    { platform: "xiaohongshu", name: "小红书", url: "https://xhslink.com/moran", sort_order: 3 },
    { platform: "x", name: "X", url: "https://x.com/moran", sort_order: 4 },
  ],
  tags: ["原创漫画", "日常随笔", "绘画分享", "ACG热爱"],
};

const categories = [
  { id: "c1", name: "原创漫画", slug: "original", description: "一格一格的小世界", type: "article", sort_order: 0, created_at: "2025-01-01T00:00:00Z" },
  { id: "c2", name: "日常随笔", slug: "essay", description: "画画的日常", type: "article", sort_order: 1, created_at: "2025-01-01T00:00:00Z" },
  { id: "c3", name: "绘画教程", slug: "tutorial", description: "把技巧画给你看", type: "article", sort_order: 2, created_at: "2025-01-01T00:00:00Z" },
  { id: "c4", name: "参展手记", slug: "events", description: "漫展与市集", type: "article", sort_order: 3, created_at: "2025-01-01T00:00:00Z" },
];

const tags = ["治愈", "日常", "校园", "奇幻", "猫咪", "绘画教程", "生活随笔", "ACG", "旅行", "水彩"].map((name, i) => ({
  id: `t${i + 1}`,
  name,
  created_at: "2025-01-01T00:00:00Z",
}));

const articles = [
  { slug: "he-mao-kan-hai", title: "《和猫的夏天》更新第5话：和猫一起看海", category_id: "c1", summary: "阳光、海风，还有一只懒得动的猫～", cover: img("comic-summer-cat"), views: 12000, comments: 12, days: 5 },
  { slug: "zhoubian-zhoubian", title: "新周边企划｜猫咪立牌和明信片上线啦！", category_id: "c4", summary: "喜欢的话可以去我的小店看看哦～", cover: img("comic-goods"), views: 8600, comments: 9, days: 11 },
  { slug: "xx-dongman-zhan", title: "参加了XX动漫展，现场超多有趣的同好！", category_id: "c4", summary: "感谢每一位来找我签字画画的朋友！", cover: img("comic-expo"), views: 15000, comments: 21, days: 16 },
  { slug: "shui-cai-ru-men", title: "水彩天空教程｜三步画出漫画里的黄昏", category_id: "c3", summary: "暖色调的叠色小技巧，新手也能学会。", cover: img("comic-tutorial"), views: 23000, comments: 34, days: 22 },
  { slug: "shen-ye-bian-li-dian", title: "《深夜便利店》短篇：凌晨三点的关东煮", category_id: "c1", summary: "深夜的城市，总有一盏灯为晚归的人亮着。", cover: img("comic-night-store"), views: 6600, comments: 5, days: 28 },
  { slug: "huabao-cao-gao", title: "封面草稿大公开｜从铅笔稿到上色", category_id: "c2", summary: "被毙掉的三个版本也一并发出来（笑）。", cover: img("comic-sketch"), views: 9900, comments: 15, days: 33 },
  { slug: "mao-de-su-miao", title: "给流浪猫画速写｜第五只愿意坐下的猫", category_id: "c2", summary: "它蹲了十分钟，换来一根小鱼干和一张肖像。", cover: img("comic-stray-cat"), views: 30000, comments: 42, days: 40 },
  { slug: "weiba-de-ji-mi", title: "绘画工具分享｜我的随身画袋里有什么", category_id: "c3", summary: "从 0.3 自动铅笔到便携水彩，全部都在这里。", cover: img("comic-tools"), views: 7200, comments: 8, days: 46 },
];

const articleList = articles.map((a, i) => ({
  id: `a${i + 1}`,
  title: a.title,
  slug: a.slug,
  summary: a.summary,
  cover_image: a.cover,
  category_id: a.category_id,
  category_name: categories.find((c) => c.id === a.category_id)?.name || "",
  tag_ids: [tags[i % tags.length].id],
  tag_names: [tags[i % tags.length].name],
  status: 2,
  type: 1,
  view_count: a.views,
  comment_count: a.comments,
  is_top: i === 0,
  is_comment: true,
  published_at: new Date(Date.now() - a.days * 86400000).toISOString(),
  created_at: new Date(Date.now() - a.days * 86400000).toISOString(),
  updated_at: new Date(Date.now() - a.days * 86400000).toISOString(),
}));

const portfolios = [
  { id: "p1", name: "和猫的夏天", category_id: "c1", category_name: "治愈短篇", count: 12, days: 6, seed: "comic-summer-cat", description: "一个女孩和一只猫的夏日物语，连载中。" },
  { id: "p2", name: "深夜便利店", category_id: "c1", category_name: "奇幻短篇", count: 8, days: 15, seed: "comic-night-store", description: "只在凌晨开门的便利店，贩卖奇怪又温柔的商品。" },
  { id: "p3", name: "未完待续的心跳", category_id: "c1", category_name: "校园恋爱", count: 10, days: 24, seed: "comic-heartbeat", description: "关于暗恋、天台和没说出口的话。" },
  { id: "p4", name: "一个人的小旅行", category_id: "c1", category_name: "旅行随笔", count: 6, days: 35, seed: "comic-solo-trip", description: "背包、火车和速写本，短篇完结。" },
  { id: "p5", name: "猫猫表情包合集", category_id: "c1", category_name: "贴图企划", count: 9, days: 48, seed: "comic-stickers", description: "免费可用的手绘猫猫表情。" },
  { id: "p6", name: "插画练习簿", category_id: "c1", category_name: "日常练习", count: 14, days: 60, seed: "comic-sketchbook", description: "每天一页的涂鸦与色彩练习。" },
];

const portfolioList = portfolios.map((p) => ({
  id: p.id,
  name: p.name,
  description: p.description,
  cover_mode: 1,
  cover_preset_id: "",
  cover_url: img(p.seed, 900, 675),
  status: 1,
  sort_order: portfolios.indexOf(p),
  category_id: p.category_id,
  category_name: p.category_name,
  item_count: p.count,
  created_at: new Date(Date.now() - p.days * 86400000).toISOString(),
  updated_at: new Date(Date.now() - p.days * 86400000).toISOString(),
}));

const songs = [
  { id: "s1", title: "夏天的风（翻唱）", artist: "软糖少女", duration: 245, seed: "song-summer", bvid: "BV1GJ411x7h7" },
  { id: "s2", title: "画笔与猫", artist: "墨染小町", duration: 198, seed: "song-cat-pen", bvid: "BV1GJ411x7h7" },
  { id: "s3", title: "雨天的便利店", artist: "夜航星", duration: 260, seed: "song-rain-store", bvid: "BV1GJ411x7h7" },
  { id: "s4", title: "阳台上的下午", artist: "橘猫电台", duration: 187, seed: "song-balcony", bvid: "BV1GJ411x7h7" },
  { id: "s5", title: "晚安，明天见", artist: "小岛工作室", duration: 232, seed: "song-goodnight", bvid: "BV1GJ411x7h7" },
];

const songList = songs.map((s, i) => ({
  id: s.id,
  title: s.title,
  artist: s.artist,
  cover_url: img(s.seed, 300, 300),
  bvid: s.bvid,
  cid: 1000 + i,
  source_url: `https://www.bilibili.com/video/${s.bvid}`,
  source_type: "bilibili",
  category_id: null,
  duration: s.duration,
  sort_order: i,
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
}));

const playlists = [
  {
    id: "pl1",
    title: "画画时听的歌",
    cover_url: img("playlist-drawing", 600, 400),
    platform: "网易云音乐",
    platform_url: "https://music.163.com/#/playlist?id=1",
    description: "赶稿必备的安静歌单。",
    sort_order: 0,
    enabled: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "pl2",
    title: "深夜涂鸦电台",
    cover_url: img("playlist-night", 600, 400),
    platform: "B站",
    platform_url: "https://space.bilibili.com/moran",
    description: "凌晨三点的城市配乐。",
    sort_order: 1,
    enabled: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
];

const commentsStore = {
  "article:a1": [
    { id: "cm1", parent_id: null, nickname: "猫奴一枚", website: "", content: "猫猫看海那张太治愈了！已设为壁纸～", is_blogger: false, created_at: "2025-04-27T10:00:00Z" },
    { id: "cm2", parent_id: "cm1", nickname: "墨染小町", website: "", content: "谢谢！下一话猫猫会穿上小救生衣（虽然它不想）。", is_blogger: true, created_at: "2025-04-27T11:00:00Z" },
  ],
  "article:a4": [
    { id: "cm3", parent_id: null, nickname: "水彩新手", website: "", content: "照着教程画了，天空真的有效！感谢！", is_blogger: false, created_at: "2025-05-12T09:00:00Z" },
  ],
};

// CMS 后台为富文本编辑器，文章正文 content 为 HTML
const articleContent = `<h2>这一话画了什么</h2>
<p>第 5 话里，小夏带着猫猫去看了海。<strong>海风把草稿纸吹起来</strong>的那一格，我重画了 4 遍。</p>
<ul>
<li>分镜：24 格（比上一话多了 6 格）</li>
<li>上色：水彩 + 数位板混合</li>
<li>猫猫出镜格数：19 格（当然）</li>
</ul>
<h2>创作小记</h2>
<blockquote>画海浪的时候循环了一整天的海浪白噪音，感觉自己也在度假。</blockquote>
<p><code>下一点小心思</code>：把猫猫的项圈画成了黄色，和本主题的强调色一样（你发现了吗）。</p>
<p><img src="https://picsum.photos/seed/comic-beach-detail/800/500" alt="海边分镜草稿" /></p>
<p>下一话会在两周后更新，去评论区猜猜猫猫会捡到什么吧！</p>`;

const ok = (res, data) => {
  res.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Accept",
  });
  res.end(JSON.stringify({ code: 0, msg: "success", data }));
};

const page = (list, q) => {
  const p = Number(q.get("page") || 1);
  const size = Number(q.get("page_size") || 20);
  return {
    list: list.slice((p - 1) * size, p * size),
    total: list.length,
    page: p,
    page_size: size,
    total_pages: Math.max(1, Math.ceil(list.length / size)),
  };
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;
  const q = url.searchParams;

  if (req.method === "OPTIONS") return ok(res, null);

  // 博主
  if (path === "/api/v1/public/blogger") return ok(res, blogger);

  // 模块开关
  if (path === "/api/v1/public/module-config") {
    return ok(res, {
      article_enabled: true,
      media_enabled: true,
      music_enabled: true,
      video_enabled: true,
      travel_enabled: true,
      portfolio_enabled: true,
      equipment_enabled: true,
      updated_at: "2025-09-01T00:00:00Z",
    });
  }

  // 分类 / 标签
  if (path === "/api/v1/public/categories") return ok(res, categories);
  if (path === "/api/v1/public/tags") return ok(res, tags);

  // 文章
  if (path === "/api/v1/public/articles") {
    let list = articleList;
    const cid = q.get("category_id");
    const kw = q.get("keyword");
    if (cid) list = list.filter((a) => a.category_id === cid);
    if (kw) list = list.filter((a) => a.title.includes(kw) || a.tag_names.some((t) => t.includes(kw)));
    return ok(res, page(list, q));
  }
  if (path === "/api/v1/public/articles/hot") {
    const n = Number(q.get("count") || 5);
    return ok(res, [...articleList].sort((a, b) => b.view_count - a.view_count).slice(0, n));
  }
  if (path === "/api/v1/public/articles/random") {
    const n = Number(q.get("count") || 5);
    return ok(res, [...articleList].sort(() => Math.random() - 0.5).slice(0, n));
  }
  const articleView = path.match(/^\/api\/v1\/public\/articles\/([^/]+)\/view$/);
  if (articleView) return ok(res, null);
  const articleOne = path.match(/^\/api\/v1\/public\/articles\/([^/]+)$/);
  if (articleOne) {
    const a = articleList.find((x) => x.slug === decodeURIComponent(articleOne[1]));
    if (!a) {
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" });
      return res.end(JSON.stringify({ code: 404001, msg: "资源不存在" }));
    }
    return ok(res, { ...a, content: articleContent, extra: {} });
  }

  // 作品集
  if (path === "/api/v1/public/portfolios") {
    let list = portfolioList;
    const cid = q.get("category_id");
    if (cid) list = list.filter((p) => p.category_id === cid);
    return ok(res, page(list, q));
  }
  const portfolioOne = path.match(/^\/api\/v1\/public\/portfolios\/([^/]+)$/);
  if (portfolioOne) {
    const p = portfolioList.find((x) => x.id === decodeURIComponent(portfolioOne[1]));
    if (!p) {
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" });
      return res.end(JSON.stringify({ code: 404001, msg: "资源不存在" }));
    }
    const meta = portfolios.find((x) => x.id === p.id);
    const items = Array.from({ length: p.item_count }, (_, i) => ({
      id: `${p.id}-i${i + 1}`,
      portfolio_id: p.id,
      preset_id: "",
      title: `${p.name} · 第${i + 1}页`,
      description: "",
      sort_order: i,
      output_url: img(`${meta.seed}-${i + 1}`, 800, 600),
      mime_type: "image/jpeg",
      output_size: 102400,
      created_at: p.created_at,
      updated_at: p.updated_at,
    }));
    return ok(res, { ...p, items });
  }

  // 音乐
  if (path === "/api/v1/public/music/songs") return ok(res, page(songList, q));
  const songAudio = path.match(/^\/api\/v1\/public\/music\/audio-url\/([^/]+)$/);
  if (songAudio) {
    const s = songList.find((x) => x.id === decodeURIComponent(songAudio[1]));
    const bvid = s?.bvid || "BV1GJ411x7h7";
    return ok(res, {
      url: `https://player.bilibili.com/player.html?bvid=${bvid}&autoplay=1&danmaku=0&high_quality=1`,
    });
  }
  if (path === "/api/v1/public/music/playlists") return ok(res, playlists);

  // 评论
  if (path === "/api/v1/public/comments" && req.method === "GET") {
    const key = `${q.get("target_type")}:${q.get("target_id")}`;
    const list = commentsStore[key] || [];
    return ok(res, page(list, q));
  }
  if (path === "/api/v1/public/comments" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    return req.on("end", () => {
      try {
        const payload = JSON.parse(body || "{}");
        const item = {
          id: `cm${Date.now()}`,
          parent_id: payload.parent_id || null,
          nickname: payload.nickname,
          website: payload.website || "",
          content: payload.content,
          is_blogger: false,
          created_at: new Date().toISOString(),
        };
        const key = `${payload.target_type}:${payload.target_id}`;
        commentsStore[key] = commentsStore[key] || [];
        commentsStore[key].push(item);
        ok(res, item);
      } catch {
        res.writeHead(400, { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" });
        res.end(JSON.stringify({ code: 400001, msg: "请求参数错误" }));
      }
    });
  }

  res.writeHead(404, { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" });
  res.end(JSON.stringify({ code: 404001, msg: "资源不存在" }));
});

server.listen(PORT, () => console.log(`[mock] manga-diary mock API listening on http://localhost:${PORT}`));
