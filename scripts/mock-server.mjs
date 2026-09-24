/**
 * NovaBlog 通用本地视觉验收 mock API（仅开发调试，不进入制品）。
 * 覆盖全部主题消费的公开接口：博主、模块开关、分类/标签、文章、旅行、
 * 作品集、视频、音乐歌曲/第三方歌单、器材（game-diary 的游戏库复用该接口）、评论。
 * 用法：node scripts/mock-server.mjs（默认端口 8222）
 */
import http from "node:http";

const PORT = Number(process.env.MOCK_PORT || 8222);

const img = (seed, w = 800, h = 600) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;
const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();

const blogger = {
  nickname: "阿澈",
  avatar: img("nova-avatar", 400, 400),
  bio: "我是阿澈，一个喜欢到处走、随手拍、认真写字的人。\n相信生活值得被认真记录。\n和你一起，发现更多有趣的事！",
  email: "ache@example.com",
  city: "杭州",
  blog_title: "Nova 生活手记",
  blog_description: "把日子过成喜欢的样子，再写下来",
  page_background: img("nova-hero", 1600, 900),
  blog_icon: img("nova-icon", 200, 200),
  social_links: [
    { platform: "github", name: "GitHub", color: "#181717", url: "https://github.com/nova", sort_order: 0 },
    { platform: "bilibili", name: "B站", color: "#FB7299", url: "https://space.bilibili.com/nova", sort_order: 1 },
    { platform: "xiaohongshu", name: "小红书", color: "#FF2442", url: "https://xhslink.com/nova", sort_order: 2 },
    { platform: "instagram", name: "Instagram", color: "#E4405F", url: "https://instagram.com/nova", sort_order: 3 },
    { platform: "weibo", name: "微博", color: "#E6162D", url: "https://weibo.com/nova", sort_order: 4 },
    { platform: "rss", name: "RSS", color: "#F26522", url: "https://example.com/rss", sort_order: 5 },
  ],
  tags: ["城市漫步", "胶片摄影", "独立游戏", "手冲咖啡"],
};

const categories = [
  { id: "c1", name: "旅行笔记", slug: "travel", description: "在路上", type: "article", sort_order: 0, created_at: "2025-01-01T00:00:00Z" },
  { id: "c2", name: "美食厨房", slug: "food", description: "好好吃饭", type: "article", sort_order: 1, created_at: "2025-01-01T00:00:00Z" },
  { id: "c3", name: "摄影后期", slug: "photo", description: "光影收藏夹", type: "article", sort_order: 2, created_at: "2025-01-01T00:00:00Z" },
  { id: "c4", name: "游戏时光", slug: "game", description: "另一个世界", type: "article", sort_order: 3, created_at: "2025-01-01T00:00:00Z" },
  { id: "c5", name: "技术手记", slug: "tech", description: "开发者日常", type: "article", sort_order: 4, created_at: "2025-01-01T00:00:00Z" },
  { id: "c6", name: "音乐现场", slug: "music", description: "声音记忆", type: "article", sort_order: 5, created_at: "2025-01-01T00:00:00Z" },
];

const tags = ["城市漫步", "咖啡", "胶片", "星空", "独立游戏", "Next.js", "爵士乐", "徒步"].map((name, i) => ({
  id: `t${i + 1}`,
  name,
  created_at: "2025-01-01T00:00:00Z",
}));

