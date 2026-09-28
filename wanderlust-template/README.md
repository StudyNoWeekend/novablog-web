# wanderlust-template（漫游世界）

面向旅行爱好者的清新手账风 novablog 前端主题：暖白底 + 墨绿主色 + 手写体点缀，布局参照「WanderLina」旅行博客设计稿：全幅 Hero + 分类磁贴 + 最新游记/博主卡两栏结构。

## 页面结构

| 路由 | 说明 | 模块开关 |
|------|------|------|
| `/` | 首页：Hero（去看更大的世界 + 目的地搜索）+ 分类磁贴 + 最新游记 + 侧边栏（博主卡片/热门文章）+ 下一站 CTA | — |
| `/destinations` | 目的地：按目的地聚合全部已发布攻略，点击进入按关键词筛选的攻略列表 | `travel_enabled` |
| `/articles` | 游记列表：搜索、分类筛选、分页 + 侧边栏（热门文章/标签云） | `article_enabled` |
| `/articles/[slug]` | 游记详情（构建期 SSG 预渲染，未预渲染的由 `public/article.html` 壳页面兜底） | `article_enabled` |
| `/travels` | 旅行攻略列表：搜索、天数筛选、排序、分页 | `travel_enabled` |
| `/travels/[id]` | 攻略详情（景点/行程/评价 + 点赞，未预渲染的由 `public/travel.html` 壳页面兜底） | `travel_enabled` |
| `/gear` | 旅行装备列表：搜索 | `equipment_enabled` |
| `/gear/[id]` | 装备详情（构建期 SSG 预渲染） | `equipment_enabled` |
| `/music` | 旅途音乐：歌曲列表（右下角悬浮播放器，B 站外链 iframe 播放）+ 第三方歌单 | `music_enabled` |
| `/open-source`、`/open-source/[id]` | 开源作品列表与详情，渲染 Markdown README、仓库与主页外链 | `open_source_enabled` |
| `/recipes`、`/recipes/[id]` | 美食菜谱列表与详情，含难度筛选、食材清单与编号步骤图 | `recipe_enabled` |
| `/books`、`/books/[id]` | 读书书架列表与详情，含阅读状态筛选、星级与 Markdown 书评 | `book_enabled` |
| `/games`、`/games/[id]` | 游戏库列表与详情，含游玩状态筛选、评分（x/10）与短评 | `game_enabled` |
| `/fitness` | 健身训练记录列表，含训练类型筛选（仅列表页） | `fitness_enabled` |
| `/tech-stack` | 技术栈列表，含熟练度筛选与 4 档进度展示（仅列表页） | `tech_stack_enabled` |
| `/about` | 关于我（博主资料 + 标签 + 社交链接） | — |

导航与页面展示由后端「模块开关配置」（`/api/v1/public/module-config`）驱动：关闭文章模块会隐藏游记入口，关闭旅行模块会隐藏目的地/攻略入口，关闭器材模块会隐藏装备入口，关闭音乐模块会隐藏音乐入口。六个新模块入口统一收纳在导航「更多」下拉与移动端「更多功能」小节中，随开关过滤；页脚同步展示对应链接。

## 对接的公开接口

与 lens-life-template 完全一致的数据层（`lib/api/*`）：`blogger`、`articles`（列表/详情/hot/random/view）、`categories`、`tags`、`comments`（列表/发表）、`travels`（列表/详情/hot/view/like）、`equipments`、`module-config`，以及 `open-sources`、`recipes`、`books`、`games`、`fitness`、`tech-stacks` 六个新模块（有详情接口的四个模块含 detail 取数）。统一走 `lib/api/client.ts` 三级回退（theme-config.js 注入 → 环境变量 → 同域相对路径），全部取数函数失败时回退空数据。

## 本地开发

```bash
pnpm install
cp .env.local.example .env.local
# 编辑 .env.local，设置 NEXT_PUBLIC_API_BASE_URL 为 novablog API 地址
pnpm dev
```

## 生产构建

```bash
# 发布前自检：清空 API 地址做离线构建（规范 5.5）
NEXT_PUBLIC_API_BASE_URL= pnpm build
grep -r "localhost\|127.0.0.1" dist/ && echo "发现硬编码地址" || echo "自检通过"
```

构建产物输出到 `dist/` 目录。后端不可达时构建依然可通过：各动态详情页在构建期拉取 id 列表，拉取失败或为空时生成 `__fallback__` 占位页；未被预渲染的动态路径由 `theme.json` 的 `routes.fallback` 兜底到 `dist/article.html`、`dist/travel.html`、`dist/open-source.html`、`dist/recipe.html`、`dist/book.html`、`dist/game.html` 壳页面，由 CMS 托管层在运行时返回。版本号保持 `theme.json`、`package.json` 一致，发布时打 `wanderlust-template-v{版本}` tag。
