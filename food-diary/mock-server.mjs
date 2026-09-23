/**
 * 本地视觉验收用 mock API（仅开发调试，不进入制品）。
 * 覆盖 food-diary 主题消费的全部公开接口，数据样式对照 UI 设计图。
 * 用法：node mock-server.mjs  （默认端口 8111）
 */
import http from "node:http";

const PORT = process.env.MOCK_PORT || 8222;

const img = (seed, w = 800, h = 600) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const blogger = {
  nickname: "小鹿",
  avatar: img("deer-avatar", 400, 400),
  bio: "我是小鹿，一个热爱美食的普通女孩\n喜欢在厨房里探索，在旅途中寻找地道美味\n和你一起，发现更多好吃的！",
  email: "xiaolu@example.com",
  city: "成都",
  blog_title: "小鹿的美食日记",
  blog_description: "用美食，记录生活的温度",
  page_background: img("kitchen-hero", 1600, 900),
  blog_icon: img("deer-icon", 200, 200),
  social_links: [
    { platform: "xiaohongshu", name: "小红书", url: "https://xhslink.com/xiaolu", sort_order: 0 },
    { platform: "bilibili", name: "B站", url: "https://space.bilibili.com/xiaolu", sort_order: 1 },
    { platform: "douyin", name: "抖音", url: "https://douyin.com/xiaolu", sort_order: 2 },
    { platform: "instagram", name: "Instagram", url: "https://instagram.com/xiaolu", sort_order: 3 },
    { platform: "weibo", name: "微博", url: "https://weibo.com/xiaolu", sort_order: 4 },
  ],
  tags: ["美食博主", "生活记录者"],
};

const categories = [
  { id: "c1", name: "家常菜", slug: "home-cooking", description: "简单 · 美味", type: "article", sort_order: 0, created_at: "2025-01-01T00:00:00Z" },
  { id: "c2", name: "甜点烘焙", slug: "bakery", description: "治愈 · 甜蜜", type: "article", sort_order: 1, created_at: "2025-01-01T00:00:00Z" },
  { id: "c3", name: "面食", slug: "noodles", description: "一碗入魂", type: "article", sort_order: 2, created_at: "2025-01-01T00:00:00Z" },
  { id: "c4", name: "小吃", slug: "snacks", description: "烟火气 · 地道", type: "article", sort_order: 3, created_at: "2025-01-01T00:00:00Z" },
  { id: "c5", name: "饮品", slug: "drinks", description: "清爽 · 解腻", type: "article", sort_order: 4, created_at: "2025-01-01T00:00:00Z" },
  { id: "c6", name: "减脂餐", slug: "light", description: "轻盈 · 无负担", type: "article", sort_order: 5, created_at: "2025-01-01T00:00:00Z" },
];

const tags = ["红烧肉", "草莓", "牛肉面", "串串", "烘焙入门", "下饭菜", "汤面", "甜品"].map((name, i) => ({
  id: `t${i + 1}`,
  name,
  created_at: "2025-01-01T00:00:00Z",
}));