const articleSeeds = [
  { slug: "citywalk-autumn", title: "秋日城市漫步路线：从运河到老巷", category_id: "c1", summary: "一条 6 公里的慢走路线，串起运河、旧书铺和一家开了三十年的面馆。", cover: img("citywalk-autumn"), views: 23100, comments: 34, days: 5 },
  { slug: "pour-over-coffee", title: "手冲咖啡入门：一把壶和一包豆子就够了", category_id: "c2", summary: "从器具选择到注水手法，写给刚开始接触手冲的你。", cover: img("pour-over-coffee"), views: 12800, comments: 18, days: 9 },
  { slug: "film-photography", title: "胶片相机扫街入门指南", category_id: "c3", summary: "为什么 2025 年还有人坚持拍胶片？这是我的答案和器材清单。", cover: img("film-photography"), views: 18600, comments: 27, days: 13 },
  { slug: "indie-games-2025", title: "2025 值得回味的 6 款独立游戏", category_id: "c4", summary: "大作之外，这些小品级作品带来了今年最惊喜的数十个小时。", cover: img("indie-games"), views: 30200, comments: 51, days: 18 },
  { slug: "nextjs-static-blog", title: "用 Next.js 搭一个静态博客的完整实践", category_id: "c5", summary: "从静态导出到 CMS 托管，记录这个博客主题的完整搭建过程。", cover: img("nextjs-blog"), views: 9700, comments: 12, days: 24 },
  { slug: "jazz-live-night", title: "周五晚的爵士现场：小酒馆手记", category_id: "c6", summary: "三杯酒、一支萨克斯和即兴的三小时，记一次难忘的现场。", cover: img("jazz-live"), views: 8400, comments: 9, days: 29 },
  { slug: "hiking-lake-loop", title: "环湖徒步 12 公里：新手也能走完的路线", category_id: "c1", summary: "装备、补给、时间规划，一条适合入门的环湖路线全记录。", cover: img("hiking-lake"), views: 15300, comments: 22, days: 36 },
  { slug: "basque-cheesecake", title: "巴斯克芝士蛋糕：失败三次后的稳定配方", category_id: "c2", summary: "搅拌搅均匀就能进烤箱，但温度和时间藏着玄机。", cover: img("basque-cake"), views: 21500, comments: 38, days: 42 },
  { slug: "milkyway-first-shot", title: "第一次拍银河：星空摄影踩坑记录", category_id: "c3", summary: "APP 找星、对焦、曝光参数，把第一次拍银河踩过的坑都写下来。", cover: img("milkyway"), views: 26800, comments: 41, days: 50 },
  { slug: "desk-setup", title: "我的极简书桌改造清单", category_id: "c5", summary: "桌面好物不在于贵，在于每一件都刚好有用。", cover: img("desk-setup"), views: 11200, comments: 15, days: 58 },
];

const articleList = articleSeeds.map((a, i) => ({
  id: `a${i + 1}`,
  title: a.title,
  slug: a.slug,
  summary: a.summary,
  cover_image: a.cover,
  category_id: a.category_id,
  category_name: categories.find((c) => c.id === a.category_id)?.name || "",
  tag_ids: [tags[i % tags.length].id, tags[(i + 3) % tags.length].id],
  tag_names: [tags[i % tags.length].name, tags[(i + 3) % tags.length].name],
  status: 2,
  type: 1,
  view_count: a.views,
  comment_count: a.comments,
  is_top: i === 0,
  is_comment: true,
  published_at: daysAgo(a.days),
  created_at: daysAgo(a.days),
  updated_at: daysAgo(a.days),
}));

const articleContent = `<h2>为什么想写这篇</h2>
<p>这件事我断断续续折腾了 <strong>一个多月</strong>，踩了不少坑，也收到很多朋友的提问，索性把过程完整记录下来。</p>
<ul>
<li>准备工作：工具、预算与时间安排</li>
<li>过程中的三个关键节点</li>
<li>复盘：如果重来一次会怎么做</li>
</ul>
<h2>几个关键决定</h2>
<blockquote>先想清楚目标，再选路径。方向错了，执行力越强偏得越远。</blockquote>
<p>具体来说，我把整个计划拆成了三个阶段，每个阶段只验证一件事：</p>
<ol>
<li>第一阶段：小成本快速试错，确认方向可行；</li>
<li>第二阶段：把验证过的流程固化成习惯；</li>
<li>第三阶段：加入自己的风格，慢慢做出差异化。</li>
</ol>
<h2>一些细节</h2>
<p><code>记录</code> 是整个过程中最有价值的习惯——每天十分钟，一个月后回看会非常惊讶。</p>
<p><img src="https://picsum.photos/seed/nova-article-inline/800/500" alt="过程记录" /></p>
<p>以上就是我这次的全部记录，有问题欢迎在评论区交流，看到都会回复。</p>`;

