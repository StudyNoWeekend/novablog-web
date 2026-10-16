/**
 * NovaBlog 通用本地视觉验收 mock API（仅开发调试，不进入制品）。
 * 覆盖全部主题消费的公开接口：博主、模块开关、分类/标签、文章、旅行、
 * 作品集、视频、音乐歌曲/第三方歌单、器材（game-diary 的游戏库复用该接口）、评论、
 * 开源作品、美食菜谱、读书书架、游戏库、健身训练、技术栈。
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
  zodiac: {
    key: "leo",
    name: "狮子座",
    image: "",
    date_range: "7.23-8.22",
    element: "火象",
  },
  personality: {
    key: "INTP",
    name: "逻辑学家",
    image: "",
    description: "热衷探索概念与原理，以严谨的逻辑推演理解世界的运行规律。",
  },
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

// 音乐分类（type=music）：仅供 /public/categories?type=music 消费（如主题音乐页筛选）
const musicCategories = [
  { id: "m1", name: "专注Coding", slug: "coding", description: "写代码时的背景音", type: "music", sort_order: 0, created_at: "2025-01-01T00:00:00Z" },
  { id: "m2", name: "夜行车载", slug: "night-drive", description: "深夜兜风专用", type: "music", sort_order: 1, created_at: "2025-01-01T00:00:00Z" },
];

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
      { id: "t1-a1", name: "桥西历史文化街区", description: "刀剪剑博物馆一带的老巷，清晨人少最出片。", image: img("qiaoxi", 600, 450), duration: "半天", location: "浙江省杭州市拱墅区桥西直街", latitude: 30.3197, longitude: 120.1364, coordType: "gcj02" },
      { id: "t1-a2", name: "满觉陇", description: "秋天满城桂花香，山路两侧全是茶田。", image: img("manjuelong", 600, 450), duration: "半天", location: "浙江省杭州市西湖区满觉陇路", latitude: 30.2162, longitude: 120.1169, coordType: "gcj02" },
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
  t2: {
    attractions: [
      { id: "t2-a1", name: "宽窄巷子", description: "老成都的闲生活，盖碗茶配掏耳朵。", image: img("kuanzhai", 600, 450), duration: "半天", location: "四川省成都市青羊区宽窄巷子", latitude: 30.6634, longitude: 104.0532, coordType: "gcj02" },
      { id: "t2-a2", name: "锦里古街", description: "夜景比白天好看，红灯笼亮起来才算到了成都。", image: img("jinli", 600, 450), duration: "2-3 小时", location: "四川省成都市武侯区武侯祠大街", latitude: 30.6442, longitude: 104.0432, coordType: "gcj02" },
    ],
    itinerary: [
      { day: "Day 1", description: "落地先涮一顿火锅，晚上逛锦里夜景。" },
      { day: "Day 2", description: "宽窄巷子喝茶听戏，下午人民公园。" },
      { day: "Day 3", description: "熊猫基地看花花，晚上建设路小吃街。" },
      { day: "Day 4", description: "东郊记忆拍照，返程。" },
    ],
    reviews: [
      { nickname: "干饭人", rating: 5, content: "照着吃了一圈，没有踩雷的。" },
    ],
  },
  t3: {
    attractions: [
      { id: "t3-a1", name: "大理古城", description: "人民路的夜晚和床单厂的艺术市集都值得慢慢逛。", image: img("dali-oldtown", 600, 450), duration: "1 天", location: "云南省大理白族自治州大理市大理古城", latitude: 25.6926, longitude: 100.1635, coordType: "gcj02" },
      { id: "t3-a2", name: "喜洲古镇", description: "稻田边的白族院子，破酥粑粑要趁热吃。", image: img("xizhou", 600, 450), duration: "半天", location: "云南省大理白族自治州大理市喜洲镇", latitude: 25.8553, longitude: 100.1021, coordType: "gcj02" },
    ],
    itinerary: [
      { day: "Day 1", description: "古城安顿，傍晚才村码头看日落。" },
      { day: "Day 2", description: "租电动车北上，喜洲吃午饭，海舍公路慢慢骑。" },
      { day: "Day 3", description: "双廊住一晚，南诏风情岛发呆。" },
      { day: "Day 4", description: "挖色小普陀，环海东路返程。" },
      { day: "Day 5", description: "古城早市买伴手礼，返程。" },
    ],
    reviews: [
      { nickname: "环海骑士", rating: 5, content: "电动车环海太自由了，注意防晒！" },
    ],
  },
  t4: {
    attractions: [
      { id: "t4-a1", name: "鼓浪屿", description: "避开周末早班轮渡，巷子里的老别墅比景点好看。", image: img("gulangyu", 600, 450), duration: "1 天", location: "福建省厦门市思明区鼓浪屿", latitude: 24.4438, longitude: 118.0672, coordType: "gcj02" },
      { id: "t4-a2", name: "沙坡尾", description: "避风坞边的文艺街区，黄昏光线最适合拍照。", image: img("shapowei", 600, 450), duration: "2-3 小时", location: "福建省厦门市思明区沙坡尾", latitude: 24.4357, longitude: 118.0901, coordType: "wgs84" },
    ],
    itinerary: [
      { day: "Day 1", description: "早上轮渡上岛，绕岛步行一圈，傍晚回本岛。" },
      { day: "Day 2", description: "沙坡尾吃早午餐，八市买海鲜，看一场海上日落后返程。" },
    ],
    reviews: [
      { nickname: "海边风", rating: 4, content: "周末人多，工作日去体验更好。" },
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
  category_id: musicCategories[i % musicCategories.length].id,
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

const openSourceReadme = (name, summary, install, license) => `# ${name}

> ${summary}

## 特性

- 开箱即用，默认配置就能覆盖大部分场景
- 文档与示例齐全，常见问题都有对应说明
- 持续维护，Issue 平均 48 小时内响应

## 快速开始

\`\`\`bash
${install}
\`\`\`

## 项目信息

| 指标 | 说明 |
| --- | --- |
| 开源协议 | ${license} |
| 贡献指南 | 见仓库 CONTRIBUTING.md |
| 问题反馈 | GitHub Issues |

如果这个项目对你有帮助，欢迎点一个 Star 支持一下。`;

const openSourceSeeds = [
  { id: "o1", name: "nova-ui", repo_url: "https://github.com/nova/nova-ui", summary: "一套中性风格的 React 组件库，为内容型站点而生。", language: "TypeScript", topics: "react,ui,typescript", stars: 12400, homepage: "https://nova-ui.example.com", install: "pnpm add @nova/ui", license: "MIT", days_ago: 6 },
  { id: "o2", name: "md-diary", repo_url: "https://github.com/nova/md-diary", summary: "把一个 Markdown 文件夹变成可以翻阅的静态日记本。", language: "Go", topics: "markdown,static-site,cli", stars: 3820, homepage: "", install: "go install github.com/nova/md-diary@latest", license: "MIT", days_ago: 13 },
  { id: "o3", name: "hue-crafter", repo_url: "https://github.com/nova/hue-crafter", summary: "命令行配色工具，给终端和主题生成和谐色板。", language: "Rust", topics: "cli,color,terminal", stars: 5210, homepage: "https://hue-crafter.example.com", install: "cargo install hue-crafter", license: "Apache-2.0", days_ago: 21 },
  { id: "o4", name: "weekly-captain", repo_url: "https://github.com/nova/weekly-captain", summary: "从 git 提交记录自动生成周报的命令行小工具。", language: "TypeScript", topics: "cli,git,productivity", stars: 2680, homepage: "", install: "npm i -g weekly-captain", license: "MIT", days_ago: 28 },
  { id: "o5", name: "rss-hub-lite", repo_url: "https://github.com/nova/rss-hub-lite", summary: "轻量 RSS 生成器，把不提供订阅的页面变成 feed。", language: "Python", topics: "rss,scraper,python", stars: 7340, homepage: "", install: "pip install rss-hub-lite", license: "BSD-3-Clause", days_ago: 35 },
  { id: "o6", name: "qrcode-art", repo_url: "https://github.com/nova/qrcode-art", summary: "把二维码画成艺术字与像素画的小玩具。", language: "JavaScript", topics: "qrcode,canvas,fun", stars: 9460, homepage: "https://qrcode-art.example.com", install: "npm i qrcode-art", license: "MIT", days_ago: 44 },
  { id: "o7", name: "commit-lint-emoji", repo_url: "https://github.com/nova/commit-lint-emoji", summary: "gitmoji 风格的提交信息校验与 changelog 生成。", language: "TypeScript", topics: "git,gitmoji,changelog", stars: 1580, homepage: "", install: "pnpm add -D commit-lint-emoji", license: "MIT", days_ago: 52 },
  { id: "o8", name: "walk-note", repo_url: "https://github.com/nova/walk-note", summary: "记录城市漫步轨迹并生成手账风小卡的 iOS 应用。", language: "Swift", topics: "ios,swift,citywalk", stars: 990, homepage: "https://walk-note.example.com", install: "git clone https://github.com/nova/walk-note && open walk-note.xcodeproj", license: "GPL-3.0", days_ago: 61 },
];

const openSourceList = openSourceSeeds.map(({ install, license, days_ago, ...o }, i) => ({
  ...o,
  status: 2,
  sort_order: i,
  created_at: daysAgo(days_ago),
  updated_at: daysAgo(days_ago),
}));

const openSourceDetails = Object.fromEntries(
  openSourceSeeds.map((o) => [o.id, { readme: openSourceReadme(o.name, o.summary, o.install, o.license), readme_updated_at: daysAgo(o.days_ago) }])
);

const recipeSeeds = [
  { id: "r1", title: "一锅到底的番茄牛腩", summary: "炖足九十分钟，汤汁浓到可以拌三碗米饭。", difficulty: 2, minutes: 120, servings: 4, tags: "家常菜,炖菜,下饭", days_ago: 4 },
  { id: "r2", title: "十分钟葱油拌面", summary: "一把小葱一碗面，深夜食堂的最低门槛。", difficulty: 1, minutes: 10, servings: 1, tags: "面食,快手,一人食", days_ago: 9 },
  { id: "r3", title: "巴斯克芝士蛋糕", summary: "失败三次换来的稳定配方，搅拌匀就能进烤箱。", difficulty: 2, minutes: 65, servings: 6, tags: "烘焙,甜点,下午茶", days_ago: 15 },
  { id: "r4", title: "舒芙蕾厚松饼", summary: "成败全在翻拌手法，值得为之早起一小时。", difficulty: 3, minutes: 40, servings: 2, tags: "早餐,甜点,手作", days_ago: 22 },
  { id: "r5", title: "日式咖喱鸡", summary: "搭一碗米饭就是完整晚餐，隔夜热更入味。", difficulty: 1, minutes: 45, servings: 3, tags: "家常菜,咖喱,晚餐", days_ago: 30 },
  { id: "r6", title: "蒜香黄油虾", summary: "整头蒜加半块黄油，下酒下饭两相宜。", difficulty: 2, minutes: 20, servings: 2, tags: "海鲜,快手,下酒菜", days_ago: 38 },
  { id: "r7", title: "低卡鸡胸沙拉碗", summary: "健身日的固定午餐，腌十分钟煎八分钟。", difficulty: 1, minutes: 25, servings: 1, tags: "轻食,健身餐,低卡", days_ago: 45 },
];

const recipeList = recipeSeeds.map(({ days_ago, ...r }, i) => ({
  ...r,
  cover: img(`recipe-${r.id}`, 1200, 800),
  status: 2,
  sort_order: i,
  created_at: daysAgo(days_ago),
  updated_at: daysAgo(days_ago),
}));

const recipeDetails = {
  r1: {
    ingredients: [
      { name: "牛腩", amount: "500g" },
      { name: "番茄", amount: "3 个（约 400g）" },
      { name: "洋葱", amount: "半个" },
      { name: "冰糖", amount: "10g" },
      { name: "生抽", amount: "2 勺" },
      { name: "姜片、料酒", amount: "适量" },
    ],
    steps: [
      { text: "牛腩切块冷水下锅，加姜片和料酒焯水，撇净浮沫捞出。", image: img("recipe-r1-step1", 800, 600) },
      { text: "热油炒化冰糖，下牛腩翻炒上色，加洋葱块爆香。", image: img("recipe-r1-step2", 800, 600) },
      { text: "番茄去皮切块下锅炒出沙，加热水没过食材，转小火炖 90 分钟。", image: img("recipe-r1-step3", 800, 600) },
      { text: "大火收汁，加盐调味，撒葱花出锅。", image: img("recipe-r1-step4", 800, 600) },
    ],
  },
  r2: {
    ingredients: [
      { name: "手擀面", amount: "1 份（约 150g）" },
      { name: "小葱", amount: "4 根" },
      { name: "生抽", amount: "2 勺" },
      { name: "老抽", amount: "半勺" },
      { name: "白糖", amount: "1 小勺" },
      { name: "食用油", amount: "3 勺" },
    ],
    steps: [
      { text: "小葱切段冷油下锅，小火慢炸到焦黄酥脆。", image: img("recipe-r2-step1", 800, 600) },
      { text: "碗中调入生抽、老抽和白糖，搅匀成酱汁。", image: img("recipe-r2-step2", 800, 600) },
      { text: "面条煮到八分熟捞出，过一遍凉水更筋道。", image: img("recipe-r2-step3", 800, 600) },
      { text: "淋上酱汁和葱油，趁热拌匀即可开吃。", image: img("recipe-r2-step4", 800, 600) },
    ],
  },
  r3: {
    ingredients: [
      { name: "奶油芝士", amount: "250g" },
      { name: "细砂糖", amount: "60g" },
      { name: "鸡蛋", amount: "2 个" },
      { name: "淡奶油", amount: "150g" },
      { name: "玉米淀粉", amount: "10g" },
    ],
    steps: [
      { text: "奶油芝士室温软化后加糖，搅打至顺滑无颗粒。", image: img("recipe-r3-step1", 800, 600) },
      { text: "分次加入鸡蛋搅匀，再倒入淡奶油和玉米淀粉拌匀。", image: img("recipe-r3-step2", 800, 600) },
      { text: "面糊过筛，倒入垫了油纸的六寸模具。", image: img("recipe-r3-step3", 800, 600) },
      { text: "230℃ 烤 25 分钟，出炉冷藏四小时后再脱模。", image: img("recipe-r3-step4", 800, 600) },
    ],
  },
  r4: {
    ingredients: [
      { name: "鸡蛋", amount: "3 个" },
      { name: "低筋面粉", amount: "40g" },
      { name: "牛奶", amount: "30g" },
      { name: "细砂糖", amount: "30g" },
      { name: "泡打粉", amount: "2g" },
    ],
    steps: [
      { text: "蛋黄蛋白分离，蛋黄加牛奶拌匀后筛入面粉。", image: img("recipe-r4-step1", 800, 600) },
      { text: "蛋白分三次加糖，打到提起有小尖角的硬性发泡。", image: img("recipe-r4-step2", 800, 600) },
      { text: "蛋白糊分两次翻拌进蛋黄糊，动作要轻要快。", image: img("recipe-r4-step3", 800, 600) },
      { text: "小火加盖每面煎四分钟，中途翻面防止塌陷。", image: img("recipe-r4-step4", 800, 600) },
    ],
  },
  r5: {
    ingredients: [
      { name: "鸡腿肉", amount: "300g" },
      { name: "土豆", amount: "1 个" },
      { name: "胡萝卜", amount: "半根" },
      { name: "洋葱", amount: "半个" },
      { name: "日式咖喱块", amount: "3 块" },
    ],
    steps: [
      { text: "鸡腿肉切块焯水，土豆和胡萝卜滚刀切块。", image: img("recipe-r5-step1", 800, 600) },
      { text: "少油炒香洋葱，下鸡肉块炒至表面变色。", image: img("recipe-r5-step2", 800, 600) },
      { text: "加土豆、胡萝卜和热水，中火煮 15 分钟。", image: img("recipe-r5-step3", 800, 600) },
      { text: "关火放咖喱块搅到化开，再小火煮到浓稠。", image: img("recipe-r5-step4", 800, 600) },
    ],
  },
  r6: {
    ingredients: [
      { name: "鲜虾", amount: "300g" },
      { name: "黄油", amount: "30g" },
      { name: "大蒜", amount: "1 整头" },
      { name: "小米辣", amount: "2 个" },
      { name: "欧芹碎", amount: "少许" },
    ],
    steps: [
      { text: "鲜虾开背去虾线，用厨房纸吸干表面水分。", image: img("recipe-r6-step1", 800, 600) },
      { text: "黄油小火融化，下蒜末和小米辣慢慢煸香。", image: img("recipe-r6-step2", 800, 600) },
      { text: "转大火下虾，煎到两面变红再翻面煎一分钟。", image: img("recipe-r6-step3", 800, 600) },
      { text: "撒盐和欧芹碎，颠锅几下即可出锅。", image: img("recipe-r6-step4", 800, 600) },
    ],
  },
  r7: {
    ingredients: [
      { name: "鸡胸肉", amount: "1 块（约 150g）" },
      { name: "生菜", amount: "适量" },
      { name: "圣女果", amount: "6 颗" },
      { name: "玉米粒", amount: "半碗" },
      { name: "油醋汁", amount: "2 勺" },
    ],
    steps: [
      { text: "鸡胸肉用盐、黑胡椒和少许油腌十分钟。", image: img("recipe-r7-step1", 800, 600) },
      { text: "平底锅少油煎到两面金黄，静置三分钟后切块。", image: img("recipe-r7-step2", 800, 600) },
      { text: "生菜撕碎、圣女果对半切，和玉米粒一起装碗。", image: img("recipe-r7-step3", 800, 600) },
      { text: "摆上鸡肉块，淋油醋汁拌匀即可。", image: img("recipe-r7-step4", 800, 600) },
    ],
  },
};

const bookSeeds = [
  { id: "b1", title: "置身事内", author: "兰小欢", rating: 4.5, reading_status: "done", days_ago: 12 },
  { id: "b2", title: "长安的荔枝", author: "马伯庸", rating: 4, reading_status: "done", days_ago: 25 },
  { id: "b3", title: "芯片战争", author: "克里斯·米勒", rating: 4, reading_status: "reading", days_ago: 40 },
  { id: "b4", title: "我与地坛", author: "史铁生", rating: 5, reading_status: "done", days_ago: 58 },
  { id: "b5", title: "纳瓦尔宝典", author: "埃里克·乔根森", rating: 3.5, reading_status: "reading", days_ago: 75 },
  { id: "b6", title: "克拉克森的农场", author: "杰瑞米·克拉克森", rating: 0, reading_status: "want", days_ago: 90 },
  { id: "b7", title: "翦商", author: "李硕", rating: 0, reading_status: "want", days_ago: 100 },
];

const bookList = bookSeeds.map(({ days_ago, ...b }, i) => ({
  ...b,
  cover: img(`book-${b.id}`, 600, 800),
  status: 2,
  sort_order: i,
  created_at: daysAgo(days_ago),
  updated_at: daysAgo(days_ago),
}));

const bookDetails = {
  b1: {
    review: `## 一句话推荐

把政府与经济的运行逻辑，讲成每个普通人都能读懂的身边事。

## 印象最深的点

- 地方政府「既当裁判员又当运动员」的双重角色
- 土地财政从何而来、往何处去的完整脉络

看完再看财经新闻，很多标题背后的动机一下子就通了。`,
    started_at: daysAgo(96),
    finished_at: daysAgo(12),
  },
  b2: {
    review: `「流程，是弱者才要遵循的规矩。」读到这句话的瞬间就值回书钱。三个晚上读完，最后一筒荔枝送到长安时，居然有点想哭。`,
    started_at: daysAgo(27),
    finished_at: daysAgo(25),
  },
  b3: {
    review: `读到一半，冷战时期的芯片暗战比小说还精彩。剩下半本留着通勤路上慢慢看。`,
    started_at: daysAgo(40),
    finished_at: null,
  },
  b4: {
    review: `「死是一件不必急于求成的事。」十五岁读到的是句子，三十岁再读才是人生。常读常新的一本小书。`,
    started_at: daysAgo(60),
    finished_at: daysAgo(58),
  },
  b5: {
    review: `财富与认知的段子合集，适合随手翻一篇。观点未必都认同，但「把自己产品化」确实在脑子里住下了。`,
    started_at: daysAgo(75),
    finished_at: null,
  },
};

const gameSeeds = [
  { id: "g1", title: "塞尔达传说：王国之泪", platform: "Switch", genre: "开放世界", play_status: "played", play_hours: 145, rating: 9.5, days_ago: 20 },
  { id: "g2", title: "艾尔登法环", platform: "PS5", genre: "动作角色扮演", play_status: "played", play_hours: 98, rating: 9, days_ago: 35 },
  { id: "g3", title: "星露谷物语", platform: "PC", genre: "模拟经营", play_status: "playing", play_hours: 210, rating: 9, days_ago: 60 },
  { id: "g4", title: "空洞骑士：丝之歌", platform: "Switch", genre: "类银河恶魔城", play_status: "playing", play_hours: 12, rating: 0, days_ago: 5 },
  { id: "g5", title: "双人成行", platform: "PS5", genre: "合作冒险", play_status: "played", play_hours: 14, rating: 8.5, days_ago: 120 },
  { id: "g6", title: "博德之门 3", platform: "PC", genre: "角色扮演", play_status: "want", play_hours: 0, rating: 0, days_ago: 90 },
  { id: "g7", title: "怪物猎人：荒野", platform: "PS5", genre: "动作", play_status: "want", play_hours: 0, rating: 0, days_ago: 70 },
];

const gameList = gameSeeds.map(({ days_ago, ...g }, i) => ({
  ...g,
  cover: img(`game-${g.id}`, 1200, 800),
  status: 2,
  sort_order: i,
  created_at: daysAgo(days_ago),
  updated_at: daysAgo(days_ago),
}));

const gameReviews = {
  g1: "空岛与地底的设计脑洞惊人，余料建造的自由度是系列之最。",
  g2: "受苦但有瘾，交界地的每一块箱庭都值得慢慢逛。",
  g3: "种田钓鱼养鸡，游戏里的农场比现实生活规律多了。",
  g4: "刚开场，地图又大又美，等玩明白了再来补分。",
  g5: "和另一半通关的最佳选择，关卡创意密度高到离谱。",
  g6: "被朋友安利了无数遍，等一个打折就入库。",
};

const fitnessList = [
  { id: "f1", title: "卧推 + 杠铃划船力量课", type: "strength", duration_min: 60, calories: 420, days_ago: 1 },
  { id: "f2", title: "晨跑 5 公里", type: "cardio", duration_min: 32, calories: 350, days_ago: 2 },
  { id: "f3", title: "全身拉伸放松课", type: "stretch", duration_min: 25, calories: 90, days_ago: 3 },
  { id: "f4", title: "深蹲日：下肢力量训练", type: "strength", duration_min: 70, calories: 480, days_ago: 5 },
  { id: "f5", title: "游泳 1500 米", type: "cardio", duration_min: 45, calories: 520, days_ago: 6 },
  { id: "f6", title: "HIIT 间歇训练", type: "cardio", duration_min: 20, calories: 280, days_ago: 8 },
  { id: "f7", title: "睡前肩颈瑜伽", type: "stretch", duration_min: 30, calories: 100, days_ago: 9 },
].map(({ days_ago, ...f }, i) => ({
  ...f,
  date: daysAgo(days_ago).slice(0, 10),
  status: 2,
  sort_order: i,
  created_at: daysAgo(days_ago),
  updated_at: daysAgo(days_ago),
}));

const techStackList = [
  { id: "ts1", name: "TypeScript", category: "语言", level: 4, description: "五年主力语言，类型体操与工程化配置都比较熟。", days_ago: 100 },
  { id: "ts2", name: "React", category: "前端框架", level: 4, description: "从 class 组件用到 Hooks，源码翻过几轮。", days_ago: 100 },
  { id: "ts3", name: "Next.js", category: "前端框架", level: 3, description: "App Router 与静态导出实践较多，RSC 还在跟进。", days_ago: 99 },
  { id: "ts4", name: "Tailwind CSS", category: "样式方案", level: 3, description: "全部主题的样式方案，对设计令牌组织有些心得。", days_ago: 99 },
  { id: "ts5", name: "Node.js", category: "运行时", level: 3, description: "脚本、CLI 与 BFF 场景常用，性能调优经验一般。", days_ago: 98 },
  { id: "ts6", name: "Go", category: "语言", level: 2, description: "能读懂服务端代码，写过小工具，没上过生产。", days_ago: 98 },
  { id: "ts7", name: "PostgreSQL", category: "数据库", level: 2, description: "常用查询与索引优化没问题，复杂调优要查文档。", days_ago: 97 },
  { id: "ts8", name: "Docker", category: "运维部署", level: 2, description: "写 Dockerfile 和 compose 编排熟练，K8s 还在学。", days_ago: 97 },
  { id: "ts9", name: "Rust", category: "语言", level: 1, description: "读完半本 The Book，代码停留在练习题水平。", days_ago: 96 },
  { id: "ts10", name: "Kubernetes", category: "运维部署", level: 1, description: "了解核心概念，实践仅限本地搭过一次集群。", days_ago: 96 },
].map(({ days_ago, ...t }, i) => ({
  ...t,
  icon: img(`tech-${t.id}`, 200, 200),
  status: 2,
  sort_order: i,
  created_at: daysAgo(days_ago),
  updated_at: daysAgo(days_ago),
}));

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

  // 地图嵌入页 mock（真实环境由 CMS 提供：Leaflet + OSM 免 key 底图，postMessage 上报高度）
  if (req.method === "GET" && path.startsWith("/map-embed/travel/")) {
    const travelId = decodeURIComponent(path.split("/").pop() || "");
    const extra = travelDetailExtra[travelId] || { attractions: [] };
    const pins = (extra.attractions || [])
      .map((a, i, arr) => {
        const x = arr.length > 1 ? 18 + (i * 64) / (arr.length - 1) : 50;
        const y = i % 2 === 0 ? 30 : 58;
        return `<div class="pin" style="left:${x}%;top:${y}%"><i></i><b>${a.name}</b></div>`;
      })
      .join("");
    const html = `<!doctype html>
<html lang="zh">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>景点地图</title>
<style>
html,body{margin:0}
.map{position:relative;height:420px;font-family:system-ui,-apple-system,"PingFang SC",sans-serif;overflow:hidden;
background:linear-gradient(rgba(148,163,184,.28) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.28) 1px,transparent 1px),linear-gradient(160deg,#eef2e6,#dbe7d4 60%,#cfe0d8);
background-size:28px 28px,28px 28px,cover}
.pin{position:absolute;transform:translate(-50%,-100%);text-align:center}
.pin i{display:block;width:14px;height:14px;border-radius:50% 50% 50% 0;background:#e0592a;border:2px solid #fff;transform:rotate(-45deg);margin:0 auto;box-shadow:0 2px 6px rgba(0,0,0,.25)}
.pin b{display:inline-block;margin-top:6px;padding:2px 8px;border-radius:999px;background:#fff;font-size:12px;color:#374151;box-shadow:0 1px 4px rgba(0,0,0,.2);white-space:nowrap}
.brand{position:absolute;right:10px;bottom:8px;font-size:11px;color:#7c8a84;background:rgba(255,255,255,.7);padding:1px 6px;border-radius:6px}
</style></head>
<body><div class="map">${pins}<span class="brand">OpenStreetMap · Leaflet（本地 mock）</span></div>
<script>
(function () {
  function post() {
    var h = parseInt(new URLSearchParams(location.search).get("h") || "420", 10);
    if (!isFinite(h)) h = 420;
    h = Math.min(2000, Math.max(240, h));
    document.querySelector(".map").style.height = h + "px";
    parent.postMessage({ type: "novablog-map-embed:height", height: h }, "*");
  }
  post();
  window.addEventListener("resize", post);
})();
</script></body></html>`;
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    });
    return res.end(html);
  }

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
      open_source_enabled: true,
      recipe_enabled: true,
      book_enabled: true,
      game_enabled: true,
      fitness_enabled: true,
      tech_stack_enabled: true,
      updated_at: daysAgo(1),
    });
  }

  // 分类 / 标签
  if (path === "/api/v1/public/categories") {
    const type = q.get("type");
    // 音乐分类单独维护：仅 type=music 时返回（与真实后端「默认仅 article 分类」的行为一致）
    if (type === "music") return ok(res, musicCategories);
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

  // 开源作品
  if (path === "/api/v1/public/open-sources") {
    let list = openSourceList;
    const kw = q.get("keyword");
    if (kw) list = list.filter((o) => o.name.includes(kw) || o.summary.includes(kw) || o.topics.includes(kw) || o.language.includes(kw));
    return ok(res, page(list, q));
  }
  const openSourceOne = path.match(/^\/api\/v1\/public\/open-sources\/([^/]+)$/);
  if (openSourceOne) {
    const o = openSourceList.find((x) => x.id === decodeURIComponent(openSourceOne[1]));
    if (!o) return notFound(res);
    return ok(res, { ...o, ...openSourceDetails[o.id] });
  }

  // 美食菜谱
  if (path === "/api/v1/public/recipes") {
    let list = recipeList;
    const kw = q.get("keyword");
    const difficulty = q.get("difficulty");
    if (kw) list = list.filter((r) => r.title.includes(kw) || r.summary.includes(kw) || r.tags.includes(kw));
    if (difficulty) list = list.filter((r) => String(r.difficulty) === difficulty);
    return ok(res, page(list, q));
  }
  const recipeOne = path.match(/^\/api\/v1\/public\/recipes\/([^/]+)$/);
  if (recipeOne) {
    const r = recipeList.find((x) => x.id === decodeURIComponent(recipeOne[1]));
    if (!r) return notFound(res);
    return ok(res, { ...r, ...(recipeDetails[r.id] || { ingredients: [], steps: [] }) });
  }

  // 读书书架
  if (path === "/api/v1/public/books") {
    let list = bookList;
    const kw = q.get("keyword");
    const readingStatus = q.get("reading_status");
    if (kw) list = list.filter((b) => b.title.includes(kw) || b.author.includes(kw));
    if (readingStatus && readingStatus !== "all") list = list.filter((b) => b.reading_status === readingStatus);
    return ok(res, page(list, q));
  }
  const bookOne = path.match(/^\/api\/v1\/public\/books\/([^/]+)$/);
  if (bookOne) {
    const b = bookList.find((x) => x.id === decodeURIComponent(bookOne[1]));
    if (!b) return notFound(res);
    return ok(res, { ...b, ...(bookDetails[b.id] || { review: "", started_at: null, finished_at: null }) });
  }

  // 游戏库
  if (path === "/api/v1/public/games") {
    let list = gameList;
    const kw = q.get("keyword");
    const platform = q.get("platform");
    const genre = q.get("genre");
    const playStatus = q.get("play_status");
    if (kw) list = list.filter((g) => g.title.includes(kw) || g.genre.includes(kw));
    if (platform) list = list.filter((g) => g.platform === platform);
    if (genre) list = list.filter((g) => g.genre === genre);
    if (playStatus && playStatus !== "all") list = list.filter((g) => g.play_status === playStatus);
    return ok(res, page(list, q));
  }
  const gameOne = path.match(/^\/api\/v1\/public\/games\/([^/]+)$/);
  if (gameOne) {
    const g = gameList.find((x) => x.id === decodeURIComponent(gameOne[1]));
    if (!g) return notFound(res);
    return ok(res, { ...g, short_review: gameReviews[g.id] || "" });
  }

  // 健身训练（仅列表）
  if (path === "/api/v1/public/fitness") {
    let list = fitnessList;
    const kw = q.get("keyword");
    const type = q.get("type");
    if (kw) list = list.filter((f) => f.title.includes(kw));
    if (type && type !== "all") list = list.filter((f) => f.type === type);
    return ok(res, page(list, q));
  }

  // 技术栈（仅列表）
  if (path === "/api/v1/public/tech-stacks") {
    let list = techStackList;
    const kw = q.get("keyword");
    const category = q.get("category");
    const level = q.get("level");
    if (kw) list = list.filter((t) => t.name.includes(kw) || t.description.includes(kw));
    if (category) list = list.filter((t) => t.category === category);
    if (level) list = list.filter((t) => String(t.level) === level);
    return ok(res, page(list, q));
  }

  res.writeHead(404, { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" });
  res.end(JSON.stringify({ code: 404001, msg: "资源不存在" }));
});

server.listen(PORT, "127.0.0.1", () => console.log(`[mock] universal mock API listening on http://127.0.0.1:${PORT}`));