const articles = [
  { slug: "hong-shao-rou", title: "一锅香到邻居敲门的红烧肉", category_id: "c1", summary: "肥而不腻，软糯入味，真的太下饭了！", cover: img("braised-pork"), views: 12000, comments: 12, days: 26 },
  { slug: "strawberry-cream-cake", title: "草莓奶油蛋糕｜春天的仪式感", category_id: "c2", summary: "新鲜草莓+细腻奶油，简单又好看～", cover: img("strawberry-cake"), views: 8600, comments: 9, days: 29 },
  { slug: "beef-noodles", title: "家常牛肉面｜一碗暖到心里", category_id: "c3", summary: "汤底浓郁，牛肉软烂，面条劲道！", cover: img("beef-noodle"), views: 15000, comments: 21, days: 33 },
  { slug: "chengdu-skewers", title: "成都必吃小吃清单｜吃货不踩雷", category_id: "c4", summary: "从早吃到晚，根本停不下来！", cover: img("skewers"), views: 23000, comments: 34, days: 36 },
  { slug: "lemon-tea", title: "手打柠檬茶｜3 分钟复刻茶饮店味道", category_id: "c5", summary: "清爽解腻，夏天就靠它续命。", cover: img("lemon-tea"), views: 6600, comments: 5, days: 40 },
  { slug: "light-salad", title: "一周减脂餐不重样｜好吃不挨饿", category_id: "c6", summary: "低卡也美味，坚持两周体感明显。", cover: img("salad-bowl"), views: 9900, comments: 15, days: 44 },
  { slug: "tomato-egg", title: "番茄炒蛋的终极做法｜比例是关键", category_id: "c1", summary: "最家常的味道，也有小秘诀。", cover: img("tomato-egg"), views: 30000, comments: 42, days: 48 },
  { slug: "basque-cheesecake", title: "巴斯克焦香芝士蛋糕｜新手零失败", category_id: "c2", summary: "搅拌搅均匀就能进烤箱的甜品。", cover: img("basque-cake"), views: 7200, comments: 8, days: 52 },
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

const travels = [
  { id: "tr1", title: "成都 3 天 2 晚觅食笔记｜本地人带路", destination: "成都", region: "西南", days: 3, best_month: "3-5月", views: 18000, likes: 320, rating: 4.8, reviews_n: 26, days_ago: 12, cover: img("chengdu-trip", 1200, 800), summary: "一条专为吃货设计的路线：早市、苍蝇馆子、夜宵串串一个不落。" },
  { id: "tr2", title: "广州早茶指南｜一盅两件慢生活", destination: "广州", region: "华南", days: 4, best_month: "10-12月", views: 15000, likes: 280, rating: 4.6, reviews_n: 19, days_ago: 25, cover: img("guangzhou-tea", 1200, 800), summary: "从虾饺到艇仔粥，把老字号茶楼吃了个遍。" },
  { id: "tr3", title: "大理慢游记｜洱海边的小馆子", destination: "大理", region: "西南", days: 6, best_month: "4-6月", views: 9800, likes: 190, rating: 4.7, reviews_n: 14, days_ago: 38, cover: img("dali-lake", 1200, 800), summary: "在苍山洱海之间，把乳扇和酸辣鱼吃明白。" },
  { id: "tr4", title: "西安面食朝圣｜碳水爱好者的天堂", destination: "西安", region: "西北", days: 5, best_month: "9-10月", views: 21000, likes: 410, rating: 4.9, reviews_n: 31, days_ago: 50, cover: img("xian-noodles", 1200, 800), summary: "泡面、 biangbiang 面、肉夹馍……一天 5 顿不重样。" },
];

const travelList = travels.map((t, i) => ({
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
  created_at: new Date(Date.now() - t.days_ago * 86400000).toISOString(),
  updated_at: new Date(Date.now() - t.days_ago * 86400000).toISOString(),
}));

const travelDetailExtra = {
  tr1: {
    attractions: [
      { name: "奎星楼街苍蝇馆子", description: "本地人排队的小馆子，冒烤鸭和甜水面必点。", image: img("kuiXinglou-street", 600, 450) },
      { name: "建设路小吃街", description: "蛋烘糕、锅巴土豆、烤脑花，一路吃过去。", image: img("jianshe-lu", 600, 450) },
    ],
    itinerary: [
      { day: "Day 1", description: "下午抵达，逛太古里，晚上吃火锅。" },
      { day: "Day 2", description: "上午熊猫基地，中午奎星楼街，晚上九眼桥夜宵。" },
      { day: "Day 3", description: "早市喝碗肥肠粉，返程。" },
    ],
    reviews: [
      { nickname: "路过的吃货", rating: 5, content: "跟着吃了一遍，没踩雷！" },
      { nickname: "Momo", rating: 4, content: "串串那家真的绝，就是人多要排队。" },
    ],
  },
};

const commentsStore = {
  "article:a1": [
    { id: "cm1", parent_id: null, nickname: "干饭人小王", website: "", content: "做完被室友抢光了，下次炖两锅！", is_blogger: false, created_at: "2025-04-27T10:00:00Z" },
    { id: "cm2", parent_id: "cm1", nickname: "小鹿", website: "", content: "哈哈哈说明好吃！糖色炒浅一点会更亮～", is_blogger: true, created_at: "2025-04-27T11:00:00Z" },
  ],
  "travel_guide:tr1": [
    { id: "cm3", parent_id: null, nickname: "planB", website: "", content: "收藏了，下个月就去！", is_blogger: false, created_at: "2025-05-12T09:00:00Z" },
  ],
};

// CMS 后台为富文本编辑器，文章正文 content 为 HTML（与 lens 主题的渲染假设一致）
const articleContent = `<h2>为什么要做这道菜</h2>
<p>红烧肉大概是每个中国孩子的味觉记忆。今天分享我反复调试了 <strong>5 次</strong> 的版本：</p>
<ul>
<li>肥而不腻，入口即化</li>
<li>色泽红亮，糖色是关键</li>
<li>汤汁拌饭，一绝</li>
</ul>
<h2>准备食材</h2>
<ol>
<li>五花肉 500g（三层分明的最好）</li>
<li>冰糖 20g</li>
<li>生抽 2 勺、老抽 1 勺</li>
<li>姜葱、八角、桂皮适量</li>
</ol>
<h2>关键步骤</h2>
<blockquote>全程中小火，糖色炒到枣红色立刻下肉，多一秒都会苦。</blockquote>
<p><code>小火慢炖 50 分钟</code>，最后大火收汁到浓稠挂勺。</p>
<p><img src="https://picsum.photos/seed/braised-pork-final/800/500" alt="成品" /></p>
<p>趁热盛一碗米饭，浇两勺汤汁——开动吧！有问题评论区见，我都会回。</p>`;

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
      music_enabled: false,
      video_enabled: true,
      travel_enabled: true,
      portfolio_enabled: true,
      equipment_enabled: true,
      updated_at: "2025-09-01T00:00:00Z",
    });
  }

  // 分类 / 标签
  if (path === "/api/v1/public/categories") {
    return ok(res, q.get("type") ? categories.filter((c) => c.type === q.get("type")) : categories);
  }
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
    if (!t) {
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" });
      return res.end(JSON.stringify({ code: 404001, msg: "资源不存在" }));
    }
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

  res.writeHead(404, { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" });
  res.end(JSON.stringify({ code: 404001, msg: "资源不存在" }));
});

server.listen(PORT, () => console.log(`[mock] food-diary mock API listening on http://localhost:${PORT}`));