const travelSeeds = [
  { id: "t1", title: "杭州 3 天 2 晚慢游笔记", destination: "杭州", region: "华东", days: 3, best_month: "3-5月", views: 19800, likes: 356, rating: 4.8, reviews_n: 28, days_ago: 8, cover: img("hangzhou", 1200, 800), summary: "不赶景点的打开方式：运河边的清晨、满觉陇的桂花和一家社区咖啡馆。" },
  { id: "t2", title: "成都觅食 4 日记", destination: "成都", region: "西南", days: 4, best_month: "10-12月", views: 24600, likes: 430, rating: 4.7, reviews_n: 35, days_ago: 20, cover: img("chengdu", 1200, 800), summary: "从苍蝇馆子到深夜串串，一条专为吃货设计的路线。" },
  { id: "t3", title: "大理洱海环线 5 日", destination: "大理", region: "西南", days: 5, best_month: "4-6月", views: 17200, likes: 388, rating: 4.9, reviews_n: 31, days_ago: 33, cover: img("dali", 1200, 800), summary: "骑电动车环洱海，在喜洲和双廊之间慢慢晃。" },
  { id: "t4", title: "厦门海滨 2 日短途", destination: "厦门", region: "华东", days: 2, best_month: "9-11月", views: 13500, likes: 240, rating: 4.5, reviews_n: 19, days_ago: 47, cover: img("xiamen", 1200, 800), summary: "周末就能出发的海滨短途：沙坡尾、八市和一场海上日落。" },
];

const travelList = travelSeeds.map((t) => ({
  id: t.id,
  title: t.title,
  summary: t.summary,
  cover_image: t.cover,
  status: 2,
  destination: t.destination,
  region: t.region,
  category_id: "",
  category_name: "",
  days: t.days,
  best_month: t.best_month,
  view_count: t.views,
  like_count: t.likes,
  rating: t.rating,
  review_count: t.reviews_n,
  created_at: daysAgo(t.days_ago),
  updated_at: daysAgo(t.days_ago),
}));

const travelDetailExtra = {
  t1: {
    attractions: [
      { name: "桥西历史文化街区", description: "刀剪剑博物馆一带的老巷，清晨人少最出片。", image: img("qiaoxi", 600, 450) },
      { name: "满觉陇", description: "秋天满城桂花香，山路两侧全是茶田。", image: img("manjuelong", 600, 450) },
    ],
    itinerary: [
      { day: "Day 1", description: "下午抵达，逛桥西直街，晚上运河边散步。" },
      { day: "Day 2", description: "上午满觉陇喝茶，下午西湖西线，晚上南山路。" },
      { day: "Day 3", description: "早市吃片儿川，逛旧书铺，返程。" },
    ],
    reviews: [
      { nickname: "路过的旅人", rating: 5, content: "跟着走了一遍，节奏刚刚好！" },
      { nickname: "Momo", rating: 4, content: "满觉陇那段太美了，秋天一定要去。" },
    ],
  },
};

const portfolioSeeds = [
  { id: "p1", name: "城市光影", category_name: "人文纪实", description: "关于城市光线与行人的长期记录。", sort_order: 0, days_ago: 10 },
  { id: "p2", name: "山野四季", category_name: "风光摄影", description: "一年四季的山野，同一座山的不同表情。", sort_order: 1, days_ago: 30 },
  { id: "p3", name: "街头角落", category_name: "人文纪实", description: "扫街时随手收进取景框的角落。", sort_order: 2, days_ago: 60 },
];

const portfolioList = portfolioSeeds.map((p, pi) => ({
  id: p.id,
  name: p.name,
  description: p.description,
  cover_mode: 1,
  cover_preset_id: "",
  cover_url: img(`portfolio-${p.id}-cover`, 1200, 800),
  status: 1,
  sort_order: p.sort_order,
  category_id: "",
  category_name: p.category_name,
  item_count: 8,
  created_at: daysAgo(p.days_ago),
  updated_at: daysAgo(p.days_ago),
}));

const portfolioItems = Object.fromEntries(
  portfolioSeeds.map((p, pi) => [
    p.id,
    Array.from({ length: 8 }, (_, i) => ({
      id: `${p.id}-i${i + 1}`,
      portfolio_id: p.id,
      preset_id: "",
      title: `${p.name} · ${i + 1}`,
      description: `${p.name}系列第 ${i + 1} 张，${p.description}`,
      sort_order: i,
      output_url: img(`${p.id}-shot-${i + 1}`, 1200, 800),
      mime_type: "image/jpeg",
      output_size: 2048000,
      created_at: daysAgo(p.days_ago),
      updated_at: daysAgo(p.days_ago),
    })),
  ])
);

const videoSeeds = [
  { id: "v1", title: "Vlog｜秋天的第一条城市漫步路线", description: "6 公里、一台相机、一个下午，走完这条秋日路线。", views_days: 6, platforms: [{ platform: "bilibili", url: "https://www.bilibili.com/video/BV1GJ411x7h7" }, { platform: "youtube", url: "https://youtu.be/example1" }] },
  { id: "v2", title: "手冲咖啡全过程实录", description: "从磨豆到出品，一条视频看懂手冲咖啡的完整流程。", views_days: 14, platforms: [{ platform: "bilibili", url: "https://www.bilibili.com/video/BV1GJ411x7h8" }] },
  { id: "v3", title: "独立游戏试玩实况 vol.3", description: "本期试玩三款小体量独立游戏，都很有想法。", views_days: 25, platforms: [{ platform: "bilibili", url: "https://www.bilibili.com/video/BV1GJ411x7h9" }] },
  { id: "v4", title: "扫街一小时的成果与复盘", description: "胶片扫街实拍，最后聊聊哪些片子成了、为什么。", views_days: 40, platforms: [{ platform: "youtube", url: "https://youtu.be/example4" }] },
];

const videoList = videoSeeds.map((v, i) => ({
  id: v.id,
  title: v.title,
  cover_url: img(`video-${v.id}`, 1200, 675),
  description: v.description,
  status: 1,
  sort_order: i,
  platforms: v.platforms.map((p, j) => ({ id: `${v.id}-pl${j}`, video_id: v.id, platform: p.platform, url: p.url, created_at: daysAgo(v.views_days), updated_at: daysAgo(v.views_days) })),
  created_at: daysAgo(v.views_days),
  updated_at: daysAgo(v.views_days),
}));

const songs = [
  { id: "s1", title: "City Stars", artist: "Luminous", bvid: "BV1GJ411x7h7", duration: 245 },
  { id: "s2", title: "Midnight Cafe", artist: "The Wilder Blue", bvid: "BV1GJ411x7h8", duration: 198 },
  { id: "s3", title: "Paper Plane", artist: "Northerly", bvid: "BV1GJ411x7h9", duration: 223 },
  { id: "s4", title: "Slow Tide", artist: "Marina Bay Trio", bvid: "BV1GJ411x7ha", duration: 267 },
  { id: "s5", title: "Golden Hour Drive", artist: "Sunset Boys", bvid: "BV1GJ411x7hb", duration: 210 },
  { id: "s6", title: "Under the Same Roof", artist: "Kite & Anchor", bvid: "BV1GJ411x7hc", duration: 254 },
];

const songList = songs.map((s, i) => ({
  id: s.id,
  title: s.title,
  artist: s.artist,
  cover_url: img(`song-${s.id}`, 600, 600),
  bvid: s.bvid,
  cid: 700000000 + i,
  source_url: `https://www.bilibili.com/video/${s.bvid}`,
  source_type: "bilibili",
  category_id: null,
  duration: s.duration,
  sort_order: i,
  created_at: daysAgo(30 + i),
  updated_at: daysAgo(30 + i),
}));

const playlists = [
  { id: "pl1", title: "深夜写代码 BGM", platform: "网易云音乐", platform_url: "https://music.163.com/playlist/pl1", description: "安静、克制、适合长时间专注。", sort_order: 0 },
  { id: "pl2", title: "雨天咖啡店", platform: "Spotify", platform_url: "https://open.spotify.com/playlist/pl2", description: "爵士与 Lo-Fi 的雨天混合。", sort_order: 1 },
  { id: "pl3", title: "公路旅行歌单", platform: "QQ音乐", platform_url: "https://y.qq.com/playlist/pl3", description: "适合在高速上把音量拧大的歌。", sort_order: 2 },
].map((p) => ({ ...p, cover_url: img(`playlist-${p.id}`, 600, 600), enabled: true, created_at: daysAgo(40), updated_at: daysAgo(40) }));

const equipments = [
  { id: "e1", name: "索尼 A7C II", brand: "Sony", description: "轻量全画幅主力机，扫街与旅行兼顾。", image_url: img("gear-a7c2", 600, 450), sort_order: 0, days_ago: 15 },
  { id: "e2", name: "大疆 Mini 4 Pro", brand: "DJI", description: "随身无人机，249g 免登记，旅行航拍利器。", image_url: img("gear-mini4", 600, 450), sort_order: 1, days_ago: 22 },
  { id: "e3", name: "Peak Design 每日背包 20L", brand: "Peak Design", description: "一包装下相机、电脑和三天行李的魔术包。", image_url: img("gear-backpack", 600, 450), sort_order: 2, days_ago: 30 },
  { id: "e4", name: "Switch OLED + 塞尔达传说", brand: "Nintendo", description: "长途火车与民宿夜晚的救星。", image_url: img("gear-switch", 600, 450), sort_order: 3, days_ago: 38 },
  { id: "e5", name: "PlayStation 5 Slim", brand: "Sony", description: "客厅游戏主力，周末和朋友来两局。", image_url: img("gear-ps5", 600, 450), sort_order: 4, days_ago: 46 },
  { id: "e6", name: "Keychron K3 Pro", brand: "Keychron", description: "矮轴机械键盘，打字手感与静音的平衡点。", image_url: img("gear-keychron", 600, 450), sort_order: 5, days_ago: 55 },
  { id: "e7", name: "富士 X100VI", brand: "Fujifilm", description: "直出色彩一代神机，胶片模拟的浪漫。", image_url: img("gear-x100vi", 600, 450), sort_order: 6, days_ago: 63 },
  { id: "e8", name: "Gerber 户外刀具套装", brand: "Gerber", description: "露营徒步的小工具，用上的时候会觉得真值。", image_url: img("gear-gerber", 600, 450), sort_order: 7, days_ago: 72 },
].map(({ days_ago, ...e }) => ({ ...e, created_at: daysAgo(days_ago), updated_at: daysAgo(days_ago) }));

const commentsStore = {
  "article:a1": [
    { id: "cm1", parent_id: null, nickname: "路过的旅人", website: "", content: "这条路线收藏了，周末就去走一遍！", is_blogger: false, created_at: daysAgo(3) },
    { id: "cm2", parent_id: "cm1", nickname: "阿澈", website: "", content: "记得穿舒服的鞋，最后一段石板路有点硌脚～", is_blogger: true, created_at: daysAgo(3) },
    { id: "cm3", parent_id: null, nickname: "Momo", website: "https://momo.example.com", content: "面馆那家我也去过，招牌面真的绝。", is_blogger: false, created_at: daysAgo(2) },
  ],
  "travel_guide:t1": [
    { id: "cm4", parent_id: null, nickname: "planB", website: "", content: "下个月就去杭州，攻略抄走了！", is_blogger: false, created_at: daysAgo(5) },
  ],
  "video:v1": [
    { id: "cm5", parent_id: null, nickname: "弹幕观察员", website: "", content: "BGM 好听，求歌名！", is_blogger: false, created_at: daysAgo(4) },
  ],
};

const ok = (res, data) => {
  res.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Accept",
  });
  res.end(JSON.stringify({ code: 0, msg: "success", data }));
};

const notFound = (res) => {
  res.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" });
  res.end(JSON.stringify({ code: 404001, msg: "资源不存在" }));
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
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  const path = url.pathname;
  const q = url.searchParams;

  if (req.method === "OPTIONS") return ok(res, null);

  // 博主
  if (path === "/api/v1/public/blogger") return ok(res, blogger);

  // 模块开关（验收场景全部开启）
  if (path === "/api/v1/public/module-config") {
    return ok(res, {
      article_enabled: true,
      media_enabled: true,
      music_enabled: true,
      video_enabled: true,
      travel_enabled: true,
      portfolio_enabled: true,
      equipment_enabled: true,
      updated_at: daysAgo(1),
    });
  }

  // 分类 / 标签
  if (path === "/api/v1/public/categories") {
    const type = q.get("type");
    return ok(res, type ? categories.filter((c) => c.type === type) : categories);
  }
  if (path === "/api/v1/public/tags") return ok(res, tags);

  // 文章
  if (path === "/api/v1/public/articles") {
    let list = articleList;
    const cid = q.get("category_id");
    const kw = q.get("keyword");
    if (cid) list = list.filter((a) => a.category_id === cid);
    if (kw) list = list.filter((a) => a.title.includes(kw) || a.summary.includes(kw) || a.tag_names.some((t) => t.includes(kw)));
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
    if (!a) return notFound(res);
    return ok(res, { ...a, content: articleContent, extra: {} });
  }

  // 旅行
  if (path === "/api/v1/public/travels") {
    let list = travelList;
    const kw = q.get("keyword");
    const days = q.get("days_range");
    if (kw) list = list.filter((t) => t.title.includes(kw) || t.destination.includes(kw) || t.summary.includes(kw));
    if (days === "1-3") list = list.filter((t) => t.days <= 3);
    if (days === "4-7") list = list.filter((t) => t.days >= 4 && t.days <= 7);
    if (days === "8-14") list = list.filter((t) => t.days >= 8 && t.days <= 14);
    if (days === "15+") list = list.filter((t) => t.days >= 15);
    const sort = q.get("sort");
    if (sort === "views") list = [...list].sort((a, b) => b.view_count - a.view_count);
    if (sort === "likes") list = [...list].sort((a, b) => b.like_count - a.like_count);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return ok(res, page(list, q));
  }
  if (path === "/api/v1/public/travels/hot") {
    const n = Number(q.get("count") || 5);
    return ok(res, [...travelList].sort((a, b) => b.view_count - a.view_count).slice(0, n));
  }
  const travelView = path.match(/^\/api\/v1\/public\/travels\/([^/]+)\/view$/);
  if (travelView) return ok(res, null);
  const travelLike = path.match(/^\/api\/v1\/public\/travels\/([^/]+)\/like$/);
  if (travelLike) return ok(res, null);
  const travelOne = path.match(/^\/api\/v1\/public\/travels\/([^/]+)$/);
  if (travelOne) {
    const t = travelList.find((x) => x.id === decodeURIComponent(travelOne[1]));
    if (!t) return notFound(res);
    const extra = travelDetailExtra[t.id] || { attractions: [], itinerary: [], reviews: [] };
    return ok(res, { ...t, attractions: extra.attractions, itinerary: extra.itinerary, reviews: extra.reviews });
  }

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

  // 作品集
  if (path === "/api/v1/public/portfolios") {
    let list = portfolioList;
    const kw = q.get("keyword");
    if (kw) list = list.filter((p) => p.name.includes(kw));
    return ok(res, page(list, q));
  }
  const portfolioOne = path.match(/^\/api\/v1\/public\/portfolios\/([^/]+)$/);
  if (portfolioOne) {
    const p = portfolioList.find((x) => x.id === decodeURIComponent(portfolioOne[1]));
    if (!p) return notFound(res);
    return ok(res, { ...p, items: portfolioItems[p.id] || [] });
  }

  // 视频
  if (path === "/api/v1/public/videos") {
    let list = videoList;
    const kw = q.get("keyword");
    if (kw) list = list.filter((v) => v.title.includes(kw));
    return ok(res, page(list, q));
  }
  const videoOne = path.match(/^\/api\/v1\/public\/videos\/([^/]+)$/);
  if (videoOne) {
    const v = videoList.find((x) => x.id === decodeURIComponent(videoOne[1]));
    if (!v) return notFound(res);
    return ok(res, v);
  }

  // 音乐
  if (path === "/api/v1/public/music/songs") {
    let list = songList;
    const cid = q.get("category_id");
    if (cid) list = list.filter((s) => s.category_id === cid);
    return ok(res, page(list, q));
  }
  const songOne = path.match(/^\/api\/v1\/public\/music\/songs\/([^/]+)$/);
  if (songOne) {
    const s = songList.find((x) => x.id === decodeURIComponent(songOne[1]));
    if (!s) return notFound(res);
    return ok(res, s);
  }
  const songAudio = path.match(/^\/api\/v1\/public\/music\/audio-url\/([^/]+)$/);
  if (songAudio) {
    const s = songList.find((x) => x.id === decodeURIComponent(songAudio[1]));
    if (!s) return notFound(res);
    return ok(res, { url: `https://player.bilibili.com/player.html?bvid=${s.bvid}&autoplay=1&danmaku=0&high_quality=1` });
  }

  // 第三方歌单
  if (path === "/api/v1/public/playlists") return ok(res, playlists);
  if (path === "/api/v1/public/music/playlists") return ok(res, playlists);

  // 器材（game-diary 的游戏库同样消费该接口）
  if (path === "/api/v1/public/equipments") {
    let list = equipments;
    const kw = q.get("keyword");
    const brand = q.get("brand");
    if (kw) list = list.filter((e) => e.name.includes(kw));
    if (brand) list = list.filter((e) => e.brand === brand);
    return ok(res, page(list, q));
  }
  const equipmentOne = path.match(/^\/api\/v1\/public\/equipments\/([^/]+)$/);
  if (equipmentOne) {
    const e = equipments.find((x) => x.id === decodeURIComponent(equipmentOne[1]));
    if (!e) return notFound(res);
    return ok(res, e);
  }

  res.writeHead(404, { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" });
  res.end(JSON.stringify({ code: 404001, msg: "资源不存在" }));
});

server.listen(PORT, "127.0.0.1", () => console.log(`[mock] universal mock API listening on http://127.0.0.1:${PORT}`));
